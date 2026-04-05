'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, DollarSign, Filter, Search } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with API call
const mockBookings = [
  {
    id: '1',
    propertyTitle: 'Villa de Luxe à Sidi Bou Said',
    clientName: 'Mohamed Ben Ali',
    clientEmail: 'mohamed@email.com',
    clientPhone: '+216 55 123 456',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    guests: 4,
    totalPrice: 750,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2024-01-10',
    specialRequests: 'Arrivée tardive possible'
  },
  {
    id: '2',
    propertyTitle: 'Appartement Centre Ville',
    clientName: 'Sarra Trabelsi',
    clientEmail: 'sarra@email.com',
    clientPhone: '+216 98 765 432',
    checkIn: '2024-01-20',
    checkOut: '2024-01-22',
    guests: 2,
    totalPrice: 240,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2024-01-15',
    specialRequests: 'Animaux autorisés'
  },
  {
    id: '3',
    propertyTitle: 'Studio Coquet Hammamet',
    clientName: 'Youssef Karray',
    clientEmail: 'youssef@email.com',
    clientPhone: '+216 22 987 654',
    checkIn: '2024-01-08',
    checkOut: '2024-01-10',
    guests: 2,
    totalPrice: 160,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2024-01-05',
    specialRequests: ''
  }
];

export default function HostBookingsPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [filtered, setFiltered] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleStatusChange = async (id: string, newStatus: string) => {
    // TODO: API call to update booking status
    setBookings(bookings.map(booking =>
      booking.id === id ? { ...booking, status: newStatus } : booking
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Réservations</h1>
        <p className="text-gray-600">Gérez toutes les réservations de vos propriétés</p>
      </div>

      {/* Filters */}
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
      <div className="space-y-4">
        {filtered.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                {/* Left side - Booking Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.propertyTitle}
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
                      <p className="text-gray-600">Dates:</p>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        <p className="font-medium">
                          {new Date(booking.checkIn).toLocaleDateString('fr-FR')} - {new Date(booking.checkOut).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
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

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Demandes spéciales:</p>
                      <p className="text-sm">{booking.specialRequests}</p>
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

      {/* Empty State */}
      {filtered.length === 0 && (
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
