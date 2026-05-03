'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LocationData {
  address: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: Partial<LocationData>;
  className?: string;
}

export default function LocationPicker({ 
  onLocationSelect, 
  initialLocation,
  className = '' 
}: LocationPickerProps) {
  const [location, setLocation] = useState<LocationData>({
    address: initialLocation?.address || '',
    city: initialLocation?.city || '',
    country: initialLocation?.country || 'Tunisie',
    coordinates: {
      lat: initialLocation?.coordinates?.lat || 33.820627,
      lng: initialLocation?.coordinates?.lng || 11.04222
    }
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Initialize map
  useEffect(() => {
    // Prevent multiple initializations
    if (mapInstanceRef.current || !mapRef.current) return;

    const initMap = async () => {
      try {
        // Load Leaflet dynamically
        const L = await import('leaflet');
        
        // Fix for default markers in Leaflet with webpack
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Initialize map with unique ID to prevent conflicts
        const map = L.map(mapRef.current!, {
          zoomControl: true,
          attributionControl: true
        }).setView([location.coordinates.lat, location.coordinates.lng], 13);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Add marker
        const marker = L.marker([location.coordinates.lat, location.coordinates.lng], {
          draggable: true,
          autoPan: true
        }).addTo(map);

        // Handle map click to place marker
        map.on('click', async (event: any) => {
          const lat = event.latlng.lat;
          const lng = event.latlng.lng;
          
          console.log('Map clicked at:', lat, lng);
          
          // Move marker to clicked position
          marker.setLatLng([lat, lng]);
          
          // Update location state
          setLocation(prev => ({
            ...prev,
            coordinates: {
              lat: lat,
              lng: lng
            }
          }));

          // Reverse geocoding to get address
          const addressData = await reverseGeocode(lat, lng);
          if (addressData) {
            const newLocation = {
              ...addressData,
              coordinates: { lat, lng }
            };
            setLocation(newLocation);
            onLocationSelect(newLocation);
          }
        });

        // Handle marker drag
        marker.on('dragend', async (event: any) => {
          const marker = event.target;
          const position = marker.getLatLng();
          
          console.log('Marker dragged to:', position.lat, position.lng);
          
          // Reverse geocoding to get address
          const addressData = await reverseGeocode(position.lat, position.lng);
          if (addressData) {
            const newLocation = {
              ...addressData,
              coordinates: {
                lat: position.lat,
                lng: position.lng
              }
            };
            console.log('Setting new location:', newLocation);
            setLocation(newLocation);
            onLocationSelect(newLocation);
          } else {
            // Fallback: update coordinates only
            const fallbackLocation = {
              ...location,
              coordinates: {
                lat: position.lat,
                lng: position.lng
              }
            };
            console.log('Setting fallback location:', fallbackLocation);
            setLocation(fallbackLocation);
            onLocationSelect(fallbackLocation);
          }
        });

        // Store references
        mapInstanceRef.current = map;
        markerRef.current = marker;
        
        console.log('Map initialized with marker at:', location.coordinates);
        setIsMapLoading(false);

      } catch (error) {
        console.error('Error initializing map:', error);
        setIsMapLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Search for locations with better error handling
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=tn`,
        {
          headers: {
            'User-Agent': 'Moxbnb/1.0 (contact@moxbnb.com)'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.log('Search failed, showing no results');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Reverse geocoding with fallback
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      console.log('Reverse geocoding for:', lat, lng);
      
      // Try multiple geocoding services with fallback
      const services = [
        // Service 1: Nominatim with user agent and delay
        {
          url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`,
          headers: {
            'User-Agent': 'Moxbnb/1.0 (contact@moxbnb.com)'
          }
        },
        // Service 2: Alternative service (if available)
        {
          url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          headers: {
            'User-Agent': 'Moxbnb/1.0 (contact@moxbnb.com)'
          }
        }
      ];

      for (const service of services) {
        try {
          const response = await fetch(service.url, {
            method: 'GET',
            headers: service.headers
          });
          
          if (response.ok) {
            const data = await response.json();
            
            const result = {
              address: data.display_name || `Position: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              city: data.address?.city || data.address?.town || data.address?.village || 'Inconnue',
              country: data.address?.country || 'Tunisie'
            };
            
            console.log('Reverse geocoding result:', result);
            return result;
          }
        } catch (serviceError) {
          console.log('Service failed, trying next...', serviceError);
          // Continue to next service
        }
      }

      // Fallback: Generate basic location info
      const fallbackResult = {
        address: `Position GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        city: 'Inconnue',
        country: 'Tunisie'
      };
      
      console.log('Using fallback result:', fallbackResult);
      return fallbackResult;
      
    } catch (error) {
      console.error('All reverse geocoding services failed:', error);
      
      // Ultimate fallback
      return {
        address: `Position GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        city: 'Inconnue',
        country: 'Tunisie'
      };
    }
  };

  // Handle search selection
  const handleSearchSelect = async (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    console.log('Moving marker to:', lat, lng); // Debug log

    // Update map
    if (mapInstanceRef.current && markerRef.current) {
      // Update map view
      mapInstanceRef.current.setView([lat, lng], 15);
      
      // Update marker position
      markerRef.current.setLatLng([lat, lng]);
      
      // Force map to redraw
      mapInstanceRef.current.invalidateSize();

      // Update location state
      const addressData = await reverseGeocode(lat, lng);
      if (addressData) {
        const newLocation = {
          ...addressData,
          coordinates: { lat, lng }
        };
        setLocation(newLocation);
        onLocationSelect(newLocation);
      }
    } else {
      console.log('Map or marker not available');
    }

    setSearchResults([]);
    setSearchQuery('');
  };

  // Handle manual input changes
  const handleInputChange = (field: keyof LocationData, value: string) => {
    const newLocation = { ...location, [field]: value };
    setLocation(newLocation);
    onLocationSelect(newLocation);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15);
            markerRef.current.setLatLng([latitude, longitude]);

            const addressData = await reverseGeocode(latitude, longitude);
            if (addressData) {
              const newLocation = {
                ...addressData,
                coordinates: { lat: latitude, lng: longitude }
              };
              setLocation(newLocation);
              onLocationSelect(newLocation);
            }
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Label htmlFor="location-search">Rechercher une adresse</Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="location-search"
            type="text"
            placeholder="Tapez une adresse ou un lieu..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchLocation(e.target.value);
            }}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
            <CardContent className="p-0">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleSearchSelect(result)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                >
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{result.display_name}</p>
                      <p className="text-xs text-gray-500">
                        {result.class === 'highway' ? 'Route' : 
                         result.class === 'amenity' ? 'Établissement' :
                         result.class === 'shop' ? 'Magasin' : 'Lieu'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Map Container */}
      <div className="space-y-2">
        <Label>Localisation sur la carte</Label>
        <div className="relative" style={{ zIndex: 1, maxWidth: '100%', overflow: 'hidden' }}>
          <div 
            ref={mapRef} 
            className="rounded-lg border border-gray-200"
            style={{ 
              width: '100%',
              maxWidth: '800px',
              height: '400px',
              maxHeight: '500px',
              minHeight: '300px',
              position: 'relative',
              zIndex: 1,
              overflow: 'hidden'
            }}
          />
          {isMapLoading && (
            <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10" style={{ backgroundColor: 'rgba(243, 244, 246, 0.9)' }}>
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Chargement de la carte...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Current Location Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          className="w-full"
          style={{ maxWidth: '800px' }}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Utiliser ma position actuelle
        </Button>
      </div>

      {/* Location Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Adresse complète</Label>
          <Input
            id="address"
            value={location.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Adresse détaillée"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            value={location.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Tunis"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="country">Pays</Label>
        <Input
          id="country"
          value={location.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
          placeholder="Tunisie"
        />
      </div>
    </div>
  );
}
