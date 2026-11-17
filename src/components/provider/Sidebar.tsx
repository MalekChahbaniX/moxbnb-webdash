'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { X, Home, Wrench, Calendar, MessageSquare, Users, TrendingUp, DollarSign, Mountain, BadgePercent } from 'lucide-react';

const navigation = [
  { name: 'Tableau de Bord', href: '/provider/dashboard', icon: Home },
  { name: 'Mes Services', href: '/provider/services', icon: Wrench },
  { name: 'Mes Expériences', href: '/provider/experiences', icon: Mountain },
  { name: 'Promotions', href: '/provider/promotions', icon: BadgePercent },
  { name: 'Calendrier', href: '/provider/calendar', icon: Calendar },
  { name: 'Réservations', href: '/provider/bookings', icon: Calendar },
  { name: 'Messages', href: '/provider/messages', icon: MessageSquare },
  { name: 'Revenus', href: '/provider/earnings', icon: DollarSign },
  { name: 'Analytics', href: '/provider/analytics', icon: TrendingUp },
  { name: 'Clients', href: '/provider/clients', icon: Users },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 border-b border-gray-200">
        <Link href="/provider/dashboard" className="text-xl font-bold text-blue-600" onClick={onClose}>
          Moxbnb Provider
        </Link>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          aria-label="Fermer le menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          Retour au Site
        </Link>
      </div>
    </div>
  );
}