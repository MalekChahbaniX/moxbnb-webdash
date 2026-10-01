'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MessageNotification from '@/components/moxbnb/MessageNotification';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

type Lang = 'fr' | 'en' | 'ar';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const pathname = usePathname();

  const handleLanguageChange = (newLang: Lang) => {
    setLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  // close the mobile panel after navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/properties', label: t('nav.properties') },
    { href: '/student-housing', label: t('properties.studentHousing') },
    { href: '/experiences', label: t('nav.experiences') },
    { href: '/services', label: t('nav.services') },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  const languages: { code: Lang; label: string }[] = [
    { code: 'fr', label: t('common.french') },
    { code: 'en', label: t('common.english') },
    { code: 'ar', label: t('common.arabic') },
  ];

  const initials =
    `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U';
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo (a link, not an <h1>: each page owns its single h1) */}
          <Link
            href="/"
            aria-label="Moxbnb"
            className={`rounded-md bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-2xl font-bold text-transparent ${focusRing}`}
          >
            Moxbnb
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${focusRing} ${
                    active
                      ? 'bg-sky-50 font-medium text-sky-900'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Language + auth (desktop) */}
          <div className="hidden items-center gap-2 md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Langue"
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 ${focusRing}`}
              >
                <Globe className="h-4 w-4" />
                {language.toUpperCase()}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map(({ code, label }) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={language === code ? 'font-medium text-sky-900' : ''}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated && user && <MessageNotification />}

            {loading ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" aria-hidden />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`flex items-center gap-2 rounded-full border border-slate-200 py-1 pe-3 ps-1 hover:bg-slate-50 ${focusRing}`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-900 text-xs font-semibold text-white">
                    {initials}
                  </span>
                  <span className="max-w-[9rem] truncate text-sm font-medium">{fullName}</span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" data-testid="user-dropdown-content" className="w-52">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex w-full items-center">
                      <User className="mr-2 h-4 w-4" />
                      Mon Profil
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'CLIENT' && (
                    <DropdownMenuItem asChild>
                      <Link href="/bookings" className="w-full">
                        Mes Réservations
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/messages" className="w-full">
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="rounded-full bg-rose-600 hover:bg-rose-700">
                    {t('nav.signup')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className={`rounded-full p-2 hover:bg-slate-100 md:hidden ${focusRing}`}
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile panel */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="border-t py-4 md:hidden">
            <nav aria-label="Navigation mobile" className="flex flex-col gap-1">
              {links.map(({ href, label }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`rounded-xl px-3 py-3 text-sm ${
                      active ? 'bg-sky-50 font-medium text-sky-900' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* language: segmented control */}
            <div className="mt-4 flex items-center gap-2 px-3">
              <Globe className="h-4 w-4 text-slate-500" aria-hidden />
              <div className="flex rounded-full border border-slate-200 p-0.5" role="group" aria-label="Langue">
                {languages.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    aria-pressed={language === code}
                    className={`rounded-full px-3 py-1 text-sm ${
                      language === code ? 'bg-sky-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {isAuthenticated && user && (
              <div className="mt-3 px-3">
                <MessageNotification />
              </div>
            )}

            <div className="mt-4 border-t px-1 pt-4">
              {loading ? (
                <div className="mx-2 h-9 w-9 animate-pulse rounded-full bg-slate-100" aria-hidden />
              ) : isAuthenticated && user ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 px-2 pb-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-900 text-xs font-semibold text-white">
                      {initials}
                    </span>
                    <span className="text-sm font-medium">{fullName}</span>
                  </div>
                  <Link href="/profile" className="rounded-xl px-3 py-3 text-sm hover:bg-slate-100">
                    Mon Profil
                  </Link>
                  {user.role === 'CLIENT' && (
                    <Link href="/bookings" className="rounded-xl px-3 py-3 text-sm hover:bg-slate-100">
                      Mes Réservations
                    </Link>
                  )}
                  <Link href="/messages" className="rounded-xl px-3 py-3 text-sm hover:bg-slate-100">
                    Messages
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center rounded-xl px-3 py-3 text-start text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="block">
                    <Button variant="outline" className="w-full rounded-full">
                      {t('nav.login')}
                    </Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button className="w-full rounded-full bg-rose-600 hover:bg-rose-700">
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