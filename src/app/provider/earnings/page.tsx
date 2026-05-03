'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, TrendingUp, Download, Filter } from 'lucide-react';
import { api } from '@/lib/api';

export default function ProviderEarningsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/provider/earnings');
        setEarnings(response.data?.data || response.data);
      } catch (err) {
        console.error('Error fetching earnings:', err);
        setError('Failed to load earnings');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const [selectedTab, setSelectedTab] = useState('overview');

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

  if (!earnings) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center text-gray-500 py-8">
          No earnings data available
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenus</h1>
            <p className="text-gray-600">Suivi de vos gains et paiements</p>
          </div>
          <div className="flex space-x-2">
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
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 border-b">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`pb-2 px-1 ${
              selectedTab === 'overview' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Aperçu
          </button>
          <button
            onClick={() => setSelectedTab('transactions')}
            className={`pb-2 px-1 ${
              selectedTab === 'transactions' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Transactions
          </button>
        </div>
      </div>

      {selectedTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(earnings.totalEarnings || 0).toLocaleString()} TND</div>
                <p className="text-xs text-muted-foreground">
                  Depuis le début
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ce Mois</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(earnings.currentMonthEarnings || 0).toLocaleString()} TND</div>
                <p className="text-xs text-muted-foreground">
                  +{earnings.lastMonthEarnings ? Math.round(((earnings.currentMonthEarnings - earnings.lastMonthEarnings) / earnings.lastMonthEarnings) * 100) : 0}% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Moyenne Mensuelle</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(earnings.averageMonthlyEarnings || 0).toLocaleString()} TND</div>
                <p className="text-xs text-muted-foreground">
                  Sur 12 derniers mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paiements en Attente</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(earnings.pendingPayouts || 0).toLocaleString()} TND</div>
                <p className="text-xs text-muted-foreground">
                  À traiter
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Earnings by Service */}
          <Card>
            <CardHeader>
              <CardTitle>Revenus par Service</CardTitle>
              <CardDescription>Détails des gains pour chaque service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(earnings.earningsByService || []).map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{service.title}</h3>
                      <div className="text-sm text-gray-600">
                        <span>{service.bookings} réservations</span>
                        <span className="mx-2">•</span>
                        <span>Commission: {service.commission} TND</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {service.netEarnings ? service.netEarnings.toLocaleString() : 0} TND
                      </div>
                      <div className="text-xs text-gray-500">Net</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Revenus</CardTitle>
              <CardDescription>Revenus mensuels sur 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between">
                {(earnings.monthlyEarnings || []).map((month, index) => (
                  <div key={month.month} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${month.earnings && earnings.monthlyEarnings.length > 0 ? (month.earnings / Math.max(...earnings.monthlyEarnings.map(m => m.earnings))) * 200 : 0}px` }}
                    />
                    <div className="text-xs mt-2 text-center">{month.month.substring(0, 3)}</div>
                    <div className="text-xs text-center text-gray-600">{month.earnings} TND</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {selectedTab === 'transactions' && (
        <Card>
          <CardHeader>
            <CardTitle>Transactions Récentes</CardTitle>
            <CardDescription>Historique des paiements et transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(earnings.recentTransactions || []).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.type === 'payout' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {transaction.amount ? transaction.amount.toLocaleString() : 0} TND
                    </div>
                    <div className={`text-xs ${
                      transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {transaction.status === 'completed' ? 'Complété' : 'En attente'}
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
