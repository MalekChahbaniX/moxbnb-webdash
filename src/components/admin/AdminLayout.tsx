'use client';

import { useState } from 'react';
import { LayoutDashboard, CalendarCheck, Home, Compass, Briefcase, Users, Star, BarChart3, Settings, LogOut, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function AdminLayout({ children, activeSection, setActiveSection }: AdminLayoutProps) {
  const { t } = useLanguage();
  const { logout } = useAuth();

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: t('admin.overview') },
    { id: 'reservations', icon: CalendarCheck, label: t('admin.reservations') },
    { id: 'listings', icon: Home, label: t('admin.listings') },
    { id: 'experiences', icon: Compass, label: t('admin.experiences') },
    { id: 'services', icon: Briefcase, label: t('admin.services') },
    { id: 'users', icon: Users, label: t('admin.users') },
    { id: 'reviews', icon: Star, label: t('admin.reviews') },
    { id: 'statistics', icon: BarChart3, label: t('admin.statistics') },
    { id: 'settings', icon: Settings, label: t('admin.settings') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen p-4 hidden lg:block">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-6 w-6 text-rose-600" />
              <h2 className="text-xl font-bold text-rose-600">
                Moxbnb Admin
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Espace de gestion agency
            </p>
          </div>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button 
              variant="outline" 
              className="w-auto px-4"
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('auth.logout')}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
