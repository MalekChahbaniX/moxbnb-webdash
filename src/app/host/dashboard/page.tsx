'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Users, Star, TrendingUp, Plus, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { fetchHostDashboard, resolveMediaUrl } from '@/services/hostService';

export default function HostDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [listingPreviews, setListingPreviews] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchHostDashboard();
        if (cancelled) return;
        setAnalytics(data.analytics);
        setListingPreviews(data.listingPreviews || []);
        setError(null);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Impossible de charger le tableau de bord');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-gray-600">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
        <span>Chargement…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-medium">{error}</p>
        <p className="mt-2 text-sm">Vérifiez que le backend tourne et que vous êtes connecté en tant qu&apos;hôte.</p>
      </div>
    );
  }

  const a = analytics || {};
  const totalListings = a.totalListings ?? 0;
  const activeListings = a.activeListings ?? 0;
  const totalBookings = a.totalBookings ?? 0;
  const monthlyBookings = a.monthlyBookings ?? 0;
  const monthlyRevenue = a.monthlyRevenue ?? 0;
  const averageRating = a.averageRating ?? 0;
  const totalReviews = a.totalReviews ?? 0;
  const occupancyRate = a.occupancyRate ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Hôte</h1>
        <p className="text-gray-600">Gérez vos propriétés et vos réservations</p>
      </div>

      <div className="flex gap-4 mb-8 flex-wrap">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Propriétés</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListings}</div>
            <p className="text-xs text-muted-foreground">{activeListings} publiées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">{monthlyBookings} ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus ce mois</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(monthlyRevenue).toLocaleString()} TND</div>
            <p className="text-xs text-muted-foreground">Réservations créées ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
            <p className="text-xs text-muted-foreground">Sur {totalReviews} avis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d&apos;occupation</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">Estimation (nuits réservées / capacité du mois)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vos propriétés</CardTitle>
              <CardDescription>Annonces récentes et indicateurs</CardDescription>
            </div>
            <Link href="/host/listings">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Voir tout
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listingPreviews.length === 0 && (
              <p className="text-sm text-gray-600">Aucune propriété pour le moment.</p>
            )}
            {listingPreviews.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={resolveMediaUrl(listing.image)}
                    alt={listing.title}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                  />
                  <div>
                    <h3 className="font-semibold">{listing.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{listing.rating || '—'}</span>
                      <span>•</span>
                      <span>{listing.bookings} réservations</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                    {listing.status === 'active' ? 'Actif' : listing.status === 'pending' ? 'Brouillon' : 'Inactif'}
                  </Badge>
                  <div className="text-sm font-medium mt-1">{Number(listing.revenue).toLocaleString()} TND</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
