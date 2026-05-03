'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Calendar, Users, Star, TrendingUp, Plus, Eye, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { fetchProviderDashboard, resolveMediaUrl, mapItemStatusToUi } from '@/services/providerService';

export default function ProviderDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchProviderDashboard();
        setDashboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto">
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800">Erreur</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const analytics = dashboard?.analytics || {};
  const recentBookings = dashboard?.recentBookings || [];
  const services = dashboard?.services || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Prestataire</h1>
        <p className="text-gray-600">Gérez vos services et vos réservations</p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <Link href="/provider/services/new">
          <Button className="bg-rose-600 hover:bg-rose-700">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Service
          </Button>
        </Link>
        <Link href="/provider/experiences/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une Expérience
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
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalServices || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeServices || 0} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expériences</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalExperiences || 0}</div>
            <p className="text-xs text-muted-foreground">
              Créées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations Ce Mois</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.monthlyBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total: {analytics.totalBookings || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analytics.monthlyRevenue || 0).toLocaleString()} TND</div>
            <p className="text-xs text-muted-foreground">
              Total: {(analytics.totalRevenue || 0).toLocaleString()} TND
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
              {analytics.totalReviews || 0} avis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analytics.occupancyRate || 0).toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Estimation
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Réservations Récentes</CardTitle>
                <CardDescription>
                  Vos 5 dernières réservations
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
              {recentBookings.length > 0 ? (
                recentBookings.map((booking: any) => {
                  const guest = booking.userId;
                  const guestName = guest?.firstName ? `${guest.firstName} ${guest.lastName || ''}` : 'Utilisateur';
                  const itemTitle = booking.listingId?.title || booking.experienceId?.title || booking.serviceId?.title || 'Service';
                  return (
                    <div key={booking._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{itemTitle}</p>
                        <p className="text-xs text-gray-600">{guestName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{booking.totalPrice} TND</p>
                        <Badge className={booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">Aucune réservation</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Services */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Services Populaires</CardTitle>
                <CardDescription>
                  Top services
                </CardDescription>
              </div>
              <Link href="/provider/services">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Tous
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.slice(0, 3).length > 0 ? (
                services.slice(0, 3).map((service: any) => (
                  <div key={service._id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    {service.images?.[0] && (
                      <img 
                        src={resolveMediaUrl(service.images[0])} 
                        alt={service.title}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                    )}
                    <p className="font-medium text-sm line-clamp-2">{service.title}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-600">{service.price} TND</span>
                      <Badge variant={service.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                        {mapItemStatusToUi(service.status)}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Aucun service</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

