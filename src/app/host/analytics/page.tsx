'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, DollarSign, Users, Star, Home, Eye } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with API call
const mockAnalytics = {
  totalRevenue: 125750,
  monthlyRevenue: 8750,
  totalBookings: 156,
  occupancyRate: 78,
  averageRating: 4.8,
  totalProperties: 12,
  activeProperties: 8,
  monthlyGrowth: 12,
  topPerformingProperty: {
    id: '1',
    title: 'Villa de Luxe à Sidi Bou Said',
    revenue: 3000,
    bookings: 12,
    occupancy: 85
  },
  revenueByMonth: [
    { month: 'Janvier', revenue: 6500, bookings: 8 },
    { month: 'Février', revenue: 7200, bookings: 9 },
    { month: 'Mars', revenue: 8750, bookings: 11 },
    { month: 'Avril', revenue: 5400, bookings: 7 },
    { month: 'Mai', revenue: 9800, bookings: 12 },
    { month: 'Juin', revenue: 11200, bookings: 15 }
  ],
  propertyPerformance: [
    {
      id: '1',
      title: 'Villa de Luxe à Sidi Bou Said',
      revenue: 3000,
      bookings: 12,
      rating: 4.9,
      occupancy: 85
    },
    {
      id: '2',
      title: 'Appartement Centre Ville',
      revenue: 1600,
      bookings: 8,
      rating: 4.7,
      occupancy: 65
    },
    {
      id: '3',
      title: 'Studio Coquet Hammamet',
      revenue: 0,
      bookings: 0,
      rating: 4.5,
      occupancy: 0
    }
  ]
};

export default function HostAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Analyse de performance de vos propriétés</p>
          </div>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="1month">Dernier mois</option>
            <option value="3months">Derniers 3 mois</option>
            <option value="6months">Derniers 6 mois</option>
            <option value="1year">Dernière année</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.totalRevenue.toLocaleString()} TND</div>
            <p className="text-xs text-muted-foreground">
              +{mockAnalytics.monthlyGrowth}% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.monthlyRevenue.toLocaleString()} TND</div>
            <p className="text-xs text-muted-foreground">
              Ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              Moyenne sur toutes les propriétés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Basé sur {mockAnalytics.totalBookings} avis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus Mensuels</CardTitle>
            <CardDescription>Évolution des revenus sur 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between">
              {mockAnalytics.revenueByMonth.map((month, index) => (
                <div key={month.month} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-rose-500 rounded-t"
                    style={{ height: `${(month.revenue / Math.max(...mockAnalytics.revenueByMonth.map(m => m.revenue))) * 200}px` }}
                  />
                  <div className="text-xs mt-2 text-center">{month.month.substring(0, 3)}</div>
                  <div className="text-xs text-center text-gray-600">{month.revenue} TND</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Property Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance des Propriétés</CardTitle>
            <CardDescription>Classement par revenus et occupation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.propertyPerformance.map((property, index) => (
                <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div>
                      <p className="font-medium text-sm">{property.title}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span>{property.bookings} réservations</span>
                        <span>•</span>
                        <span>{property.occupancy}% occupation</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{property.revenue.toLocaleString()} TND</div>
                    <div className="text-xs text-gray-500">Revenus</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Property */}
      <Card>
        <CardHeader>
          <CardTitle>Propriété la Plus Performante</CardTitle>
          <CardDescription>
            {mockAnalytics.topPerformingProperty.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockAnalytics.topPerformingProperty.revenue.toLocaleString()} TND
              </div>
              <p className="text-sm text-gray-600">Revenus ce mois</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mockAnalytics.topPerformingProperty.bookings}
              </div>
              <p className="text-sm text-gray-600">Réservations</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {mockAnalytics.topPerformingProperty.occupancy}%
              </div>
              <p className="text-sm text-gray-600">Taux d'occupation</p>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Link href={`/host/listings/${mockAnalytics.topPerformingProperty.id}`}>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Voir les détails
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
