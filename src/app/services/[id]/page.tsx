'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Star, 
  Clock,
  Share2,
  Heart,
  ChevronLeft,
  CheckCircle,
  User,
  Calendar,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';

export default function ServiceDetail() {
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/services/${params.id}`);
        setService(response.data?.data || response.data);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchService();
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

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Service not found'}</p>
          <Button onClick={() => router.back()}>Retour</Button>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    console.log('Booking service:', service._id);
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
          <h1 className="text-2xl md:text-3xl font-bold">{service.title}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 row-span-2">
                <img
                  src={service.images?.[selectedImage] || '/api/placeholder/800/600'}
                  alt={service.title}
                  className="w-full h-96 object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedImage(0)}
                />
              </div>
              {service.images?.slice(1).map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`${service.title} ${index + 2}`}
                  className={`w-full h-44 object-cover rounded-lg cursor-pointer ${
                    selectedImage === index + 1 ? 'ring-4 ring-rose-500' : ''
                  }`}
                  onClick={() => setSelectedImage(index + 1)}
                />
              ))}
            </div>

            {/* Quick Info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline">{service.type}</Badge>
                {service.available ? (
                  <Badge className="bg-green-100 text-green-800">Disponible</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">Non disponible</Badge>
                )}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{service.rating}</span>
                <span className="text-muted-foreground ml-1">({service.reviews} avis)</span>
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
              <h2 className="text-xl font-semibold mb-4">À propos de ce service</h2>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Services Included */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Ce qui est inclus</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(service.servicesIncluded || []).map((item: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Options */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Options de menu</h2>
              <div className="space-y-2">
                {(service.menuOptions || []).map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <CheckCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
                    <span className="text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Localisation</h2>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{service.location}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                {/* Quick Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>{service.city}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-rose-600">{service.price} DT</span>
                    <span className="text-muted-foreground text-sm">/ prestation</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{service.rating}</span>
                  </div>
                </div>

                <div className="border rounded-lg p-3 mb-4">
                  <label className="block text-sm font-medium mb-2">Date souhaitée</label>
                  <div className="border rounded p-2 flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <select className="flex-1 bg-transparent outline-none text-sm">
                      <option>15 Jan 2025 - Matin</option>
                      <option>16 Jan 2025 - Matin</option>
                      <option>17 Jan 2025 - Matin</option>
                      <option>18 Jan 2025 - Après-midi</option>
                    </select>
                  </div>
                </div>

                <div className="border rounded-lg p-3 mb-4">
                  <label className="block text-sm font-medium mb-2">Nombre de personnes</label>
                  <select className="w-full border rounded px-3 py-2 text-sm">
                    <option>1 personne</option>
                    <option selected>2 personnes</option>
                    <option>3 personnes</option>
                    <option>4 personnes</option>
                    <option>5+ personnes (contactez-nous)</option>
                  </select>
                </div>

                <div className="border rounded-lg p-3 mb-4">
                  <label className="block text-sm font-medium mb-2">Options de menu</label>
                  <select className="w-full border rounded px-3 py-2 text-sm">
                    {(service.menuOptions || []).map((option: string, index: number) => (
                      <option key={index}>{option}</option>
                    ))}
                  </select>
                </div>

                {service.available ? (
                  <Button 
                    className="w-full bg-rose-600 hover:bg-rose-700 mb-3" 
                    size="lg"
                    onClick={handleBooking}
                  >
                    Réserver ce service
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled
                  >
                    Non disponible
                  </Button>
                )}

                <p className="text-xs text-center text-muted-foreground mb-4">
                  Annulation gratuite jusqu'à 48h avant la prestation
                </p>

                <Separator className="my-4" />

                {/* Provider Info */}
                <div className="space-y-3">
                  {service.provider?.verified && (
                    <Badge className="bg-blue-100 text-blue-800 mb-2">
                      <Award className="h-3 w-3 mr-1" />
                      Prestataire vérifié
                    </Badge>
                  )}
                  <h3 className="font-semibold">Votre prestataire</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-medium">{service.provider?.name || 'Prestataire'}</p>
                      <p className="text-sm text-muted-foreground">Membre depuis {service.provider?.memberSince || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux de réponse</span>
                      <span className="font-medium">{service.provider?.responseRate || 'N/A'}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temps de réponse</span>
                      <span className="font-medium">{service.provider?.responseTime || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avis reçus</span>
                      <span className="font-medium">{service.provider?.reviews || 'N/A'}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Contacter le prestataire
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
