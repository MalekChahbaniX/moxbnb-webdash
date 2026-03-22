'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '@/components/moxbnb/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  const allProperties = [
    {
      id: '1',
      title: 'Appartement de Charme à Sidi Bou Said',
      type: 'Appartement',
      location: 'Sidi Bou Said, Tunis',
      price: 350,
      rating: 4.9,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
    },
    {
      id: '2',
      title: 'Villa avec Piscine à Hammamet',
      type: 'Villa',
      location: 'Hammamet, Nabeul',
      price: 750,
      rating: 4.8,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'
    },
    {
      id: '3',
      title: 'Maison Traditionnelle Djerbienne',
      type: 'Maison',
      location: 'Djerba, Medenine',
      price: 280,
      rating: 4.95,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
    },
    {
      id: '4',
      title: 'Studio Vue Mer à Monastir',
      type: 'Chambre privée',
      location: 'Monastir, Monastir',
      price: 180,
      rating: 4.7,
      reviews: 56,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    },
    {
      id: '5',
      title: 'Cabane dans les Palmiers Tozeur',
      type: 'Cabane',
      location: 'Tozeur, Tozeur',
      price: 420,
      rating: 4.92,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop'
    },
    {
      id: '6',
      title: 'Pentasse Moderne Tunis Centre',
      type: 'Appartement',
      location: 'Tunis, Tunis',
      price: 450,
      rating: 4.85,
      reviews: 145,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    },
    {
      id: '7',
      title: 'Villa Luxueuse Sfax',
      type: 'Villa',
      location: 'Sfax, Sfax',
      price: 850,
      rating: 4.88,
      reviews: 167,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
    },
    {
      id: '8',
      title: 'Appartement Vue Médina Kairouan',
      type: 'Appartement',
      location: 'Kairouan, Kairouan',
      price: 220,
      rating: 4.75,
      reviews: 93,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    },
    {
      id: '9',
      title: 'Maison de Pêche Mahdia',
      type: 'Maison',
      location: 'Mahdia, Mahdia',
      price: 320,
      rating: 4.82,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Tous les logements</h1>
          <p className="text-muted-foreground mb-6">
            Trouvez le logement parfait pour votre séjour en Tunisie
          </p>

          {/* Search and Filters */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Rechercher une destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Type de logement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="apartment">Appartement</SelectItem>
                  <SelectItem value="house">Maison</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="privateRoom">Chambre privée</SelectItem>
                  <SelectItem value="cabin">Cabane</SelectItem>
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
                  <SelectItem value="monastir">Monastir</SelectItem>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Charger plus de logements
          </Button>
        </div>
      </main>
    </div>
  );
}
