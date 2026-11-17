'use client';

import { useState } from 'react';
import {
  LayoutDashboard, CalendarCheck, Home, Compass, Briefcase,
  Users, Star, BarChart3, Settings, LogOut, Shield, Menu, X
} from 'lucide-react';
import { BadgePercent } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: 'overview',      icon: LayoutDashboard, label: t('admin.overview') },
    { id: 'reservations',  icon: CalendarCheck,   label: t('admin.reservations') },
    { id: 'listings',      icon: Home,            label: t('admin.listings') },
    { id: 'experiences',   icon: Compass,         label: t('admin.experiences') },
    { id: 'services',      icon: Briefcase,       label: t('admin.services') },
    { id: 'promotions',     icon: BadgePercent,    label: 'Promotions' },
    { id: 'users',         icon: Users,           label: t('admin.users') },
    { id: 'reviews',       icon: Star,            label: t('admin.reviews') },
    { id: 'statistics',    icon: BarChart3,       label: t('admin.statistics') },
    { id: 'settings',      icon: Settings,        label: t('admin.settings') },
  ];

  const handleSelect = (id: string) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r">
      {/* Logo + close */}
      <div className="flex items-center justify-between px-4 py-5 border-b">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-rose-600" />
            <h2 className="text-xl font-bold text-rose-600">Moxbnb Admin</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Espace de gestion agency</p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100"
          aria-label="Fermer le menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeSection === item.id
                ? 'bg-rose-50 text-rose-600'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => { logout(); window.location.href = '/'; }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('auth.logout')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — mobile: slide-in drawer, desktop: fixed */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-white border-b shadow-sm sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-rose-600" />
            <span className="text-lg font-bold text-rose-600">Moxbnb Admin</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}