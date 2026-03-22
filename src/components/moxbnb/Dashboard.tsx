'use client';

import { useState } from 'react';
import { LayoutDashboard, Calendar, MessageSquare, Settings, User, Home, Compass, Briefcase, LogOut, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { t } = useLanguage();

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
    { id: 'bookings', icon: Calendar, label: t('dashboard.myBookings') },
    { id: 'listings', icon: Home, label: t('dashboard.myListings') },
    { id: 'experiences', icon: Compass, label: 'Mes Expériences' },
    { id: 'services', icon: Briefcase, label: t('dashboard.myServices') },
    { id: 'messages', icon: MessageSquare, label: t('dashboard.messages') },
    { id: 'profile', icon: User, label: t('dashboard.profile') },
    { id: 'stats', icon: BarChart3, label: t('dashboard.statistics') },
    { id: 'settings', icon: Settings, label: t('dashboard.settings') },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen p-4 hidden lg:block">
          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
              {t('dashboard.title')}
            </h2>
          </div>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button variant="outline" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Bienvenue, {t('dashboard.traveler')}
            </h1>
            <p className="text-muted-foreground">
              Gérez vos réservations et activités sur Moxbnb
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Réservations à venir
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">3</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Prochain: 15 Jan 2025
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Dépenses totales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2,450 DT</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ce mois-ci
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Avis à donner
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Après vos séjours
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.upcoming')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Villa avec Piscine à Hammamet',
                        date: '15-20 Jan 2025',
                        status: 'Confirmée',
                        price: '3,750 DT'
                      },
                      {
                        title: 'Dégustation Cuisine Traditionnelle',
                        date: '18 Jan 2025',
                        status: 'Confirmée',
                        price: '150 DT'
                      },
                      {
                        title: 'Appartement Sidi Bou Said',
                        date: '22-25 Jan 2025',
                        status: 'Confirmée',
                        price: '1,050 DT'
                      }
                    ].map((booking, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{booking.title}</h4>
                          <p className="text-sm text-muted-foreground">{booking.date}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">{booking.status}</Badge>
                          <p className="text-sm font-medium">{booking.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.myBookings')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Gérez toutes vos réservations de logements, expériences et services
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="listings">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.myListings')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Créez et gérez vos annonces de logements
                  </p>
                  <Button className="mt-4 bg-rose-600 hover:bg-rose-700">
                    + Nouvelle annonce
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.messages')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Vos conversations avec les hôtes et voyageurs
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.profile')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Gérez vos informations personnelles et préférences
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.statistics')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Vos statistiques de performance en tant qu'hôte ou prestataire
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.settings')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Paramètres de compte, sécurité et notifications
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
