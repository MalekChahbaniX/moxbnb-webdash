'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Eye, Search, Filter, Home as HomeIcon, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Textarea } from '@/components/ui/textarea';
import { getPendingListings, getAllListings, approveListing, rejectListing, getStatusBadgeClass, getStatusBadgeText, formatDate } from '@/services/adminService';

export default function AdminListings() {
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    loadListings();
  }, [page, statusFilter]);

  const loadListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = statusFilter === 'pending' 
        ? await getPendingListings(page, 6)
        : await getAllListings({ status: statusFilter, page, limit: 6 });
      
      if (response.success) {
        setListings(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
        }
      } else {
        setError('Erreur lors du chargement des annonces');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (listingId: string) => {
    try {
      setApproving(listingId);
      const response = await approveListing(listingId);
      if (response.success) {
        setListings(listings.filter(l => l._id !== listingId));
        if (listings.length === 1 && page > 1) {
          setPage(page - 1);
        }
      }
    } catch (err) {
      setError('Erreur lors de l\'approbation');
    } finally {
      setApproving(null);
    }
  };

  const handleRejectClick = (listingId: string) => {
    setRejectingId(listingId);
    setRejectReason('');
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingId) return;
    try {
      setApproving(rejectingId);
      const response = await rejectListing(rejectingId, rejectReason);
      if (response.success) {
        setListings(listings.filter(l => l._id !== rejectingId));
        setShowRejectDialog(false);
        if (listings.length === 1 && page > 1) {
          setPage(page - 1);
        }
      }
    } catch (err) {
      setError('Erreur lors du rejet');
    } finally {
      setApproving(null);
    }
  };

  const handleViewDetails = (listing: any) => {
    setSelectedListing(listing);
    setShowDetails(true);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: 'Appartement',
      house: 'Maison',
      villa: 'Villa',
      privateRoom: 'Chambre privée',
      cabin: 'Cabane'
    };
    return labels[type] || type;
  };

  if (loading && listings.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Validation des Annonces</h1>
        <p className="text-muted-foreground">
          Consultez, validez ou rejetez les nouvelles annonces de logements
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvées</SelectItem>
                  <SelectItem value="rejected">Rejetées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {listings.map((listing) => (
            <Card key={listing._id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                {listing.images?.[0] && (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge className={getStatusBadgeClass(listing.status)}>
                    {getStatusBadgeText(listing.status)}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{listing.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Badge variant="outline">{getTypeLabel(listing.type)}</Badge>
                  <span>{listing.city}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Chambres:</span>{' '}
                      <span className="font-medium">{listing.bedrooms}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">SDB:</span>{' '}
                      <span className="font-medium">{listing.bathrooms}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max:</span>{' '}
                      <span className="font-medium">{listing.maxGuests} pers.</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-2xl font-bold text-rose-600">{listing.pricePerNight} DT</p>
                      <p className="text-xs text-muted-foreground">par nuit</p>
                    </div>

                    <div className="flex gap-2">
                      {listing.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(listing._id)}
                            disabled={approving === listing._id}
                          >
                            {approving === listing._id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectClick(listing._id)}
                            disabled={approving === listing._id}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeter
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(listing)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <p>Hôte: {listing.host?.name || 'N/A'}</p>
                    <p>Soumis le: {formatDate(listing.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">Aucune annonce en attente de validation</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination Controls */}
      {listings.length > 0 && totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page} sur {totalPages} • {listings.length} annonce{listings.length > 1 ? 's' : ''} affichée{listings.length > 1 ? 's' : ''}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Listing Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'Annonce</DialogTitle>
            <DialogDescription>
              Informations complètes sur l'annonce
            </DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              {selectedListing.images?.[0] && (
                <img
                  src={selectedListing.images[0]}
                  alt={selectedListing.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Titre</label>
                  <p className="font-medium">{selectedListing.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statut</label>
                  <div className="mt-1">
                    <Badge className={getStatusBadgeClass(selectedListing.status)}>
                      {getStatusBadgeText(selectedListing.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hôte</label>
                  <p className="font-medium">{selectedListing.host?.name || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">{selectedListing.host?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Localisation</label>
                  <p className="font-medium">{selectedListing.city}, {selectedListing.region}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm">{selectedListing.description}</p>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Chambres</label>
                  <p className="font-medium">{selectedListing.bedrooms}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Salles de bain</label>
                  <p className="font-medium">{selectedListing.bathrooms}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Max voyageurs</label>
                  <p className="font-medium">{selectedListing.maxGuests}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prix</label>
                  <p className="font-bold text-rose-600">{selectedListing.pricePerNight} DT/nuit</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Équipements</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedListing.amenities?.map((amenity: string, index: number) => (
                    <Badge key={index} variant="outline">{amenity}</Badge>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>Soumis le: {formatDate(selectedListing.createdAt)}</p>
                <p>ID: {selectedListing._id}</p>
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

      {/* Listing Details Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter l'Annonce</DialogTitle>
            <DialogDescription>
              Fournissez une raison pour le rejet
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Raison du rejet de l'annonce..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim() || approving === rejectingId}
            >
              {approving === rejectingId ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
