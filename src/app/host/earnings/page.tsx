'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, TrendingUp, Download } from 'lucide-react';
import { fetchHostDashboard, fetchHostEarnings, fetchMyListings } from '@/services/hostService';

function monthsFromEarnings(earningsByDate: { date: string; amount: number }[], count: number) {
  const now = new Date();
  const rows: { key: string; label: string; earnings: number; bookings: number }[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    rows.push({ key, label: d.toLocaleDateString('fr-FR', { month: 'long' }), earnings: 0, bookings: 0 });
  }
  const map = Object.fromEntries(rows.map((r) => [r.key, r]));
  for (const row of earningsByDate || []) {
    const k = row.date.slice(0, 7);
    if (map[k]) map[k].earnings += row.amount;
  }
  return rows;
}

export default function HostEarningsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [earn, setEarn] = useState<any>(null);
  const [byProperty, setByProperty] = useState<{ id: string; title: string; earnings: number; bookings: number }[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [totalAllTime, setTotalAllTime] = useState(0);

  const period = timeRange === '1month' ? 'month' : timeRange === '1year' ? 'year' : 'year';
  const barCount = timeRange === '1month' ? 1 : timeRange === '3months' ? 3 : timeRange === '1year' ? 12 : 6;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [e, dash, { items }] = await Promise.all([
        fetchHostEarnings(period),
        fetchHostDashboard(),
        fetchMyListings({ limit: 40, status: 'all' }),
      ]);
      setEarn(e);
      setTotalAllTime(dash.analytics?.totalRevenue ?? 0);
      setRecent(dash.recentBookings || []);
      setByProperty(
        (items || []).map((l: any) => ({
          id: String(l._id),
          title: l.title,
          earnings: l.stats?.revenue ?? 0,
          bookings: l.stats?.bookings ?? 0,
        }))
      );
    } catch {
      setEarn(null);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  const monthly = useMemo(
    () => monthsFromEarnings(earn?.earningsByDate || [], barCount),
    [earn, barCount]
  );
  const maxBar = Math.max(1, ...monthly.map((m) => m.earnings));

  const currentMonth = monthly[monthly.length - 1]?.earnings ?? 0;
  const prevMonth = monthly[monthly.length - 2]?.earnings ?? 0;
  const pct =
    prevMonth > 0 ? Math.round(((currentMonth - prevMonth) / prevMonth) * 100) : currentMonth > 0 ? 100 : 0;

  const transactions = recent.slice(0, 12).map((b: any, i: number) => {
    const title = b.listingId?.title || b.experienceId?.title || b.serviceId?.title || 'Réservation';
    return {
      id: String(b._id || i),
      description: `${title} — ${b.status}`,
      date: b.createdAt,
      amount: b.totalPrice,
      status: b.status === 'COMPLETED' ? 'completed' : 'pending',
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenus</h1>
            <p className="text-gray-600">Suivi de vos gains (montants des réservations)</p>
          </div>
          <div className="flex space-x-2 flex-wrap">
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
            <Button variant="outline" type="button" disabled title="Bientôt disponible">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-1 border-b">
          <button
            type="button"
            onClick={() => setSelectedTab('overview')}
            className={`pb-2 px-1 ${
              selectedTab === 'overview'
                ? 'border-b-2 border-rose-500 text-rose-600'
                : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Aperçu
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('transactions')}
            className={`pb-2 px-1 ${
              selectedTab === 'transactions'
                ? 'border-b-2 border-rose-500 text-rose-600'
                : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Transactions
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-600 mb-4">Chargement…</p>}

      {selectedTab === 'overview' && !loading && earn && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(totalAllTime).toLocaleString()} TND</div>
                <p className="text-xs text-muted-foreground">Historique (dashboard)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Période sélectionnée</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(earn.totalEarnings).toLocaleString()} TND</div>
                <p className="text-xs text-muted-foreground">
                  {pct >= 0 ? '+' : ''}
                  {pct}% vs barre précédente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Complétées (période)</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{earn.completedEarnings?.toLocaleString?.() ?? 0} TND</div>
                <p className="text-xs text-muted-foreground">{earn.completedBookings} réservations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En attente (période)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(earn.pendingEarnings ?? 0).toLocaleString()} TND</div>
                <p className="text-xs text-muted-foreground">Non complétées</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenus par propriété</CardTitle>
              <CardDescription>Total des montants de réservation par annonce</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {byProperty.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{property.title}</h3>
                      <div className="text-sm text-gray-600">
                        <span>{property.bookings} réservations</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {property.earnings.toLocaleString()} TND
                      </div>
                      <div className="text-xs text-gray-500">Brut</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Évolution (agrégation mensuelle)</CardTitle>
              <CardDescription>À partir des dates de réservation sur l&apos;année en cours (API)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-1">
                {monthly.map((month) => (
                  <div key={month.key} className="flex flex-col items-center flex-1 min-w-0">
                    <div
                      className="w-full bg-rose-500 rounded-t min-h-[4px]"
                      style={{ height: `${(month.earnings / maxBar) * 200}px` }}
                    />
                    <div className="text-xs mt-2 text-center truncate w-full">{month.label.slice(0, 3)}.</div>
                    <div className="text-xs text-center text-gray-600">{Math.round(month.earnings)} TND</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {selectedTab === 'transactions' && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Réservations récentes</CardTitle>
            <CardDescription>Les dernières réservations liées à vos annonces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length === 0 && <p className="text-gray-600 text-sm">Aucune transaction</p>}
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          transaction.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                      />
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}
                    >
                      {transaction.amount?.toLocaleString?.() ?? transaction.amount} TND
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
