'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/moxbnb/Header';
import Footer from '@/components/moxbnb/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, User, Star, Filter, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function BookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [filterStatus, setFilterStatus] = useState('all');
  const [bookings, setBookings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/bookings');
        setBookings(response.data?.data || response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour voir vos réservations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/login" className="block w-full">
              <Button className="w-full">Se connecter</Button>
            </Link>
            <Link href="/signup" className="block w-full">
              <Button variant="outline" className="w-full">S'inscrire</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Confirmée</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-600"><AlertCircle className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">Terminée</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Property Image */}
          <div className="md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={booking.propertyImage}
              alt={booking.propertyTitle}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Booking Details */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{booking.propertyTitle}</h3>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <User className="h-4 w-4 mr-1" />
                  {booking.hostName}
                </p>
              </div>
              {getStatusBadge(booking.status)}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <div>
                  <p className="text-xs text-gray-500">Arrivée</p>
                  <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <div>
                  <p className="text-xs text-gray-500">Départ</p>
                  <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <div>
                  <p className="text-xs text-gray-500">Voyageurs</p>
                  <p className="font-medium">{booking.guests}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                <div>
                  <p className="text-xs text-gray-500">Note</p>
                  <p className="font-medium">{booking.rating}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <p className="text-lg font-bold text-rose-600">{booking.totalPrice} DT</p>
              <div className="flex gap-2">
                {booking.status === 'CONFIRMED' && (
                  <>
                    <Button variant="outline" size="sm">Modifier</Button>
                    <Button variant="destructive" size="sm">Annuler</Button>
                  </>
                )}
                {booking.status === 'PENDING' && (
                  <>
                    <Button size="sm">Confirmer</Button>
                    <Button variant="outline" size="sm">Annuler</Button>
                  </>
                )}
                {booking.status === 'COMPLETED' && !booking.userRating && (
                  <Button size="sm">Noter</Button>
                )}
                <Button variant="ghost" size="sm">Détails</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mes Réservations</h1>
            <p className="text-gray-600 mt-2">Gérez toutes vos réservations de logements</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">À venir</TabsTrigger>
              <TabsTrigger value="past">Passées</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {bookings.upcoming.length > 0 ? (
                bookings.upcoming.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Aucune réservation à venir</p>
                    <Link href="/properties" className="block mt-4">
                      <Button>Explorer les logements</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {bookings.past.length > 0 ? (
                bookings.past.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Aucune réservation passée</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {bookings.cancelled.length > 0 ? (
                bookings.cancelled.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <XCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Aucune réservation annulée</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
