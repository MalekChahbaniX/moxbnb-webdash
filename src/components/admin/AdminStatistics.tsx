'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Home, Calendar, DollarSign, PieChart, LineChart, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getPlatformOverview, getRevenueStats, getUserStats, getBookingStats } from '@/services/adminService';

export default function AdminStatistics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platformData, setPlatformData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [platform, revenue, users, bookings] = await Promise.all([
          getPlatformOverview().catch(() => ({ data: null })),
          getRevenueStats().catch(() => ({ data: null })),
          getUserStats().catch(() => ({ data: null })),
          getBookingStats().catch(() => ({ data: null }))
        ]);

        // Set data with fallbacks
        setPlatformData(platform.data || {
          totalUsers: 0,
          activeListings: 0,
          totalBookings: 0,
          platformRevenue: 0,
          categories: { properties: 0, experiences: 0, services: 0 },
          topHosts: [],
          topListings: [],
          satisfactionScore: 0
        });
        
        setRevenueData(revenue.data || {
          totalRevenue: 0,
          growth: 0,
          averageOrderValue: 0,
          aovGrowth: 0
        });
        
        setUserData(users.data || {
          activeUsers: 0,
          growth: 0,
          retentionRate: 0,
          retentionGrowth: 0
        });
        
        setBookingData(bookings.data || {
          totalBookings: 0,
          growth: 0,
          conversionRate: 0,
          conversionGrowth: 0,
          averageStayDuration: 0,
          stayDurationGrowth: 0
        });
      } catch (err: any) {
        console.error('Error fetching statistics:', err);
        // Set default data instead of showing error
        setPlatformData({
          totalUsers: 0,
          activeListings: 0,
          totalBookings: 0,
          platformRevenue: 0,
          categories: { properties: 0, experiences: 0, services: 0 },
          topHosts: [],
          topListings: [],
          satisfactionScore: 0
        });
        setRevenueData({
          totalRevenue: 0,
          growth: 0,
          averageOrderValue: 0,
          aovGrowth: 0
        });
        setUserData({
          activeUsers: 0,
          growth: 0,
          retentionRate: 0,
          retentionGrowth: 0
        });
        setBookingData({
          totalBookings: 0,
          growth: 0,
          conversionRate: 0,
          conversionGrowth: 0,
          averageStayDuration: 0,
          stayDurationGrowth: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [timeRange]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    // Export functionality would go here
    alert('Export functionality will be implemented');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Statistiques Détaillées</h1>
          <p className="text-muted-foreground">
            Vue complète des performances et tendances de la plateforme
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
              <SelectItem value="1y">1 an</SelectItem>
              <SelectItem value="all">Toute période</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenus Totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(revenueData?.totalRevenue || 0)}
                </div>
                <div className="text-xs text-green-600">
                  +{formatPercent(revenueData?.growth || 0)} vs période précédente
                </div>
              </div>
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {(userData?.activeUsers || 0).toLocaleString()}
                </div>
                <div className="text-xs text-green-600">
                  +{formatPercent(userData?.growth || 0)} vs période précédente
                </div>
              </div>
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Réservations Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {(bookingData?.totalBookings || 0).toLocaleString()}
                </div>
                <div className="text-xs text-green-600">
                  +{formatPercent(bookingData?.growth || 0)} vs période précédente
                </div>
              </div>
              <div className="p-2 rounded-lg bg-purple-100">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Annonces Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {(platformData?.activeListings || 0).toLocaleString()}
                </div>
                <div className="text-xs text-green-600">
                  +{formatPercent(platformData?.listingGrowth || 0)} vs période précédente
                </div>
              </div>
              <div className="p-2 rounded-lg bg-rose-100">
                <Home className="h-5 w-5 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Évolution des Revenus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Graphique d'évolution des revenus</p>
                <p className="text-sm">Serait implémenté avec une bibliothèque de graphiques</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Croissance des Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <LineChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Graphique de croissance des utilisateurs</p>
                <p className="text-sm">Serait implémenté avec une bibliothèque de graphiques</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Distribution par Catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Logements</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{platformData?.categories?.properties || 0}</span>
                  <Badge variant="outline">{formatPercent((platformData?.categories?.properties || 0) / (platformData?.totalListings || 1))}</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Expériences</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{platformData?.categories?.experiences || 0}</span>
                  <Badge variant="outline">{formatPercent((platformData?.categories?.experiences || 0) / (platformData?.totalListings || 1))}</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{platformData?.categories?.services || 0}</span>
                  <Badge variant="outline">{formatPercent((platformData?.categories?.services || 0) / (platformData?.totalListings || 1))}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Meilleures Performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Hôtes les plus actifs</h4>
                <div className="space-y-2">
                  {(platformData?.topHosts || []).slice(0, 3).map((host: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{host.name}</span>
                      <Badge variant="outline">{host.listings} annonces</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Annonces les plus réservées</h4>
                <div className="space-y-2">
                  {(platformData?.topListings || []).slice(0, 3).map((listing: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm truncate">{listing.title}</span>
                      <Badge variant="outline">{listing.bookings} réservations</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques Détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Métrique</th>
                  <th className="text-right p-2">Valeur</th>
                  <th className="text-right p-2">Variation</th>
                  <th className="text-right p-2">Période</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Taux de conversion</td>
                  <td className="text-right p-2">{formatPercent(bookingData?.conversionRate || 0)}</td>
                  <td className="text-right p-2 text-green-600">+{formatPercent(bookingData?.conversionGrowth || 0)}</td>
                  <td className="text-right p-2">{timeRange}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Panier moyen</td>
                  <td className="text-right p-2">{formatCurrency(revenueData?.averageOrderValue || 0)}</td>
                  <td className="text-right p-2 text-green-600">+{formatPercent(revenueData?.aovGrowth || 0)}</td>
                  <td className="text-right p-2">{timeRange}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Taux de rétention</td>
                  <td className="text-right p-2">{formatPercent(userData?.retentionRate || 0)}</td>
                  <td className="text-right p-2 text-green-600">+{formatPercent(userData?.retentionGrowth || 0)}</td>
                  <td className="text-right p-2">{timeRange}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Durée moyenne de séjour</td>
                  <td className="text-right p-2">{bookingData?.averageStayDuration || 0} jours</td>
                  <td className="text-right p-2 text-green-600">+{formatPercent(bookingData?.stayDurationGrowth || 0)}</td>
                  <td className="text-right p-2">{timeRange}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Satisfaction client</td>
                  <td className="text-right p-2">{platformData?.satisfactionScore || 0}/5</td>
                  <td className="text-right p-2 text-green-600">+{formatPercent(platformData?.satisfactionGrowth || 0)}</td>
                  <td className="text-right p-2">{timeRange}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
