'use client';

import { useState } from 'react';
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

export default function ExperienceDetail() {
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock experience data
  const experience = {
    id: params.id,
    title: 'Dégustation de Cuisine Traditionnelle Tunisienne',
    category: 'Culinaire',
    location: 'Tunis, Tunisie',
    price: 150,
    duration: '4 heures',
    maxGuests: 8,
    rating: 4.9,
    reviews: 234,
    description: 'Apprenez à préparer les plats tunisiens emblématiques comme le couscous, le tajine et les briks avec une chef locale experte. Cette expérience culinaire vous emmènera dans un voyage authentique à travers les saveurs de la Tunisie. Vous découvrirez les secrets de la cuisine traditionnelle tout en dégustant vos créations.',
    requirements: [
      'Aucun niveau requis',
      'Vêtements confortables recommandés',
      'Informez-nous des allergies alimentaires',
      'Disponible en français et en arabe'
    ],
    whatYouWillDo: [
      'Découverte des épices tunisiennes',
      'Préparation de 3 plats traditionnels',
      'Dégustation de vos créations',
      'Livret de recettes à emporter',
      'Photos de votre expérience'
    ],
    whatIsIncluded: [
      'Ingrédients frais et locaux',
      'Équipement de cuisine complet',
      'Livret de recettes',
      'Boissons et collations',
      'Certificat de participation'
    ],
    images: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
    ],
    host: {
      name: 'Fatma Ben Ali',
      avatar: null,
      responseRate: 99,
      responseTime: '30 min',
      memberSince: '2022',
      reviews: 567,
      superhost: true
    }
  };

  const handleBooking = () => {
    console.log('Booking experience:', experience.id);
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
                  src={experience.images[selectedImage]}
                  alt={experience.title}
                  className="w-full h-96 object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedImage(0)}
                />
              </div>
              {experience.images.slice(1).map((image, index) => (
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
                {experience.whatYouWillDo.map((item, index) => (
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
                {experience.whatIsIncluded.map((item, index) => (
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
                {experience.requirements.map((req, index) => (
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
                    {experience.host.superhost && (
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
                      <p className="font-medium">{experience.host.name}</p>
                      <p className="text-sm text-muted-foreground">Membre depuis {experience.host.memberSince}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux de réponse</span>
                      <span className="font-medium">{experience.host.responseRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temps de réponse</span>
                      <span className="font-medium">{experience.host.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avis reçus</span>
                      <span className="font-medium">{experience.host.reviews}</span>
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
