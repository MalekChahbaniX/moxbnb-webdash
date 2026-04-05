'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Users, Star, TrendingUp, Plus, Eye } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with real API calls
const mockStats = {
  totalListings: 12,
  activeListings: 8,
  totalBookings: 45,
  monthlyRevenue: 8750,
  averageRating: 4.8,
  occupancyRate: 78
};

const mockListings = [
  {
    id: '1',
    title: 'Villa de Luxe à Sidi Bou Said',
    status: 'active',
    bookings: 12,
    revenue: 2400,
    rating: 4.9,
    image: '/api/placeholder/300/200'
  },
  {
    id: '2', 
    title: 'Appartement Centre Ville',
    status: 'active',
    bookings: 8,
    revenue: 1600,
    rating: 4.7,
    image: '/api/placeholder/300/200'
  },
  {
    id: '3',
    title: 'Studio Coquet Hammamet',
    status: 'inactive',
    bookings: 0,
    revenue: 0,
    rating: 4.5,
    image: '/api/placeholder/300/200'
  }
];

export default function HostDashboard() {
  const [stats, setStats] = useState(mockStats);
  const [listings, setListings] = useState(mockListings);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Hôte</h1>
        <p className="text-gray-600">Gérez vos propriétés et vos réservations</p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <Link href="/host/listings/new">
          <Button className="bg-rose-600 hover:bg-rose-700">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une Propriété
          </Button>
        </Link>
        <Link href="/host/calendar">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Calendrier
          </Button>
        </Link>
        <Link href="/host/analytics">
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Propriétés</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeListings} actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations Totales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyRevenue.toLocaleString()} TND</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Basé sur {stats.totalBookings} avis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              Ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Listings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vos Propriétés</CardTitle>
              <CardDescription>
                Gérez vos annonces immobilières
              </CardDescription>
            </div>
            <Link href="/host/listings">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Voir Tout
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{listing.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{listing.rating}</span>
                      <span>•</span>
                      <span>{listing.bookings} réservations</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                    {listing.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                  <div className="text-sm font-medium mt-1">
                    {listing.revenue.toLocaleString()} TND
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
