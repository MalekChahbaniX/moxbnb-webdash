'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Edit, Trash2, Eye, Plus, Filter, Home, Star, Calendar } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with API call
const mockListings = [
  {
    id: '1',
    title: 'Villa de Luxe à Sidi Bou Said',
    type: 'villa',
    category: 'entire_home',
    price: 250,
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    address: 'Avenue Habib Bourguiba, Sidi Bou Said',
    city: 'Tunis',
    country: 'Tunisie',
    status: 'active',
    bookings: 12,
    revenue: 3000,
    rating: 4.9,
    reviews: 28,
    images: ['/api/placeholder/300/200'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Appartement Centre Ville',
    type: 'apartment',
    category: 'entire_home',
    price: 120,
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    address: 'Rue Charles de Gaulle',
    city: 'Tunis',
    country: 'Tunisie',
    status: 'active',
    bookings: 8,
    revenue: 960,
    rating: 4.7,
    reviews: 15,
    images: ['/api/placeholder/300/200'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    title: 'Studio Coquet Hammamet',
    type: 'studio',
    category: 'entire_home',
    price: 80,
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    address: 'Avenue Habib Thameur',
    city: 'Hammamet',
    country: 'Tunisie',
    status: 'inactive',
    bookings: 0,
    revenue: 0,
    rating: 4.5,
    reviews: 8,
    images: ['/api/placeholder/300/200'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  }
];

export default function HostListingsPage() {
  const [listings, setListings] = useState(mockListings);
  const [filtered, setFiltered] = useState(mockListings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let filtered = listings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    setFiltered(filtered);
  }, [listings, searchTerm, statusFilter]);

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette propriété?')) {
      // TODO: API call to delete listing
      setListings(listings.filter(listing => listing.id !== id));
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // TODO: API call to update status
    setListings(listings.map(listing =>
      listing.id === id ? { ...listing, status: newStatus } : listing
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Propriétés</h1>
            <p className="text-gray-600">Gérez toutes vos annonces immobilières</p>
          </div>
          <Link href="/host/listings/new">
            <Button className="bg-rose-600 hover:bg-rose-700">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une Propriété
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
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les propriétés</SelectItem>
                  <SelectItem value="active">Actives</SelectItem>
                  <SelectItem value="inactive">Inactives</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            {/* Image */}
            <div className="aspect-video bg-gray-200 relative">
              <img 
                src={listing.images[0] || '/api/placeholder/400/300'} 
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                  {listing.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              {/* Title and Location */}
              <div className="mb-3">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{listing.title}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Home className="mr-1 h-4 w-4" />
                  <span>{listing.city}, {listing.country}</span>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-1">🛏️</span>
                  <span>{listing.bedrooms} chambres</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">🚿</span>
                  <span>{listing.bathrooms} sdb</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">👥</span>
                  <span>{listing.maxGuests} voyageurs</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">💰</span>
                  <span>{listing.price} TND/nuit</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-3 text-sm">
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{listing.rating}</span>
                  <span className="text-gray-500 ml-1">({listing.reviews})</span>
                </div>
                <div className="text-gray-600">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{listing.bookings} réservations</span>
                </div>
              </div>

              {/* Revenue */}
              <div className="mb-4">
                <div className="text-lg font-semibold text-green-600">
                  {listing.revenue.toLocaleString()} TND
                </div>
                <div className="text-xs text-gray-500">Revenus totaux</div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Link href={`/host/listings/${listing.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-1 h-4 w-4" />
                    Voir
                  </Button>
                </Link>
                <Link href={`/host/listings/${listing.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-1 h-4 w-4" />
                    Modifier
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(listing.id)}
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
            <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune propriété trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Commencez par ajouter votre première propriété'
              }
            </p>
            <Link href="/host/listings/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une Propriété
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
