'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, DollarSign, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  bookingToUiRow,
  fetchHostBookings,
  updateHostBookingStatus,
} from '@/services/hostService';

type UiBooking = ReturnType<typeof bookingToUiRow>;

export default function HostBookingsPage() {
  const [bookings, setBookings] = useState<UiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { items } = await fetchHostBookings({ limit: 200 });
      setBookings(items.map(bookingToUiRow));
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = bookings;
    if (statusFilter !== 'all') {
      list = list.filter((b) => b.status === statusFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (b) =>
          b.propertyTitle.toLowerCase().includes(q) ||
          b.clientName.toLowerCase().includes(q) ||
          b.clientEmail.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, searchTerm, statusFilter]);

  const patchStatus = async (id: string, uiStatus: string) => {
    try {
      setUpdatingId(id);
      await updateHostBookingStatus(id, uiStatus);
      await load();
    } catch (e: any) {
      alert(e?.message || 'Mise à jour impossible');
    } finally {
      setUpdatingId(null);
    }
  };

  const guestUserId = (b: UiBooking) => {
    const u = b.raw?.userId;
    if (u && typeof u === 'object' && u._id) return String(u._id);
    if (b.raw?.userId) return String(b.raw.userId);
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Réservations</h1>
        <p className="text-gray-600">Gérez toutes les réservations de vos propriétés</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  placeholder="Rechercher par client ou propriété..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="w-full md:w-56">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="all">Toutes les réservations</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmées</option>
                <option value="completed">Complétées</option>
                <option value="cancelled">Annulées</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center py-12 gap-2 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
          Chargement…
        </div>
      )}

      {error && !loading && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="pt-6 text-red-800">{error}</CardContent>
        </Card>
      )}

      {!loading && (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{booking.propertyTitle}</h3>
                      <Badge
                        variant={
                          booking.status === 'confirmed'
                            ? 'default'
                            : booking.status === 'pending'
                              ? 'secondary'
                              : booking.status === 'completed'
                                ? 'outline'
                                : 'destructive'
                        }
                      >
                        {booking.status === 'confirmed'
                          ? 'Confirmée'
                          : booking.status === 'pending'
                            ? 'En attente'
                            : booking.status === 'completed'
                              ? 'Complétée'
                              : 'Annulée'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Client</p>
                        <p className="font-medium">{booking.clientName}</p>
                        <p className="text-gray-500">{booking.clientEmail}</p>
                        <p className="text-gray-500">{booking.clientPhone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Dates</p>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          <p className="font-medium">
                            {new Date(booking.checkIn).toLocaleDateString('fr-FR')}
                            {booking.checkOut
                              ? ` — ${new Date(booking.checkOut).toLocaleDateString('fr-FR')}`
                              : ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-gray-600">Voyageurs</p>
                          <p className="font-medium">{booking.guests} personnes</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-gray-600">Total</p>
                          <p className="font-medium text-green-600">{booking.totalPrice} TND</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-gray-600">Paiement</p>
                          <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                            {booking.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {booking.specialRequests ? (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Demandes spéciales</p>
                        <p className="text-sm">{booking.specialRequests}</p>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2 mt-4">
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            disabled={updatingId === booking.id}
                            onClick={() => patchStatus(booking.id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Confirmer
                          </Button>
                          <Button
                            disabled={updatingId === booking.id}
                            onClick={() => patchStatus(booking.id, 'cancelled')}
                            variant="destructive"
                          >
                            Refuser
                          </Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          disabled={updatingId === booking.id}
                          onClick={() => patchStatus(booking.id, 'completed')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Marquer comme complétée
                        </Button>
                      )}
                      {guestUserId(booking) ? (
                        <Link href={`/host/messages?with=${guestUserId(booking)}`}>
                          <Button variant="outline" type="button">
                            Contacter le client
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" type="button" disabled>
                          Contacter le client
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <CardTitle className="text-lg font-medium text-gray-900 mb-2">Aucune réservation trouvée</CardTitle>
            <p className="text-gray-600">
              {searchTerm ? 'Essayez de modifier vos critères de recherche' : "Vous n'avez pas encore de réservations"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
