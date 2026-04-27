'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Star, 
  Users, 
  Calendar, 
  Clock,
  Share2,
  Heart,
  ChevronLeft,
  CheckCircle,
  User,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';

export default function ExperienceDetail() {
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/experiences/${params.id}`);
        setExperience(response.data?.data || response.data);
      } catch (err) {
        console.error('Error fetching experience:', err);
        setError('Failed to load experience');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchExperience();
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

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Experience not found'}</p>
          <Button onClick={() => router.back()}>Retour</Button>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    console.log('Booking experience:', experience._id);
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
          <h1 className="text-2xl md:text-3xl font-bold">{experience.title}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Experience Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 row-span-2">
                <img
                  src={experience.images?.[selectedImage] || '/api/placeholder/800/600'}
                  alt={experience.title}
                  className="w-full h-96 object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedImage(0)}
                />
              </div>
              {experience.images?.slice(1).map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`${experience.title} ${index + 2}`}
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
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-semibold">{experience.rating}</span>
                  <span className="text-muted-foreground ml-1">({experience.reviews} avis)</span>
                </div>
                <Badge variant="outline">{experience.category}</Badge>
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
              <h2 className="text-xl font-semibold mb-4">À propos de cette expérience</h2>
              <p className="text-muted-foreground leading-relaxed">
                {experience.description}
              </p>
            </div>

            {/* What You Will Do */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Ce que vous ferez</h2>
              <ul className="space-y-3">
                {(experience.whatYouWillDo || []).map((item: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What Is Included */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Ce qui est inclus</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(experience.whatIsIncluded || []).map((item: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Requirements */}
            <div>
              <h2 className="text-xl font-semibold mb-4">À savoir avant de réserver</h2>
              <ul className="space-y-2">
                {(experience.requirements || []).map((req: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
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
                    <span>{experience.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="h-5 w-5" />
                    <span>Max {experience.maxGuests} personnes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>{experience.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-rose-600">{experience.price} DT</span>
                    <span className="text-muted-foreground text-sm">/ personne</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{experience.rating}</span>
                  </div>
                </div>

                <div className="border rounded-lg p-3 mb-4">
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <div className="border rounded p-2 flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <select className="flex-1 bg-transparent outline-none text-sm">
                      <option>18 Jan 2025 - 14:00</option>
                      <option>19 Jan 2025 - 14:00</option>
                      <option>20 Jan 2025 - 14:00</option>
                      <option>21 Jan 2025 - 14:00</option>
                    </select>
                  </div>
                </div>

                <div className="border rounded-lg p-3 mb-4">
                  <label className="block text-sm font-medium mb-2">Nombre de participants</label>
                  <select className="w-full border rounded px-3 py-2 text-sm">
                    <option>1 personne</option>
                    <option>2 personnes</option>
                    <option>3 personnes</option>
                    <option>4 personnes</option>
                    <option>5 personnes</option>
                    <option>6 personnes</option>
                    <option>7 personnes</option>
                    <option selected>8 personnes (max)</option>
                  </select>
                </div>

                <Button 
                  className="w-full bg-rose-600 hover:bg-rose-700 mb-3" 
                  size="lg"
                  onClick={handleBooking}
                >
                  Réserver cette expérience
                </Button>

                <p className="text-xs text-center text-muted-foreground mb-4">
                  Annulation gratuite jusqu'à 24h avant l'expérience
                </p>

                <Separator className="my-4" />

                {/* Host Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {experience.host?.superhost && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Award className="h-3 w-3 mr-1" />
                        Superhôte
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold">Votre hôte</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-medium">{experience.host?.name || 'Hôte'}</p>
                      <p className="text-sm text-muted-foreground">Membre depuis {experience.host?.memberSince || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux de réponse</span>
                      <span className="font-medium">{experience.host?.responseRate || 'N/A'}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temps de réponse</span>
                      <span className="font-medium">{experience.host?.responseTime || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avis reçus</span>
                      <span className="font-medium">{experience.host?.reviews || 'N/A'}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
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
