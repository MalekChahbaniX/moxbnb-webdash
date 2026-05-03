'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Wrench, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Users,
  TrendingUp,
  DollarSign,
  Mountain
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de Bord', href: '/provider/dashboard', icon: Home },
  { name: 'Mes Services', href: '/provider/services', icon: Wrench },
  { name: 'Mes Expériences', href: '/provider/experiences', icon: Mountain },
  { name: 'Calendrier', href: '/provider/calendar', icon: Calendar },
  { name: 'Réservations', href: '/provider/bookings', icon: Calendar },
  { name: 'Messages', href: '/provider/messages', icon: MessageSquare },
  { name: 'Revenus', href: '/provider/earnings', icon: DollarSign },
  { name: 'Analytics', href: '/provider/analytics', icon: TrendingUp },
  { name: 'Clients', href: '/provider/clients', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
            <Link href="/provider/dashboard" className="text-xl font-bold text-blue-600">
              Moxbnb Provider
            </Link>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
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
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <Link
              href="/"
              className="group block w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              Retour au Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
