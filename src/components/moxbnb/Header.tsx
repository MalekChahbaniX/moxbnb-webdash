'use client';

import { useState } from 'react';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout, loading } = useAuth();

  const handleLanguageChange = (newLang: 'fr' | 'en' | 'ar') => {
    setLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
              Moxbnb
            </h1>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="px-4 py-2 text-sm font-medium transition-colors hover:text-rose-600"
                >
                  {t('nav.home')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#properties"
                  className="px-4 py-2 text-sm font-medium transition-colors hover:text-rose-600"
                >
                  {t('nav.properties')}
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#experiences"
                  className="px-4 py-2 text-sm font-medium transition-colors hover:text-rose-600"
                >
                  {t('nav.experiences')}
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#services"
                  className="px-4 py-2 text-sm font-medium transition-colors hover:text-rose-600"
                >
                  {t('nav.services')}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Language Selector & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 border rounded-lg px-3 py-1">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as 'fr' | 'en' | 'ar')}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer"
              >
                <option value="fr">{t('common.french')}</option>
                <option value="en">{t('common.english')}</option>
                <option value="ar">{t('common.arabic')}</option>
              </select>
            </div>
            
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div>
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.firstName} {user.lastName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Mon Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings">
                      Mes Réservations
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                    {t('nav.signup')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-sm font-medium px-2 py-2 hover:bg-muted rounded">
                {t('nav.home')}
              </a>
              <a href="#properties" className="text-sm font-medium px-2 py-2 hover:bg-muted rounded">
                {t('nav.properties')}
              </a>
              <a href="#experiences" className="text-sm font-medium px-2 py-2 hover:bg-muted rounded">
                {t('nav.experiences')}
              </a>
              <a href="#services" className="text-sm font-medium px-2 py-2 hover:bg-muted rounded">
                {t('nav.services')}
              </a>
              
              <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 w-fit">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value as 'fr' | 'en' | 'ar')}
                  className="bg-transparent text-sm font-medium outline-none cursor-pointer"
                >
                  <option value="fr">{t('common.french')}</option>
                  <option value="en">{t('common.english')}</option>
                  <option value="ar">{t('common.arabic')}</option>
                </select>
              </div>

              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div>
              ) : isAuthenticated && user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <div className="flex items-center space-x-2 px-2 py-1">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user.firstName} {user.lastName}</span>
                  </div>
                  <Button onClick={logout} variant="ghost" size="sm" className="w-full text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Link href="/login" className="block w-full">
                    <Button variant="ghost" size="sm" className="w-full">
                      {t('nav.login')}
                    </Button>
                  </Link>
                  <Link href="/signup" className="block w-full">
                    <Button size="sm" className="w-full bg-rose-600 hover:bg-rose-700">
                      {t('nav.signup')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
