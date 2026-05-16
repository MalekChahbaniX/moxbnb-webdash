'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/moxbnb/Header';
import Footer from '@/components/moxbnb/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Calendar, Shield, LogOut, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const getRoleLabel = (role: string | undefined) => {
    const normalizedRole = role?.toLowerCase();

    if (normalizedRole === 'admin') return t('profile.admin');
    if (normalizedRole === 'host') return t('profile.host');
    if (normalizedRole === 'provider' || normalizedRole === 'serviceprovider' || normalizedRole === 'serviceProvider') return t('profile.provider');
    return t('profile.client');
  };

  const normalizedRole = user?.role?.toLowerCase();
  const isTraveler = normalizedRole === 'traveler' || normalizedRole === 'client';
  const isHost = normalizedRole === 'host';
  const isProvider = normalizedRole === 'provider' || normalizedRole === 'serviceprovider';
  const isAdmin = normalizedRole === 'admin';

  const profileSubtitle = isProvider
    ? t('profile.subtitleProvider')
    : isHost
      ? t('profile.subtitleHost')
      : isAdmin
        ? t('profile.subtitleAdmin')
        : t('profile.subtitle');

  const quickActions = isTraveler
    ? [
        {
          title: t('profile.myBookings'),
          description: t('profile.manageBookings'),
          icon: Calendar,
          href: '/bookings',
        },
        {
          title: t('profile.preferences'),
          description: t('profile.customizeExperience'),
          icon: User,
          href: '/preferences',
        },
        {
          title: t('profile.security'),
          description: t('profile.manageSecurity'),
          icon: Shield,
          href: '/security',
        },
      ]
    : isHost
      ? [
          {
            title: t('profile.myProperties'),
            description: t('profile.manageProperties'),
            icon: User,
            href: '/host/listings',
          },
          {
            title: t('profile.myBookings'),
            description: t('profile.manageReservations'),
            icon: Calendar,
            href: '/host/bookings',
          },
          {
            title: t('profile.messages'),
            description: t('profile.manageMessages'),
            icon: Shield,
            href: '/messages',
          },
        ]
      : isProvider
        ? [
            {
              title: t('profile.myServices'),
              description: t('profile.manageServices'),
              icon: User,
              href: '/provider/services',
            },
            {
              title: t('profile.myClients'),
              description: t('profile.viewClients'),
              icon: Calendar,
              href: '/provider/clients',
            },
            {
              title: t('profile.myEarnings'),
              description: t('profile.viewEarnings'),
              icon: Shield,
              href: '/provider/earnings',
            },
          ]
        : [
            {
              title: t('profile.myBookings'),
              description: t('profile.manageBookings'),
              icon: Calendar,
              href: '/bookings',
            },
            {
              title: t('profile.preferences'),
              description: t('profile.customizeExperience'),
              icon: User,
              href: '/preferences',
            },
            {
              title: t('profile.security'),
              description: t('profile.manageSecurity'),
              icon: Shield,
              href: '/security',
            },
          ];

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>{t('auth.login.title')}</CardTitle>
            <CardDescription>
              {t('auth.login.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/login" className="block w-full">
              <Button className="w-full">{t('auth.login.signIn')}</Button>
            </Link>
            <Link href="/signup" className="block w-full">
              <Button variant="outline" className="w-full">{t('auth.signup.title')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('profile.title')}</h1>
          <p className="text-gray-600 mt-2">{profileSubtitle}</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar || ''} />
                  <AvatarFallback className="text-lg">
                    {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Shield className="h-4 w-4 mr-1" />
                    {getRoleLabel(user.role)}
                  </CardDescription>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  {isEditing ? t('profile.cancel') : t('profile.edit')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('profile.personalInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('profile.firstName')}</Label>
                  <Input
                    id="firstName"
                    value={user.firstName}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('profile.lastName')}</Label>
                  <Input
                    id="lastName"
                    value={user.lastName}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('profile.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      value={user.email}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50 pl-10" : "pl-10"}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('profile.phone')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={user.phone || t('profile.notProvided')}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50 pl-10" : "pl-10"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Status */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('profile.accountStatus')}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('profile.emailVerified')}</span>
                  <Badge variant={user.isVerified ? "default" : "secondary"}>
                    {user.isVerified ? t('profile.yes') : t('profile.no')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('profile.accountType')}</span>
                  <Badge variant="outline">
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </div>
            </div>

            {isEditing && (
              <>
                <Separator />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    {t('profile.cancel')}
                  </Button>
                  <Button>
                    {t('profile.saveChanges')}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href || '#'} className="block">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-rose-600" />
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Danger Zone */}
        <Card className="mt-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">{t('profile.dangerZone')}</CardTitle>
            <CardDescription>
              {t('profile.dangerZoneDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('profile.logout')}
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
