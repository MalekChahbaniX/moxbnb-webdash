'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Home, 
  Bath, 
  Bed, 
  Calendar as CalendarIcon, 
  Share2,
  Heart,
  CheckCircle,
  ChevronLeft,
  Image as ImageIcon,
  Wifi,
  Car,
  Snowflake,
  Waves,
  Utensils,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ContactHostModal from '@/components/moxbnb/ContactHostModal';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 5));
  const [guests, setGuests] = useState(2);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/listings/${params.id}`);
        const propertyData = response.data?.data?.listing || response.data?.data || response.data;
        console.log('Property data:', propertyData);
        setProperty(propertyData);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Property not found'}</p>
          <Button onClick={() => router.back()}>Retour</Button>
        </div>
      </div>
    );
  }

  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, any> = {
      'WiFi': Wifi,
      'Climatisation': Snowflake,
      'Vue mer': Waves,
      'Cuisine équipée': Utensils,
      'Parking': Car
    };
    return iconMap[amenity] || CheckCircle;
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert('Veuillez sélectionner vos dates');
      return;
    }
    // Navigate to booking confirmation page
    router.push(`/bookings/confirm?propertyId=${params.id}&checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}&guests=${guests}`);
  };

  const handleContactHost = () => {
    // Open internal contact modal
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">{property.title || 'Logement'}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 row-span-2">
                <img
                  src={property.images?.[selectedImage] || '/api/placeholder/800/600'}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedImage(0)}
                />
              </div>
              {property.images?.slice(1).map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`${property.title} ${index + 2}`}
                  className={`w-full h-44 object-cover rounded-lg cursor-pointer ${
                    selectedImage === index + 1 ? 'ring-4 ring-rose-500' : ''
                  }`}
                  onClick={() => setSelectedImage(index + 1)}
                />
              ))}
            </div>

            {/* Quick Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-semibold">{property.rating}</span>
                  <span className="text-muted-foreground ml-1">({property.reviews} avis)</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">À propos de ce logement</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Ce que propose ce logement</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(property.amenities || []).map((amenity: string, index: number) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-rose-600" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Property Features */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Caractéristiques</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Bed className="h-5 w-5" />
                  <span>{property.bedrooms} chambre{property.bedrooms > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Bath className="h-5 w-5" />
                  <span>{property.bathrooms} SDB</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <span>Max {property.maxGuests} voyageurs</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Home className="h-5 w-5" />
                  <Badge variant="outline">{property.type}</Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* House Rules */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Règles de la maison</h2>
              <ul className="space-y-2">
                {(property.houseRules || []).map((rule: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 z-40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-rose-600">{property.price || 0} DT</span>
                    <span className="text-muted-foreground text-sm">/ nuit</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{property.rating || 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="border rounded-lg p-3">
                    <label className="block text-sm font-medium mb-2">Dates</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-12"
                            id="check-in-trigger"
                          >
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {checkIn ? format(checkIn, 'dd MMM yyyy', { locale: fr }) : "Arrivée"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start" side="bottom">
                          <Calendar
                            mode="single"
                            selected={checkIn}
                            onSelect={(date) => {
                              setCheckIn(date);
                              setIsCheckInOpen(false);
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-12"
                            id="check-out-trigger"
                          >
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {checkOut ? format(checkOut, 'dd MMM yyyy', { locale: fr }) : "Départ"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start" side="bottom">
                          <Calendar
                            mode="single"
                            selected={checkOut}
                            onSelect={(date) => {
                              setCheckOut(date);
                              setIsCheckOutOpen(false);
                            }}
                            disabled={(date) => !checkIn || date < checkIn}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="border rounded-lg p-3">
                    <label className="block text-sm font-medium mb-2">Voyageurs</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{guests} voyageur{guests > 1 ? 's' : ''}</span>
                      </div>
                      <select 
                        className="border rounded px-3 py-1 text-sm" 
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-rose-600 hover:bg-rose-700 mb-3" 
                  size="lg"
                  onClick={handleBooking}
                >
                  Réserver
                </Button>

                <p className="text-xs text-center text-muted-foreground mb-4">
                  Aucun montant ne vous sera débité pour le moment
                </p>

                <Separator className="my-4" />

                {/* Host Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Votre hôte</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-medium">{property.hostId?.firstName && property.hostId?.lastName ? `${property.hostId.firstName} ${property.hostId.lastName}` : 'Hôte'}</p>
                      <p className="text-sm text-muted-foreground">Membre depuis {new Date(property.hostId?.createdAt || Date.now()).getFullYear()}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux de réponse</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temps de réponse</span>
                      <span className="font-medium">Quelques heures</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avis reçus</span>
                      <span className="font-medium">{property.reviews?.length || 0}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContactHost}
                  >
                    Contacter l'hôte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Contact Host Modal */}
      <ContactHostModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        hostId={property?.hostId?._id}
        hostName={`${property?.hostId?.firstName || ''} ${property?.hostId?.lastName || ''}`.trim() || 'Hôte'}
        propertyTitle={property?.title}
        userId={user?.id}
      />
    </div>
  );
}
