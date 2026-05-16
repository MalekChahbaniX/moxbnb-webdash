'use client';

import { useState, useEffect } from 'react';
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
import { getAllReservations, getPendingReservations, updateReservationStatus } from '@/services/adminService';

export default function AdminReservations() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = selectedFilter === 'pending'
          ? await getPendingReservations()
          : await getAllReservations({ status: selectedFilter === 'all' ? undefined : selectedFilter });

        if (response.success) {
          const reservationsData = response.data || [];
          setReservations(reservationsData);

          const stats = {
            pending: reservationsData.filter((r: any) => r.status === 'PENDING').length,
            confirmed: reservationsData.filter((r: any) => r.status === 'CONFIRMED').length,
            cancelled: reservationsData.filter((r: any) => r.status === 'CANCELLED').length,
            totalRevenue: reservationsData
              .filter((r: any) => r.status === 'CONFIRMED')
              .reduce((sum: number, r: any) => sum + (parseFloat(r.totalPrice) || 0), 0)
          };
          setStatistics(stats);
        } else {
          throw new Error(response.error || 'Failed to load reservations');
        }
      } catch (err: any) {
        console.error('Error fetching reservations:', err);
        setError('Failed to load reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [selectedFilter]);

  const filteredReservations = reservations.filter(reservation => {
    const status = reservation.status?.toLowerCase();
    const matchesFilter = selectedFilter === 'all' || status === selectedFilter;
    const search = searchTerm.toLowerCase();
    const matchesSearch = reservation.user?.toLowerCase().includes(search) ||
                         reservation.userEmail?.toLowerCase().includes(search) ||
                         reservation.itemTitle?.toLowerCase().includes(search) ||
                         reservation.id?.toLowerCase().includes(search);
    return matchesFilter && matchesSearch;
  });

  const handleViewDetails = (reservation: any) => {
    setSelectedReservation(reservation);
    setShowDetails(true);
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await updateReservationStatus(id, 'CONFIRMED');
      if (response.success) {
        setReservations(reservations.map(r => r.id === id ? { ...r, status: 'CONFIRMED' } : r));
      }
    } catch (err) {
      console.error('Error approving reservation:', err);
      alert('Failed to approve reservation');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await updateReservationStatus(id, 'CANCELLED');
      if (response.success) {
        setReservations(reservations.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r));
      }
    } catch (err) {
      console.error('Error rejecting reservation:', err);
      alert('Failed to reject reservation');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'CONFIRMED':
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-blue-100 text-blue-800">Terminée</Badge>;
      case 'REFUNDED':
        return <Badge className="bg-indigo-100 text-indigo-800">Remboursée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'PROPERTY':
        return <Badge variant="outline">Logement</Badge>;
      case 'EXPERIENCE':
        return <Badge variant="outline">Expérience</Badge>;
      case 'SERVICE':
        return <Badge variant="outline">Service</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold text-yellow-600">{statistics.pending}</p>
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
                <p className="text-2xl font-bold text-green-600">{statistics.confirmed}</p>
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
                <p className="text-2xl font-bold text-red-600">{statistics.cancelled}</p>
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
                <p className="text-2xl font-bold text-purple-600">{statistics.totalRevenue.toLocaleString()} DT</p>
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
            {filteredReservations.map((reservation) => (
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
                    {reservation.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(reservation.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accepter
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReject(reservation.id)}
                          variant="destructive"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeter
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
