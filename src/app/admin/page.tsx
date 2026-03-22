'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminReservations from '@/components/admin/AdminReservations';
import AdminListings from '@/components/admin/AdminListings';
import AdminServices from '@/components/admin/AdminServices';
import AdminUsers from '@/components/admin/AdminUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverview />;
      case 'reservations':
        return <AdminReservations />;
      case 'listings':
        return <AdminListings />;
      case 'experiences':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Validation des Expériences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Module de validation des expériences (similaire aux annonces)
              </p>
            </CardContent>
          </Card>
        );
      case 'services':
        return <AdminServices />;
      case 'users':
        return <AdminUsers />;
      case 'reviews':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Modération des Avis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Module de modération des avis (en cours de développement)
              </p>
            </CardContent>
          </Card>
        );
      case 'statistics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Statistiques Détaillées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tableau de bord statistiques avancées (en cours de développement)
              </p>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Administrateur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configuration de la plateforme (en cours de développement)
              </p>
            </CardContent>
          </Card>
        );
      default:
        return <AdminOverview />;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderContent()}
    </AdminLayout>
  );
}
