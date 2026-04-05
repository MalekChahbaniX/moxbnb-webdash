'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Home, Check, X, Clock } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with API call
const mockBookings = [
  {
    id: '1',
    propertyTitle: 'Villa de Luxe à Sidi Bou Said',
    clientName: 'Mohamed Ben Ali',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    guests: 4,
    status: 'confirmed',
    totalAmount: 750
  },
  {
    id: '2',
    propertyTitle: 'Appartement Centre Ville',
    clientName: 'Sarra Trabelsi',
    checkIn: '2024-01-20',
    checkOut: '2024-01-22',
    guests: 2,
    status: 'pending',
    totalAmount: 240
  },
  {
    id: '3',
    propertyTitle: 'Studio Coquet Hammamet',
    clientName: 'Youssef Karray',
    checkIn: '2024-01-08',
    checkOut: '2024-01-10',
    guests: 2,
    status: 'completed',
    totalAmount: 160
  }
];

export default function HostCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getBookingsForDate = (date: Date) => {
    if (!date) return [];
    return mockBookings.filter(booking => {
      const bookingStart = new Date(booking.checkIn);
      const bookingEnd = new Date(booking.checkOut);
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  const isToday = (date: Date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const monthDays = getDaysInMonth(currentDate);
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendrier</h1>
            <p className="text-gray-600">Vue d'ensemble des réservations</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/host/dashboard">
              <Button variant="outline" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}
              >
                {viewMode === 'month' ? 'Semaine' : 'Mois'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {monthNames[(currentDate.getMonth() - 1 + 12) % 12]}
            </Button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button 
              variant="outline" 
              onClick={() => navigateMonth('next')}
            >
              {monthNames[(currentDate.getMonth() + 1) % 12]}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((day, index) => {
              const bookings = day ? getBookingsForDate(day) : [];
              const hasBooking = bookings.length > 0;
              const isCurrentDay = day && isToday(day);

              return (
                <div
                  key={index}
                  className={`
                    min-h-24 p-2 border rounded-lg
                    ${!day ? 'bg-gray-50' : 'bg-white'}
                    ${isCurrentDay ? 'ring-2 ring-rose-500' : ''}
                    ${hasBooking ? 'bg-rose-100 border-rose-200' : 'hover:bg-gray-50'}
                    cursor-pointer
                  `}
                  onClick={() => day && setSelectedDate(day)}
                >
                  <div className={`text-sm ${!day ? 'text-gray-400' : 'text-gray-900'}`}>
                    {day ? day.getDate() : ''}
                  </div>
                  
                  {/* Booking indicators */}
                  {hasBooking && day && (
                    <div className="mt-1 space-y-1">
                      {bookings.slice(0, 2).map((booking, bookingIndex) => (
                        <div
                          key={bookingIndex}
                          className="text-xs p-1 bg-rose-500 text-white rounded truncate"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Show booking details modal
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{booking.propertyTitle}</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{booking.guests}p</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {bookings.length > 2 && (
                        <div className="text-xs p-1 bg-gray-500 text-white rounded text-center">
                          +{bookings.length - 2} plus
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              Détails pour le {selectedDate.toLocaleDateString('fr-FR')}
            </CardTitle>
            <CardDescription>
              Réservations pour cette date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getBookingsForDate(selectedDate).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{booking.propertyTitle}</h3>
                    <div className="text-sm text-gray-600">
                      <p>Client: {booking.clientName}</p>
                      <p>Check-in: {new Date(booking.checkIn).toLocaleDateString('fr-FR')}</p>
                      <p>Check-out: {new Date(booking.checkOut).toLocaleDateString('fr-FR')}</p>
                      <p>Voyageurs: {booking.guests}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {booking.totalAmount} TND
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status === 'confirmed' ? 'Confirmée' :
                         booking.status === 'pending' ? 'En attente' : 'Complétée'}
                      </span>
                      <Button size="sm" variant="outline">
                        Voir les détails
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {getBookingsForDate(selectedDate).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="mx-auto h-12 w-12 mb-4" />
                  <p>Aucune réservation pour cette date</p>
                  <Button className="mt-4">
                    <Check className="mr-2 h-4 w-4" />
                    Marquer comme disponible
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
