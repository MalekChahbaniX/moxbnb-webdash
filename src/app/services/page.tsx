'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ServiceCard from '@/components/moxbnb/ServiceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');

  const allServices = [
    {
      id: '1',
      title: 'Cuisine Traditionnelle à Domicile',
      provider: 'Chef Fatma Mansouri',
      type: 'Chef privé',
      location: 'Tunis',
      city: 'Tunis',
      price: 500,
      duration: '4 heures',
      rating: 4.9,
      reviews: 78,
      available: true,
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop'
    },
    {
      id: '2',
      title: 'Soin Massage Relaxant',
      provider: 'Spa Zen Hammamet',
      type: 'Massages',
      location: 'Hammamet',
      city: 'Nabeul',
      price: 200,
      duration: '1 heure',
      rating: 4.8,
      reviews: 156,
      available: true,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop'
    },
    {
      id: '3',
      title: 'Coaching Sportif Personnalisé',
      provider: 'Karim Ben Hassen',
      type: 'Coach sportif',
      location: 'Sousse',
      city: 'Sousse',
      price: 150,
      duration: '1 heure',
      rating: 4.95,
      reviews: 203,
      available: true,
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop'
    },
    {
      id: '4',
      title: 'Séance Photo Voyage',
      provider: 'Studio Photo Tunis',
      type: 'Photographie',
      location: 'Tunis',
      city: 'Tunis',
      price: 350,
      duration: '2 heures',
      rating: 4.92,
      reviews: 89,
      available: true,
      image: 'https://images.unsplash.com/photo-1554048612-b6a484d98b7?w=800&h=600&fit=crop'
    },
    {
      id: '5',
      title: 'Service de Traiteur pour Événements',
      provider: 'Catering El Gusto',
      type: 'Traiteur',
      location: 'Sfax',
      city: 'Sfax',
      price: 1500,
      duration: 'Sur demande',
      rating: 4.85,
      reviews: 67,
      available: false,
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop'
    },
    {
      id: '6',
      title: 'Coiffure et Maquillage Mariage',
      provider: 'Salon de Beauté Lilla',
      type: 'Coiffure',
      location: 'Djerba',
      city: 'Medenine',
      price: 600,
      duration: '3 heures',
      rating: 4.88,
      reviews: 134,
      available: true,
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop'
    },
    {
      id: '7',
      title: 'Coach Personal Trainer',
      provider: 'Karim Ben Hassen',
      type: 'Coach sportif',
      location: 'Sousse',
      city: 'Sousse',
      price: 200,
      duration: '1.5 heure',
      rating: 4.87,
      reviews: 178,
      available: true,
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop'
    },
    {
      id: '8',
      title: 'Photographie de Mariage',
      provider: 'Studio Photo Tunis',
      type: 'Photographie',
      location: 'Tunis',
      city: 'Tunis',
      price: 800,
      duration: '4 heures',
      rating: 4.9,
      reviews: 245,
      available: true,
      image: 'https://images.unsplash.com/photo-1554048612-b6a484d98b7?w=800&h=600&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Tous les services</h1>
          <p className="text-muted-foreground mb-6">
            Réservez des services professionnels pour vos besoins spécifiques
          </p>

          {/* Search and Filters */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Rechercher un service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Type de service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="privateChef">Chef privé</SelectItem>
                  <SelectItem value="massage">Massages</SelectItem>
                  <SelectItem value="sportsCoach">Coach sportif</SelectItem>
                  <SelectItem value="photography">Photographie</SelectItem>
                  <SelectItem value="hairdressing">Coiffure</SelectItem>
                  <SelectItem value="catering">Traiteur</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  <SelectItem value="tunis">Tunis</SelectItem>
                  <SelectItem value="hammamet">Hammamet</SelectItem>
                  <SelectItem value="sousse">Sousse</SelectItem>
                  <SelectItem value="sfax">Sfax</SelectItem>
                  <SelectItem value="djerba">Djerba</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Disponibilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="unavailable">Non disponible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Plus de filtres
              </Button>
              <Button className="flex-1 bg-rose-600 hover:bg-rose-700">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allServices.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Charger plus de services
          </Button>
        </div>
      </main>
    </div>
  );
}
