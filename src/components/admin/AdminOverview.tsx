'use client';

import { useEffect, useState } from 'react';
import { Users, Home, Calendar, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getAdminDashboard } from '@/services/adminService';

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminDashboard();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const stats = dashboardData?.stats ? [
    {
      title: 'Total Utilisateurs',
      value: dashboardData.stats.totalUsers?.toLocaleString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Annonces Actives',
      value: dashboardData.stats.activeListings?.toLocaleString() || '0',
      icon: Home,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100'
    },
    {
      title: 'Réservations',
      value: dashboardData.stats.totalBookings?.toLocaleString() || '0',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Revenus Plateforme',
      value: (dashboardData.stats.platformRevenue || 0).toLocaleString() + ' DT',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ] : [];

  const pendingActions = [
    {
      type: 'validation',
      title: `${dashboardData?.pending?.listings || 0} annonces en attente de validation`,
      priority: dashboardData?.pending?.listings > 5 ? 'high' : 'medium'
    },
    {
      type: 'service',
      title: `${dashboardData?.pending?.services || 0} services en attente de validation`,
      priority: dashboardData?.pending?.services > 3 ? 'high' : 'medium'
    },
    {
      type: 'experience',
      title: `${dashboardData?.pending?.experiences || 0} expériences en attente de validation`,
      priority: dashboardData?.pending?.experiences > 3 ? 'high' : 'medium'
    },
    {
      type: 'review',
      title: `${dashboardData?.pending?.reviews || 0} avis signalés pour modération`,
      priority: dashboardData?.pending?.reviews > 2 ? 'high' : 'medium'
    }
  ];

  const recentActivity: any[] = [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>;
      case 'warning':
        return <Badge className="bg-orange-100 text-orange-800">À vérifier</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Haute</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Moyenne</Badge>;
      default:
        return <Badge>Basse</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord Administrateur</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de l'activité sur la plateforme Moxbnb
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-green-600">{stat.change}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'pending' ? 'bg-yellow-100' :
                    activity.status === 'warning' ? 'bg-orange-100' :
                    'bg-green-100'
                  }`}>
                    {activity.status === 'pending' ? (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    ) : activity.status === 'warning' ? (
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  {getStatusBadge(activity.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Requises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{action.title}</span>
                  </div>
                  {getPriorityBadge(action.priority)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
