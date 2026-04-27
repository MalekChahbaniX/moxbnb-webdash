'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Star, Home, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { fetchHostDashboard, fetchHostEarnings, fetchMyListings } from '@/services/hostService';

function aggregateLastMonths(
  earningsByDate: { date: string; amount: number }[],
  months: number
): { key: string; label: string; revenue: number }[] {
  const now = new Date();
  const result: { key: string; label: string; revenue: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('fr-FR', { month: 'long' });
    result.push({ key, label, revenue: 0 });
  }
  const map = Object.fromEntries(result.map((r) => [r.key, r]));
  for (const row of earningsByDate || []) {
    const k = row.date.slice(0, 7);
    if (map[k] !== undefined) map[k].revenue += row.amount;
  }
  return result;
}

export default function HostAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [monthly, setMonthly] = useState<{ key: string; label: string; revenue: number }[]>([]);
  const [properties, setProperties] = useState<
    { id: string; title: string; revenue: number; bookings: number; rating: number; occupancy: number }[]
  >([]);
  const [top, setTop] = useState<{
    id: string;
    title: string;
    revenue: number;
    bookings: number;
    rating: number;
    occupancy: number;
  } | null>(null);

  const monthsCount = timeRange === '1month' ? 1 : timeRange === '3months' ? 3 : timeRange === '1year' ? 12 : 6;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [dash, earn, { items }] = await Promise.all([
        fetchHostDashboard(),
        fetchHostEarnings('year'),
        fetchMyListings({ limit: 40, status: 'all' }),
      ]);
      setAnalytics(dash.analytics);
      const agg = aggregateLastMonths(earn.earningsByDate || [], monthsCount);
      setMonthly(agg);
      const perf = (items || []).map((l: any) => ({
        id: String(l._id),
        title: l.title,
        revenue: l.stats?.revenue ?? 0,
        bookings: l.stats?.bookings ?? 0,
        rating: l.stats?.rating ?? 0,
        occupancy: 0,
      }));
      perf.sort((a: { revenue: number }, b: { revenue: number }) => b.revenue - a.revenue);
      setProperties(perf);
      setTop(perf[0] || null);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [monthsCount]);

  useEffect(() => {
    load();
  }, [load]);

  const maxRev = useMemo(() => Math.max(1, ...monthly.map((m) => m.revenue)), [monthly]);

  const totalRevenue = analytics?.totalRevenue ?? 0;
  const monthlyRevenue = analytics?.monthlyRevenue ?? 0;
  const occupancyRate = analytics?.occupancyRate ?? 0;
  const averageRating = analytics?.averageRating ?? 0;
  const totalReviews = analytics?.totalReviews ?? 0;

  const prevMonthRev = monthly.length >= 2 ? monthly[monthly.length - 2].revenue : 0;
  const lastMonthRev = monthly.length >= 1 ? monthly[monthly.length - 1].revenue : 0;
  const growth =
    prevMonthRev > 0 ? Math.round(((lastMonthRev - prevMonthRev) / prevMonthRev) * 100) : lastMonthRev > 0 ? 100 : 0;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-gray-600">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
        Chargement analytics…
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 p-6">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(totalRevenue).toLocaleString()} TND</div>
            <p className="text-xs text-muted-foreground">Toutes réservations (brut)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus ce mois</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(monthlyRevenue).toLocaleString()} TND</div>
            <p className="text-xs text-muted-foreground">
              {growth >= 0 ? '+' : ''}
              {growth}% vs mois précédent (période affichée)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d&apos;occupation</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">Estimation mensuelle</p>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenus par mois</CardTitle>
            <CardDescription>Basé sur la date de création des réservations (année en cours agrégée)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-1">
              {monthly.map((m) => (
                <div key={m.key} className="flex flex-col items-center flex-1 min-w-0">
                  <div
                    className="w-full bg-rose-500 rounded-t min-h-[4px]"
                    style={{ height: `${(m.revenue / maxRev) * 200}px` }}
                  />
                  <div className="text-xs mt-2 text-center truncate w-full">{m.label.slice(0, 3)}.</div>
                  <div className="text-xs text-center text-gray-600 truncate w-full">{Math.round(m.revenue)} TND</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance des propriétés</CardTitle>
            <CardDescription>Revenus et réservations cumulés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {properties.length === 0 && <p className="text-sm text-gray-600">Aucune donnée</p>}
              {properties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 bg-gray-200 rounded shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{property.title}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span>{property.bookings} réservations</span>
                        <span>•</span>
                        <span>Note {property.rating || '—'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold">{property.revenue.toLocaleString()} TND</div>
                    <div className="text-xs text-gray-500">Revenus</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {top && (
        <Card>
          <CardHeader>
            <CardTitle>Propriété la plus performante</CardTitle>
            <CardDescription>{top.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{top.revenue.toLocaleString()} TND</div>
                <p className="text-sm text-gray-600">Revenus cumulés</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{top.bookings}</div>
                <p className="text-sm text-gray-600">Réservations</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{top.rating || '—'}</div>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Link href={`/host/listings/${top.id}`}>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Voir les détails
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
