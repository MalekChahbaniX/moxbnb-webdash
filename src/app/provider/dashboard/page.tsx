'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Calendar, Users, Star, TrendingUp, Plus, Eye, DollarSign } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with real API calls
const mockStats = {
  totalServices: 8,
  activeServices: 6,
  totalBookings: 32,
  monthlyRevenue: 6250,
  averageRating: 4.9,
  completionRate: 95
};

const mockServices = [
  {
    id: '1',
    title: 'Photographie Professionnelle',
    category: 'Photographie',
    status: 'active',
    bookings: 15,
    revenue: 2250,
    rating: 5.0,
    image: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: 'Service de Nettoyage',
    category: 'Nettoyage',
    status: 'active',
    bookings: 8,
    revenue: 1200,
    rating: 4.8,
    image: '/api/placeholder/300/200'
  },
  {
    id: '3',
    title: 'Tour Guidé Tunis',
    category: 'Tourisme',
    status: 'inactive',
    bookings: 0,
    revenue: 0,
    rating: 4.7,
    image: '/api/placeholder/300/200'
  }
];

const mockBookings = [
  {
    id: '1',
    serviceTitle: 'Photographie Professionnelle',
    clientName: 'Mohamed Ben Ali',
    date: '2024-01-15',
    status: 'confirmed',
    price: 150
  },
  {
    id: '2',
    serviceTitle: 'Service de Nettoyage',
    clientName: 'Sarra Trabelsi',
    date: '2024-01-16',
    status: 'pending',
    price: 80
  }
];

export default function ProviderDashboard() {
  const [stats, setStats] = useState(mockStats);
  const [services, setServices] = useState(mockServices);
  const [bookings, setBookings] = useState(mockBookings);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Prestataire</h1>
        <p className="text-gray-600">Gérez vos services et vos réservations</p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <Link href="/provider/services/new">
          <Button className="bg-rose-600 hover:bg-rose-700">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Service
          </Button>
        </Link>
        <Link href="/provider/calendar">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Calendrier
          </Button>
        </Link>
        <Link href="/provider/earnings">
          <Button variant="outline">
            <DollarSign className="mr-2 h-4 w-4" />
            Revenus
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeServices} actifs
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
              +8% par rapport au mois dernier
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
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Services complétés
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Services */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vos Services</CardTitle>
                <CardDescription>
                  Gérez vos offres de services
                </CardDescription>
              </div>
              <Link href="/provider/services">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Voir Tout
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{service.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Badge variant="outline">{service.category}</Badge>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating}</span>
                        <span>•</span>
                        <span>{service.bookings} réservations</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                      {service.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                    <div className="text-sm font-medium mt-1">
                      {service.revenue.toLocaleString()} TND
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Réservations Récentes</CardTitle>
                <CardDescription>
                  Dernières réservations de services
                </CardDescription>
              </div>
              <Link href="/provider/bookings">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Voir Tout
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{booking.serviceTitle}</h3>
                    <div className="text-sm text-gray-600">
                      <p>Client: {booking.clientName}</p>
                      <p>Date: {booking.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                    </Badge>
                    <div className="text-sm font-medium mt-1">
                      {booking.price.toLocaleString()} TND
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
