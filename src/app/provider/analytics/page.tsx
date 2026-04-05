'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, DollarSign, Users, Star, Wrench, Eye } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with API call
const mockAnalytics = {
  totalRevenue: 62500,
  monthlyRevenue: 6250,
  totalBookings: 32,
  completionRate: 95,
  averageRating: 4.9,
  totalServices: 8,
  activeServices: 6,
  monthlyGrowth: 8,
  topPerformingService: {
    id: '1',
    title: 'Photographie Professionnelle',
    revenue: 2250,
    bookings: 15,
    rating: 5.0
  },
  revenueByMonth: [
    { month: 'Janvier', revenue: 4500, bookings: 8 },
    { month: 'Février', revenue: 5200, bookings: 9 },
    { month: 'Mars', revenue: 6250, bookings: 11 },
    { month: 'Avril', revenue: 3800, bookings: 7 },
    { month: 'Avril', revenue: 5800, bookings: 10 },
    { month: 'Mai', revenue: 7200, bookings: 12 }
  ],
  servicePerformance: [
    {
      id: '1',
      title: 'Photographie Professionnelle',
      revenue: 2250,
      bookings: 15,
      rating: 5.0,
      completionRate: 100
    },
    {
      id: '2',
      title: 'Service de Nettoyage',
      revenue: 1200,
      bookings: 8,
      rating: 4.8,
      completionRate: 87
    },
    {
      id: '3',
      title: 'Tour Guidé Tunis',
      revenue: 0,
      bookings: 0,
      rating: 4.7,
      completionRate: 0
    }
  ]
};

export default function ProviderAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Analyse de performance de vos services</p>
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
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Services complétés avec succès
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
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(month.revenue / Math.max(...mockAnalytics.revenueByMonth.map(m => m.revenue))) * 200}px` }}
                  />
                  <div className="text-xs mt-2 text-center">{month.month.substring(0, 3)}</div>
                  <div className="text-xs text-center text-gray-600">{month.revenue} TND</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance des Services</CardTitle>
            <CardDescription>Classement par revenus et satisfaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.servicePerformance.map((service, index) => (
                <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div>
                      <p className="font-medium text-sm">{service.title}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span>{service.bookings} réservations</span>
                        <span>•</span>
                        <span>{service.completionRate}% complétion</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{service.revenue.toLocaleString()} TND</div>
                    <div className="text-xs text-gray-500">Revenus</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Service */}
      <Card>
        <CardHeader>
          <CardTitle>Service le Plus Performant</CardTitle>
          <CardDescription>
            {mockAnalytics.topPerformingService.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockAnalytics.topPerformingService.revenue.toLocaleString()} TND
              </div>
              <p className="text-sm text-gray-600">Revenus ce mois</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mockAnalytics.topPerformingService.bookings}
              </div>
              <p className="text-sm text-gray-600">Réservations</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {mockAnalytics.topPerformingService.rating}
              </div>
              <p className="text-sm text-gray-600">Note moyenne</p>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Link href={`/provider/services/${mockAnalytics.topPerformingService.id}`}>
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
