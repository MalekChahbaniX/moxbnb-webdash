'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/moxbnb/Header';
import Footer from '@/components/moxbnb/Footer';
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

interface ServiceItem {
  id: string;
  title: string;
  provider: string;
  type: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  available: boolean;
  image: string;
}

const serviceTypeOptions = [
  { value: 'all', label: 'Tous les types' },
  { value: 'privateChef', label: 'Chef privé' },
  { value: 'massage', label: 'Massages' },
  { value: 'sportsCoach', label: 'Coach sportif' },
  { value: 'photography', label: 'Photographie' },
  { value: 'hairdressing', label: 'Coiffure' },
  { value: 'catering', label: 'Traiteur' }
];

const cityOptions = [
  { value: 'all', label: 'Toutes les villes' },
  { value: 'Tunis', label: 'Tunis' },
  { value: 'Hammamet', label: 'Hammamet' },
  { value: 'Sousse', label: 'Sousse' },
  { value: 'Sfax', label: 'Sfax' },
  { value: 'Djerba', label: 'Djerba' }
];

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();

        if (selectedType !== 'all') {
          params.append('type', selectedType);
        }

        if (selectedCity !== 'all') {
          params.append('city', selectedCity);
        }

        if (selectedAvailability === 'available') {
          params.append('available', 'true');
        } else if (selectedAvailability === 'unavailable') {
          params.append('available', 'false');
        }

        const response = await fetch(`/api/services?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors du chargement des services');
        }

        setServices(
          data.map((service: any) => ({
            id: service._id,
            title: service.title,
            provider: service.providerId?.name || 'Prestataire',
            type:
              serviceTypeOptions.find(
                (option) => option.value === service.type || option.value === service.category
              )?.label || service.type || service.category || 'Service',
            location: service.location || service.address || service.city || 'Lieu non spécifié',
            duration: service.duration || 'Durée non précisée',
            price: service.price,
            rating: service.rating ?? 0,
            reviews: service.reviewsCount ?? 0,
            available: service.isAvailable,
            image:
              service.images?.[0] ||
              'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop'
          }))
        );
      } catch (fetchError: any) {
        setError(fetchError.message || 'Impossible de charger les services');
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [selectedType, selectedCity, selectedAvailability]);

  const filteredServices = services.filter((service) => {
    if (!searchTerm) return true;
    return (
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <header className="border-b bg-white">
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
                  {serviceTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ville" />
                </SelectTrigger>
                <SelectContent>
                  {cityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
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
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">
            Chargement des services...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">{error}</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Aucun service trouvé.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        )}

        {filteredServices.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Charger plus de services
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
