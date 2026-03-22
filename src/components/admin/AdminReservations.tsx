'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminReservations() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const mockReservations = [
    {
      id: 'RES-001',
      type: 'property',
      itemTitle: 'Villa avec Piscine à Hammamet',
      user: 'Mohamed Ben Ali',
      userEmail: 'mohamed@email.com',
      checkIn: '2025-01-15',
      checkOut: '2025-01-20',
      guests: 4,
      totalPrice: '3,750 DT',
      status: 'pending',
      createdAt: '2025-01-10 14:30'
    },
    {
      id: 'RES-002',
      type: 'experience',
      itemTitle: 'Dégustation de Cuisine Traditionnelle',
      user: 'Fatma Trabelsi',
      userEmail: 'fatma@email.com',
      date: '2025-01-18',
      guests: 2,
      totalPrice: '300 DT',
      status: 'pending',
      createdAt: '2025-01-11 09:15'
    },
    {
      id: 'RES-003',
      type: 'service',
      itemTitle: 'Soin Massage Relaxant',
      user: 'Karim Mejri',
      userEmail: 'karim@email.com',
      date: '2025-01-12',
      guests: 1,
      totalPrice: '200 DT',
      status: 'confirmed',
      createdAt: '2025-01-11 16:45'
    },
    {
      id: 'RES-004',
      type: 'property',
      itemTitle: 'Appartement Sidi Bou Said',
      user: 'Samira Gharbi',
      userEmail: 'samira@email.com',
      checkIn: '2025-01-22',
      checkOut: '2025-01-25',
      guests: 2,
      totalPrice: '1,050 DT',
      status: 'pending',
      createdAt: '2025-01-12 11:20'
    },
    {
      id: 'RES-005',
      type: 'service',
      itemTitle: 'Cuisine Traditionnelle à Domicile',
      user: 'Omar Jlassi',
      userEmail: 'omar@email.com',
      date: '2025-01-14',
      guests: 6,
      totalPrice: '3,000 DT',
      status: 'confirmed',
      createdAt: '2025-01-10 13:00'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Terminée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'property':
        return <Badge variant="outline">Logement</Badge>;
      case 'experience':
        return <Badge variant="outline">Expérience</Badge>;
      case 'service':
        return <Badge variant="outline">Service</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const handleAccept = (reservationId: string) => {
    console.log('Accepting reservation:', reservationId);
    // API call to accept reservation
  };

  const handleReject = (reservationId: string) => {
    console.log('Rejecting reservation:', reservationId);
    // API call to reject reservation
  };

  const handleViewDetails = (reservation: any) => {
    setSelectedReservation(reservation);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestion des Réservations</h1>
        <p className="text-muted-foreground">
          Consultez et validez les réservations de logements, expériences et services
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par utilisateur, email ou titre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                  <SelectItem value="completed">Terminées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">12</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmées</p>
                <p className="text-2xl font-bold text-green-600">856</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Annulées</p>
                <p className="text-2xl font-bold text-red-600">24</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total revenus</p>
                <p className="text-2xl font-bold text-purple-600">245.6K DT</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservations List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Réservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReservations.map((reservation) => (
              <div key={reservation.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-2">
                        {getTypeBadge(reservation.type)}
                        {getStatusBadge(reservation.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{reservation.itemTitle}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Client:</span> {reservation.user}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {reservation.userEmail}
                          </div>
                          <div>
                            <span className="font-medium">Réservation:</span> {reservation.id}
                          </div>
                          <div>
                            <span className="font-medium">Voyageurs:</span> {reservation.guests}
                          </div>
                          {reservation.checkIn && (
                            <div>
                              <span className="font-medium">Arrivée:</span> {reservation.checkIn}
                            </div>
                          )}
                          {reservation.checkOut && (
                            <div>
                              <span className="font-medium">Départ:</span> {reservation.checkOut}
                            </div>
                          )}
                          {reservation.date && !reservation.checkIn && (
                            <div>
                              <span className="font-medium">Date:</span> {reservation.date}
                            </div>
                          )}
                          <div className="col-span-2">
                            <span className="font-medium">Total:</span> {reservation.totalPrice}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(reservation)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    {reservation.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAccept(reservation.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accepter
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(reservation.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Refuser
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reservation Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la Réservation</DialogTitle>
            <DialogDescription>
              Informations complètes sur la réservation
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID Réservation</label>
                  <p className="font-medium">{selectedReservation.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statut</label>
                  <div className="mt-1">{getStatusBadge(selectedReservation.status)}</div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Titre</label>
                  <p className="font-medium">{selectedReservation.itemTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Client</label>
                  <p className="font-medium">{selectedReservation.user}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-medium">{selectedReservation.userEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Voyageurs</label>
                  <p className="font-medium">{selectedReservation.guests}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total</label>
                  <p className="font-medium">{selectedReservation.totalPrice}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
