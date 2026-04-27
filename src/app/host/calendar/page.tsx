'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Home, Clock } from 'lucide-react';
import Link from 'next/link';
import { bookingToUiRow, fetchHostBookings } from '@/services/hostService';

export default function HostCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [bookings, setBookings] = useState<ReturnType<typeof bookingToUiRow>[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { items } = await fetchHostBookings({ limit: 300 });
      setBookings(items.map(bookingToUiRow));
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const calendarBookings = useMemo(
    () =>
      bookings.filter((b) => b.status !== 'cancelled').map((b) => ({
        id: b.id,
        propertyTitle: b.propertyTitle,
        clientName: b.clientName,
        checkIn: new Date(b.checkIn),
        checkOut: b.checkOut ? new Date(b.checkOut) : new Date(b.checkIn),
        guests: b.guests,
        status: b.status,
        totalAmount: b.totalPrice,
      })),
    [bookings]
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    return days;
  };

  const getBookingsForDate = (date: Date) => {
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    return calendarBookings.filter((booking) => {
      return booking.checkIn <= dayEnd && booking.checkOut >= dayStart;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const monthDays = getDaysInMonth(currentDate);
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'prev' ? -1 : 1));
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendrier</h1>
            <p className="text-gray-600">Vue d&apos;ensemble des réservations</p>
          </div>
          <div className="flex items-center space-x-4 flex-wrap">
            <Link href="/host/dashboard">
              <Button variant="outline" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}>
              {viewMode === 'month' ? 'Semaine' : 'Mois'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {loading && <p className="text-gray-600 mb-4">Chargement des réservations…</p>}

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              {monthNames[(currentDate.getMonth() - 1 + 12) % 12]}
            </Button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="outline" onClick={() => navigateMonth('next')}>
              {monthNames[(currentDate.getMonth() + 1) % 12]}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((day, index) => {
              const dayBookings = day ? getBookingsForDate(day) : [];
              const hasBooking = dayBookings.length > 0;
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

                  {hasBooking && day && (
                    <div className="mt-1 space-y-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.id}
                          className="text-xs p-1 bg-rose-500 text-white rounded truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{booking.propertyTitle}</span>
                            <div className="flex items-center space-x-1 shrink-0">
                              <Clock className="h-3 w-3" />
                              <span>{booking.guests}p</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs p-1 bg-gray-500 text-white rounded text-center">
                          +{dayBookings.length - 2} plus
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

      {selectedDate && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Détails pour le {selectedDate.toLocaleDateString('fr-FR')}</CardTitle>
            <CardDescription>Réservations actives sur cette date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getBookingsForDate(selectedDate).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{booking.propertyTitle}</h3>
                    <div className="text-sm text-gray-600">
                      <p>Client : {booking.clientName}</p>
                      <p>
                        Du {booking.checkIn.toLocaleDateString('fr-FR')} au{' '}
                        {booking.checkOut.toLocaleDateString('fr-FR')}
                      </p>
                      <p>Voyageurs : {booking.guests}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{booking.totalAmount} TND</div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2 inline-block">
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}

              {getBookingsForDate(selectedDate).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="mx-auto h-12 w-12 mb-4" />
                  <p>Aucune réservation pour cette date</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
