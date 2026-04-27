'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';

// Fix for default marker icon in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialPosition?: { lat: number; lng: number };
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({ onLocationSelect, initialPosition }: LocationPickerProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number }>(
    initialPosition || { lat: 33.8869, lng: 9.5375 } // Default: Tunisia center
  );
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const geocodeCacheRef = useRef<Map<string, string>>(new Map());
  const isRequestingRef = useRef(false);

  const reverseGeocode = async (lat: number, lng: number) => {
    // Prevent simultaneous requests
    if (isRequestingRef.current) {
      return;
    }

    // Check cache first
    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    const cachedAddress = geocodeCacheRef.current.get(cacheKey);
    
    if (cachedAddress) {
      setAddress(cachedAddress);
      onLocationSelect(lat, lng, cachedAddress);
      return;
    }

    isRequestingRef.current = true;
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `/api/geocode/reverse?lat=${lat}&lon=${lng}&zoom=18`
      );
      
      if (response.status === 429) {
        setError('Trop de requêtes. Veuillez réessayer dans quelques instants.');
        return;
      }
      
      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        const street = addr.road || addr.street || '';
        const city = addr.city || addr.town || addr.village || addr.county || '';
        const country = addr.country || '';
        
        const fullAddress = [street, city, country].filter(Boolean).join(', ');
        
        // Cache the result
        geocodeCacheRef.current.set(cacheKey, fullAddress);
        
        setAddress(fullAddress);
        onLocationSelect(lat, lng, fullAddress);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setError('Impossible de récupérer l\'adresse. Veuillez réessayer.');
      onLocationSelect(lat, lng, '');
    } finally {
      setLoading(false);
      isRequestingRef.current = false;
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setPosition({ lat, lng });
    setError('');
    setAddress('');
  };

  const handleGetAddress = () => {
    reverseGeocode(position.lat, position.lng);
  };

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  return (
    <div className="space-y-4">
      <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[position.lat, position.lng]} />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
        </MapContainer>
      </div>
      
      <div className="flex gap-2">
        <Button 
          type="button" 
          onClick={handleGetAddress}
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Recherche...
            </>
          ) : (
            'Obtenir l\'adresse'
          )}
        </Button>
      </div>
      
      {error && !loading && (
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {address && !loading && !error && (
        <div className="p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm font-medium text-gray-700">Adresse sélectionnée :</p>
          <p className="text-sm text-gray-600">{address}</p>
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        Cliquez sur la carte pour sélectionner l'emplacement, puis cliquez sur "Obtenir l'adresse"
      </p>
    </div>
  );
}
