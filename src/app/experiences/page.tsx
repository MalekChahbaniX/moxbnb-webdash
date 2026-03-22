'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ExperienceCard from '@/components/moxbnb/ExperienceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ExperiencesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  const allExperiences = [
    {
      id: '1',
      title: 'Dégustation de Cuisine Traditionnelle Tunisienne',
      category: 'Culinaire',
      host: 'Fatma Ben Ali',
      duration: '4 heures',
      maxGuests: 8,
      price: 150,
      rating: 4.9,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop'
    },
    {
      id: '2',
      title: 'Visite Guidée de la Médina de Tunis',
      category: 'Visites guidées',
      host: 'Ahmed Kaddour',
      duration: '3 heures',
      maxGuests: 10,
      price: 80,
      rating: 4.8,
      reviews: 512,
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop'
    },
    {
      id: '3',
      title: 'Atelier de Poterie à Sejnane',
      category: 'Artistic',
      host: 'Leila Messaoudi',
      duration: '5 heures',
      maxGuests: 6,
      price: 200,
      rating: 4.95,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop'
    },
    {
      id: '4',
      title: 'Balade en Chameau dans le Sahara',
      category: 'Adventure',
      host: 'Omar Ben Salah',
      duration: '1 journée',
      maxGuests: 4,
      price: 350,
      rating: 4.97,
      reviews: 345,
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop'
    },
    {
      id: '5',
      title: 'Cours de Cuisine Tunisienne',
      category: 'Culinaire',
      host: 'Fatma Ben Ali',
      duration: '3 heures',
      maxGuests: 6,
      price: 120,
      rating: 4.85,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop'
    },
    {
      id: '6',
      title: 'Visite des Musées de Carthage',
      category: 'Visites guidées',
      host: 'Ahmed Kaddour',
      duration: '4 heures',
      maxGuests: 12,
      price: 100,
      rating: 4.88,
      reviews: 278,
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop'
    },
    {
      id: '7',
      title: 'Atelier de Tapisserie à Kairouan',
      category: 'Artistic',
      host: 'Leila Messaoudi',
      duration: '6 heures',
      maxGuests: 4,
      price: 250,
      rating: 4.9,
      reviews: 134,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop'
    },
    {
      id: '8',
      title: 'Excursion en Mer Méditerranée',
      category: 'Adventure',
      host: 'Omar Ben Salah',
      duration: '6 heures',
      maxGuests: 8,
      price: 280,
      rating: 4.82,
      reviews: 201,
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Toutes les expériences</h1>
          <p className="text-muted-foreground mb-6">
            Découvrez des activités authentiques proposées par des hôtes locaux
          </p>

          {/* Search and Filters */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Rechercher une expérience..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="culinary">Culinaires</SelectItem>
                  <SelectItem value="guidedTour">Visites guidées</SelectItem>
                  <SelectItem value="adventure">Aventures</SelectItem>
                  <SelectItem value="artistic">Artistiques</SelectItem>
                  <SelectItem value="cultural">Culturelles</SelectItem>
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
                  <SelectItem value="tozeur">Tozeur</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Pertinence</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="rating">Note</SelectItem>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allExperiences.map((experience) => (
            <ExperienceCard key={experience.id} {...experience} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Charger plus d'expériences
          </Button>
        </div>
      </main>
    </div>
  );
}
