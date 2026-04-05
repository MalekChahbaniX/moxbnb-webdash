'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Edit, Trash2, Eye, Plus, Filter, Wrench, Star, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with API call
const mockServices = [
  {
    id: '1',
    title: 'Photographie Professionnelle',
    category: 'photography',
    price: 150,
    duration: '2 heures',
    maxGuests: 10,
    location: 'Studio Photo, Centre Ville',
    city: 'Tunis',
    country: 'Tunisie',
    status: 'active',
    bookings: 15,
    revenue: 2250,
    rating: 5.0,
    reviews: 28,
    images: ['/api/placeholder/300/200'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Service de Nettoyage',
    category: 'cleaning',
    price: 80,
    duration: '4 heures',
    maxGuests: 1,
    location: 'À domicile',
    city: 'Tunis',
    country: 'Tunisie',
    status: 'active',
    bookings: 8,
    revenue: 640,
    rating: 4.8,
    reviews: 12,
    images: ['/api/placeholder/300/200'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    title: 'Tour Guidé Tunis',
    category: 'tourism',
    price: 200,
    duration: '6 heures',
    maxGuests: 6,
    location: 'Centre Ville',
    city: 'Tunis',
    country: 'Tunisie',
    status: 'inactive',
    bookings: 0,
    revenue: 0,
    rating: 4.7,
    reviews: 8,
    images: ['/api/placeholder/300/200'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  }
];

const serviceCategories = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'photography', label: 'Photographie' },
  { value: 'cleaning', label: 'Nettoyage' },
  { value: 'catering', label: 'Traiteur' },
  { value: 'transport', label: 'Transport' },
  { value: 'beauty', label: 'Beauté' },
  { value: 'sport', label: 'Sport' },
  { value: 'wellness', label: 'Bien-être' },
  { value: 'tourism', label: 'Tourisme' },
];

export default function ProviderServicesPage() {
  const [services, setServices] = useState(mockServices);
  const [filtered, setFiltered] = useState(mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    let filtered = services;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(service => service.category === categoryFilter);
    }

    setFiltered(filtered);
  }, [services, searchTerm, categoryFilter]);

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service?')) {
      // TODO: API call to delete service
      setServices(services.filter(service => service.id !== id));
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // TODO: API call to update status
    setServices(services.map(service =>
      service.id === id ? { ...service, status: newStatus } : service
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Services</h1>
            <p className="text-gray-600">Gérez toutes vos offres de services</p>
          </div>
          <Link href="/provider/services/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un Service
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre ou ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrer par catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            {/* Image */}
            <div className="aspect-video bg-gray-200 relative">
              <img 
                src={service.images[0] || '/api/placeholder/400/300'} 
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                  {service.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              {/* Title and Location */}
              <div className="mb-3">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{service.title}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Wrench className="mr-1 h-4 w-4" />
                  <span className="capitalize">{service.category}</span>
                  <span className="mx-2">•</span>
                  <span>{service.city}, {service.country}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{service.duration}</span>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-1">💰</span>
                  <span>{service.price} TND</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">👥</span>
                  <span>{service.maxGuests} clients max</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-3 text-sm">
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{service.rating}</span>
                  <span className="text-gray-500 ml-1">({service.reviews})</span>
                </div>
                <div className="text-gray-600">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{service.bookings} réservations</span>
                </div>
              </div>

              {/* Revenue */}
              <div className="mb-4">
                <div className="text-lg font-semibold text-green-600">
                  {service.revenue.toLocaleString()} TND
                </div>
                <div className="text-xs text-gray-500">Revenus totaux</div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Link href={`/provider/services/${service.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-1 h-4 w-4" />
                    Voir
                  </Button>
                </Link>
                <Link href={`/provider/services/${service.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-1 h-4 w-4" />
                    Modifier
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun service trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Commencez par ajouter votre premier service'
              }
            </p>
            <Link href="/provider/services/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un Service
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
