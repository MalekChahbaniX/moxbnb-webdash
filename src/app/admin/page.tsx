'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminReservations from '@/components/admin/AdminReservations';
import AdminListings from '@/components/admin/AdminListings';
import AdminExperiences from '@/components/admin/AdminExperiences';
import AdminServices from '@/components/admin/AdminServices';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminReviews from '@/components/admin/AdminReviews';
import AdminStatistics from '@/components/admin/AdminStatistics';
import AdminSettings from '@/components/admin/AdminSettings';
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
        return <AdminExperiences />;
      case 'services':
        return <AdminServices />;
      case 'users':
        return <AdminUsers />;
      case 'reviews':
        return <AdminReviews />;
      case 'statistics':
        return <AdminStatistics />;
      case 'settings':
        return <AdminSettings />;
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
