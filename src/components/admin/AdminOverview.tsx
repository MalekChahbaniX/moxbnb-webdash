'use client';

import { Users, Home, Calendar, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminOverview() {
  const stats = [
    {
      title: 'Total Utilisateurs',
      value: '2,458',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Annonces Actives',
      value: '1,234',
      change: '+8%',
      icon: Home,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100'
    },
    {
      title: 'Réservations du mois',
      value: '892',
      change: '+15%',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Revenus du mois',
      value: '245,680 DT',
      change: '+22%',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const recentActivity = [
    {
      type: 'reservation',
      title: 'Nouvelle réservation - Villa Hammamet',
      time: 'Il y a 5 minutes',
      status: 'pending'
    },
    {
      type: 'listing',
      title: 'Nouvelle annonce soumise - Appartement Tunis',
      time: 'Il y a 15 minutes',
      status: 'pending'
    },
    {
      type: 'review',
      title: 'Nouvel avis signalé - Expérience Djerba',
      time: 'Il y a 30 minutes',
      status: 'warning'
    },
    {
      type: 'user',
      title: 'Nouveau compte créé - Ahmed K.',
      time: 'Il y a 1 heure',
      status: 'success'
    },
    {
      type: 'reservation',
      title: 'Réservation confirmée - Service Massage',
      time: 'Il y a 2 heures',
      status: 'success'
    }
  ];

  const pendingActions = [
    {
      type: 'validation',
      title: '12 annonces en attente de validation',
      priority: 'high'
    },
    {
      type: 'reservation',
      title: '8 réservations nécessitent une validation',
      priority: 'high'
    },
    {
      type: 'review',
      title: '5 avis signalés pour modération',
      priority: 'medium'
    },
    {
      type: 'payment',
      title: '3 paiements en attente de traitement',
      priority: 'medium'
    }
  ];

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
