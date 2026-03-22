'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Star, 
  Users, 
  Home, 
  Bath, 
  Bed, 
  Calendar, 
  Share2,
  Heart,
  CheckCircle,
  ChevronLeft,
  Image as ImageIcon,
  Wifi,
  Car,
  Utensils,
  Snowflake,
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock property data - in production, fetch from API
  const property = {
    id: params.id,
    title: 'Appartement de Charme à Sidi Bou Said',
    type: 'appartment',
    location: 'Sidi Bou Said, Tunis',
    price: 350,
    rating: 4.9,
    reviews: 127,
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    description: 'Magnifique appartement avec vue mer, décoré dans le style traditionnel tunisien. À 5 minutes de la plage. Idéal pour les couples ou petites familles cherchant une expérience authentique dans un village pittoresque.',
    houseRules: [
      'Non fumeur',
      'Pas de fêtes',
      'Animaux non autorisés',
      'Arrivée à partir de 14h00',
      'Départ avant 11h00'
    ],
    amenities: [
      'WiFi',
      'Climatisation',
      'Vue mer',
      'Cuisine équipée',
      'Parking',
      'Machine à laver',
      'TV',
      'Fer à repasser'
    ],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
    ],
    host: {
      name: 'Fatma Ben Ali',
      avatar: null,
      responseRate: 98,
      responseTime: '1 heure',
      memberSince: '2023',
      reviews: 342
    }
  };

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
    // Navigate to booking page or open booking modal
    console.log('Booking property:', property.id);
  };

  const handleContactHost = () => {
    // Open contact modal
    console.log('Contacting host:', property.host.name);
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
          <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
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
                  src={property.images[selectedImage]}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedImage(0)}
                />
              </div>
              {property.images.slice(1).map((image, index) => (
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
                {property.amenities.map((amenity, index) => {
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
                {property.houseRules.map((rule, index) => (
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
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-rose-600">{property.price} DT</span>
                    <span className="text-muted-foreground text-sm">/ nuit</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{property.rating}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="border rounded-lg p-3">
                    <label className="block text-sm font-medium mb-2">Dates</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border rounded p-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mb-1" />
                        <p className="text-sm text-muted-foreground">Arrivée</p>
                        <p className="text-sm font-medium">15 Jan 2025</p>
                      </div>
                      <div className="border rounded p-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mb-1" />
                        <p className="text-sm text-muted-foreground">Départ</p>
                        <p className="text-sm font-medium">20 Jan 2025</p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-3">
                    <label className="block text-sm font-medium mb-2">Voyageurs</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">2 voyageurs</span>
                      </div>
                      <select className="border rounded px-3 py-1 text-sm">
                        <option>1</option>
                        <option selected>2</option>
                        <option>3</option>
                        <option>4</option>
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
                      <p className="font-medium">{property.host.name}</p>
                      <p className="text-sm text-muted-foreground">Membre depuis {property.host.memberSince}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux de réponse</span>
                      <span className="font-medium">{property.host.responseRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temps de réponse</span>
                      <span className="font-medium">{property.host.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avis reçus</span>
                      <span className="font-medium">{property.host.reviews}</span>
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
    </div>
  );
}
