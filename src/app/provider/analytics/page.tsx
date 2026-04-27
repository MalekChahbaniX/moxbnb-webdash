'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, DollarSign, Users, Star, Wrench, Eye } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ProviderAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/provider/dashboard');
        setAnalytics(response.data?.data || response.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center text-gray-500 py-8">
          No analytics data available
        </div>
      </div>
    );
  }

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
            <div className="text-2xl font-bold">{analytics.totalRevenue?.toLocaleString() || 0} TND</div>
            <p className="text-xs text-muted-foreground">
              +{analytics.monthlyGrowth || 0}% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.monthlyRevenue?.toLocaleString() || 0} TND</div>
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
            <div className="text-2xl font-bold">{analytics.completionRate || 0}%</div>
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
            <div className="text-2xl font-bold">{analytics.averageRating || 0}</div>
            <p className="text-xs text-muted-foreground">
              Basé sur {analytics.totalBookings || 0} avis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {analytics.revenueByMonth && analytics.revenueByMonth.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Revenus Mensuels</CardTitle>
              <CardDescription>Évolution des revenus sur 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between">
                {analytics.revenueByMonth?.map((month: any, index: number) => (
                  <div key={month.month} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(month.revenue / Math.max(...analytics.revenueByMonth.map((m: any) => m.revenue))) * 200}px` }}
                    />
                    <div className="text-xs mt-2 text-center">{month.month.substring(0, 3)}</div>
                    <div className="text-xs text-center text-gray-600">{month.revenue} TND</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-gray-500">Aucune donnée de revenus disponible</p>
            </CardContent>
          </Card>
        )}

        {/* Service Performance */}
        {analytics.servicePerformance && analytics.servicePerformance.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Performance des Services</CardTitle>
              <CardDescription>Classement par revenus et satisfaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.servicePerformance?.map((service: any, index: number) => (
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
                    <div className="font-semibold">{service.revenue?.toLocaleString() || 0} TND</div>
                    <div className="text-xs text-gray-500">Revenus</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-gray-500">Aucune donnée de performance disponible</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Performing Service */}
      {analytics.topPerformingService ? (
        <Card>
          <CardHeader>
            <CardTitle>Service le Plus Performant</CardTitle>
            <CardDescription>
              {analytics.topPerformingService?.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.topPerformingService?.revenue?.toLocaleString() || 0} TND
                </div>
                <p className="text-sm text-gray-600">Revenus ce mois</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.topPerformingService?.bookings || 0}
                </div>
                <p className="text-sm text-gray-600">Réservations</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.topPerformingService?.rating || 0}
                </div>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Link href={`/provider/services/${analytics.topPerformingService?.id}`}>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Voir les détails
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <p className="text-gray-500">Aucun service performant à afficher</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
