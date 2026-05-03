'use client';

import { useState } from 'react';
import { X, Calendar, Users, MapPin, Star, CreditCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BookingDetailsModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Détails de la réservation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Logement</h3>
            <div className="flex gap-4">
              <img
                src={booking.listingId?.images?.[0] || '/api/placeholder/200/150'}
                alt={booking.listingId?.title}
                className="w-32 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium">{booking.listingId?.title}</h4>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {booking.listingId?.city}, {booking.listingId?.country}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{booking.listingId?.rating || 'N/A'}</span>
                  </div>
                  <span className="text-gray-600">
                    {booking.listingId?.bedrooms || 'N/A'} chambres • {booking.listingId?.bathrooms || 'N/A'} SDB
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Réservation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-gray-500">Arrivée</p>
                    <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-gray-500">Départ</p>
                    <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-gray-500">Voyageurs</p>
                    <p className="font-medium">{booking.guests}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-gray-500">Réservé le</p>
                    <p className="font-medium">{new Date(booking.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tarification</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Prix par nuit</span>
                <span>{booking.listingId?.price || 0} DT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Nombre de nuits</span>
                <span>{Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{booking.totalPrice - 50 - Math.round((booking.totalPrice - 50) * 0.1)} DT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frais de service</span>
                <span>{Math.round((booking.totalPrice - 50) * 0.1)} DT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frais de ménage</span>
                <span>50 DT</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-rose-600">{booking.totalPrice} DT</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Paiement</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Statut du paiement</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  booking.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  booking.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.paymentStatus === 'COMPLETED' ? 'Complété' :
                   booking.paymentStatus === 'PENDING' ? 'En attente' :
                   booking.paymentStatus === 'PROCESSING' ? 'En cours' : booking.paymentStatus}
                </span>
              </div>
              {booking.paymentProvider && (
                <div className="flex justify-between text-sm">
                  <span>Méthode de paiement</span>
                  <span>
                    {booking.paymentProvider === 'STRIPE' ? 'Carte bancaire' :
                     booking.paymentProvider === 'KONNECT' ? 'Konnect' :
                     booking.paymentProvider === 'FLOUCI' ? 'Flouci' :
                     booking.paymentProvider === 'CLICKTOPAY' ? 'Click to Pay' :
                     booking.paymentProvider}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Voyageur</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nom</span>
                <span>{booking.userId?.firstName} {booking.userId?.lastName}</span>
              </div>
              {booking.userId?.email && (
                <div className="flex justify-between text-sm">
                  <span>Email</span>
                  <span>{booking.userId.email}</span>
                </div>
              )}
              {booking.userId?.phone && (
                <div className="flex justify-between text-sm">
                  <span>Téléphone</span>
                  <span>{booking.userId.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Host Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hôte</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nom</span>
                <span>{booking.listingId?.hostId?.firstName} {booking.listingId?.hostId?.lastName}</span>
              </div>
              {booking.listingId?.hostId?.email && (
                <div className="flex justify-between text-sm">
                  <span>Email</span>
                  <span>{booking.listingId.hostId.email}</span>
                </div>
              )}
              {booking.listingId?.hostId?.phone && (
                <div className="flex justify-between text-sm">
                  <span>Téléphone</span>
                  <span>{booking.listingId.hostId.phone}</span>
                </div>
              )}
              <div className="pt-4">
                <Button 
                  onClick={() => {
                    const email = booking.listingId?.hostId?.email;
                    const subject = encodeURIComponent(`Question concernant votre logement: ${booking.listingId?.title}`);
                    const body = encodeURIComponent(`Bonjour,\n\nJe vous contacte concernant ma réservation du ${new Date(booking.checkIn).toLocaleDateString('fr-FR')} au ${new Date(booking.checkOut).toLocaleDateString('fr-FR')} pour votre logement "${booking.listingId?.title}".\n\nPourriez-vous me renseigner sur...\n\nCordialement,\n${booking.userId?.firstName} ${booking.userId?.lastName}`);
                    
                    if (email) {
                      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                    } else {
                      console.error('Host email not available');
                      alert('Email de l\'hôte non disponible');
                    }
                  }}
                  className="w-full"
                >
                  Contacter l'hôte
                </Button>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Demandes spéciales</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm">{booking.specialRequests}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
