'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Edit, Trash2, Eye, Plus, Filter, Home, Star, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  deleteListing,
  fetchMyListings,
  mapListingStatusToUi,
  resolveMediaUrl,
} from '@/services/hostService';

type Row = {
  id: string;
  title: string;
  type: string;
  category: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests: number;
  address: string;
  city: string;
  country: string;
  status: string;
  bookings: number;
  revenue: number;
  rating: number;
  reviews: number;
  images: string[];
};

export default function HostListingsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filtered, setFiltered] = useState<Row[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { items } = await fetchMyListings({
        status: statusFilter,
        search: searchTerm.trim() || undefined,
        limit: 60,
      });
      const mapped: Row[] = (items || []).map((l: any) => {
        const ui = mapListingStatusToUi(l.status);
        return {
          id: String(l._id),
          title: l.title,
          type: l.type,
          category: l.category,
          price: l.price,
          bedrooms: l.bedrooms,
          bathrooms: l.bathrooms,
          maxGuests: l.maxGuests,
          address: l.address,
          city: l.city,
          country: l.country,
          status: ui === 'active' ? 'active' : ui === 'pending' ? 'pending' : 'inactive',
          bookings: l.stats?.bookings ?? 0,
          revenue: l.stats?.revenue ?? 0,
          rating: l.stats?.rating ?? 0,
          reviews: l.stats?.reviews ?? 0,
          images: Array.isArray(l.images) ? l.images.map((u: string) => resolveMediaUrl(u)) : [],
        };
      });
      setRows(mapped);
      setFiltered(mapped);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement');
      setRows([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    const t = setTimeout(() => load(), 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) return;
    try {
      await deleteListing(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
      setFiltered((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      alert(e?.message || 'Suppression impossible');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
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
            <div className="w-full md:w-56">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les propriétés</SelectItem>
                  <SelectItem value="active">Publiées (actives)</SelectItem>
                  <SelectItem value="inactive">Suspendues / archivées</SelectItem>
                  <SelectItem value="pending">Brouillons</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center py-12 text-gray-600 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
          Chargement…
        </div>
      )}

      {error && !loading && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="pt-6 text-red-800">{error}</CardContent>
        </Card>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={listing.images[0] || resolveMediaUrl(null)}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={
                      listing.status === 'active' ? 'default' : listing.status === 'pending' ? 'secondary' : 'outline'
                    }
                  >
                    {listing.status === 'active' ? 'Publiée' : listing.status === 'pending' ? 'Brouillon' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{listing.title}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Home className="mr-1 h-4 w-4" />
                    <span>
                      {listing.city}, {listing.country}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-1">🛏️</span>
                    <span>{listing.bedrooms ?? '—'} ch.</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">🚿</span>
                    <span>{listing.bathrooms ?? '—'} sdb</span>
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

                <div className="flex items-center justify-between mb-3 text-sm">
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{listing.rating || '—'}</span>
                    <span className="text-gray-500 ml-1">({listing.reviews})</span>
                  </div>
                  <div className="text-gray-600 flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{listing.bookings} rés.</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-lg font-semibold text-green-600">
                    {listing.revenue.toLocaleString()} TND
                  </div>
                  <div className="text-xs text-gray-500">Revenus (toutes réservations)</div>
                </div>

                <div className="flex flex-wrap gap-2">
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
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(listing.id)}>
                    <Trash2 className="mr-1 h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune propriété trouvée</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Commencez par ajouter votre première propriété'}
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
