'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Star, Filter, CheckCircle, XCircle, AlertCircle, Search, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/provider/bookings');
        const bookingsData = response.data?.data || response.data;
        setBookings(bookingsData);
        setFiltered(bookingsData);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(filtered);
  }, [bookings, statusFilter, searchTerm]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/bookings/${id}`, { status: newStatus });
      setBookings(bookings.map(booking =>
        booking.id === id ? { ...booking, status: newStatus } : booking
      ));
      setFiltered(filtered.map(booking =>
        booking.id === id ? { ...booking, status: newStatus } : booking
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Réservations</h1>
        <p className="text-gray-600">Gérez toutes les réservations de vos services</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  placeholder="Rechercher par client ou service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
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

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                {/* Left side - Booking Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.serviceTitle}
                    </h3>
                    <Badge variant={
                      booking.status === 'confirmed' ? 'default' :
                      booking.status === 'pending' ? 'secondary' :
                      booking.status === 'completed' ? 'outline' : 'destructive'
                    }>
                      {booking.status === 'confirmed' ? 'Confirmée' :
                       booking.status === 'pending' ? 'En attente' :
                       booking.status === 'completed' ? 'Complétée' : 'Annulée'}
                    </Badge>
                  </div>

                  {/* Client Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Client:</p>
                      <p className="font-medium">{booking.clientName}</p>
                      <p className="text-gray-500">{booking.clientEmail}</p>
                      <p className="text-gray-500">{booking.clientPhone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date & Heure:</p>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        <p className="font-medium">
                          {new Date(booking.date).toLocaleDateString('fr-FR')} à {booking.time}
                        </p>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="mr-2 h-4 w-4 text-gray-400" />
                        <p className="font-medium">{booking.duration}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-600">Participants</p>
                        <p className="font-medium">{booking.guests} personne(s)</p>
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
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-600">Lieu</p>
                        <p className="font-medium">{booking.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Demandes spéciales:</p>
                      <p className="text-sm">{booking.specialRequests || 'Aucune'}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 mt-4">
                    {booking.status === 'pending' && (
                      <>
                        <Button 
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirmer
                        </Button>
                        <Button 
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          variant="destructive"
                        >
                          Refuser
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button 
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Marquer comme complétée
                      </Button>
                    )}
                    <Button variant="outline">
                      Contacter le client
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune réservation trouvée
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Essayez de modifier vos critères de recherche' : 'Vous n\'avez pas encore de réservations'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
