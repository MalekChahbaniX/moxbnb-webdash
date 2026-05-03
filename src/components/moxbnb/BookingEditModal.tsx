'use client';

import { useState } from 'react';
import { X, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BookingEditModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBooking: any) => void;
}

export default function BookingEditModal({ booking, isOpen, onClose, onSave }: BookingEditModalProps) {
  const [checkIn, setCheckIn] = useState(booking?.checkIn ? new Date(booking.checkIn).toISOString().split('T')[0] : '');
  const [checkOut, setCheckOut] = useState(booking?.checkOut ? new Date(booking.checkOut).toISOString().split('T')[0] : '');
  const [guests, setGuests] = useState(booking?.guests || 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedBooking = {
      ...booking,
      checkIn: new Date(checkIn).toISOString(),
      checkOut: new Date(checkOut).toISOString(),
      guests: parseInt(guests.toString())
    };

    onSave(updatedBooking);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Modifier la réservation
          </DialogTitle>
          <DialogDescription>
            Modifiez les dates de séjour et le nombre de voyageurs
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkIn">Date d'arrivée</Label>
            <Input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkOut">Date de départ</Label>
            <Input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Nombre de voyageurs</Label>
            <select
              id="guests"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="1">1 voyageur</option>
              <option value="2">2 voyageurs</option>
              <option value="3">3 voyageurs</option>
              <option value="4">4 voyageurs</option>
              <option value="5">5 voyageurs</option>
              <option value="6">6 voyageurs</option>
              <option value="7">7 voyageurs</option>
              <option value="8">8 voyageurs</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Sauvegarder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
