'use client';

import { Search, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import MessageNotification from '@/components/moxbnb/MessageNotification';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
      router.push('/login');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-3">

          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex-shrink-0"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher des services..."
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <MessageNotification />

            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 leading-tight">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Provider User'}
                </p>
                <p className="text-xs text-gray-500">{user?.email || 'provider@moxbnb.com'}</p>
              </div>
            </div>

            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage src={user?.avatar || "/api/placeholder/40/40"} alt="Provider" />
              <AvatarFallback>
                {user?.firstName ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'PU'}
              </AvatarFallback>
            </Avatar>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="p-2">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}