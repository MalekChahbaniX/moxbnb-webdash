'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Search, Filter, AlertTriangle, Star, Flag, User, MessageSquare } from 'lucide-react';
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
import { getFlaggedReviews, approveReview, rejectReview } from '@/services/adminService';
import { getStatusBadgeClass, getStatusBadgeText, formatDate } from '@/services/adminService';

export default function AdminReviews() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    flagged: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getFlaggedReviews();
        
        // Handle different response structures
        let reviewsData = [];
        if (response?.data) {
          reviewsData = Array.isArray(response.data) ? response.data : response.data.data || [];
        } else if (response?.success === false) {
          // API returned error but with proper structure
          reviewsData = [];
        } else {
          // Fallback to empty array
          reviewsData = [];
        }
        
        setReviews(reviewsData);
        
        // Calculate statistics from reviews data
        const stats = {
          flagged: reviewsData.filter((r: any) => r.isFlagged).length,
          approved: reviewsData.filter((r: any) => r.status === 'approved').length,
          rejected: reviewsData.filter((r: any) => r.status === 'rejected').length,
          pending: reviewsData.filter((r: any) => r.status === 'pending').length
        };
        setStatistics(stats);
        
        // Only set error if it's a real API error, not just empty data
        if (response?.success === false && response?.error) {
          setError(response.error);
        }
      } catch (err: any) {
        console.error('Error fetching reviews:', err);
        // Don't show error for network issues, just use empty data
        setReviews([]);
        setStatistics({
          flagged: 0,
          approved: 0,
          rejected: 0,
          pending: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = selectedFilter === 'all' || review.status === selectedFilter;
    const matchesSearch = review.reviewText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.itemTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewDetails = (review: any) => {
    setSelectedReview(review);
    setShowDetails(true);
  };

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id);
      setReviews(reviews.map(r => 
        r.id === id ? { ...r, status: 'approved', isFlagged: false } : r
      ));
      setStatistics(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
        flagged: prev.flagged - 1
      }));
    } catch (err: any) {
      console.error('Error approving review:', err);
      alert('Failed to approve review');
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      alert('Veuillez fournir une raison pour le rejet');
      return;
    }

    try {
      await rejectReview(id);
      setReviews(reviews.map(r => 
        r.id === id ? { ...r, status: 'rejected', isFlagged: false, rejectionReason: rejectReason } : r
      ));
      setStatistics(prev => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1,
        flagged: prev.flagged - 1
      }));
      setShowRejectDialog(false);
      setRejectReason('');
      setSelectedReview(null);
    } catch (err: any) {
      console.error('Error rejecting review:', err);
      alert('Failed to reject review');
    }
  };

  const openRejectDialog = (review: any) => {
    setSelectedReview(review);
    setShowRejectDialog(true);
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
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
        <h1 className="text-3xl font-bold mb-2">Modération des Avis</h1>
        <p className="text-muted-foreground">
          Consultez et modérez les avis signalés par les utilisateurs
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
                  placeholder="Rechercher par texte, utilisateur ou titre..."
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
                  <SelectItem value="all">Tous les avis</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvés</SelectItem>
                  <SelectItem value="rejected">Rejetés</SelectItem>
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
                <p className="text-sm text-muted-foreground">Signalés</p>
                <p className="text-2xl font-bold text-red-600">{statistics.flagged}</p>
              </div>
              <Flag className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{statistics.pending}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approuvés</p>
                <p className="text-2xl font-bold text-green-600">{statistics.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejetés</p>
                <p className="text-2xl font-bold text-gray-600">{statistics.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Avis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-2">
                        {review.isFlagged && (
                          <Badge className="bg-red-100 text-red-800">
                            <Flag className="h-3 w-3 mr-1" />
                            Signalé
                          </Badge>
                        )}
                        <Badge className={getStatusBadgeClass(review.status)}>
                          {getStatusBadgeText(review.status)}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{review.itemTitle}</h3>
                          <div className="flex items-center">
                            {getRatingStars(review.rating)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Auteur:</span> {review.reviewerName}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {formatDate(review.createdAt)}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {review.itemType}
                          </div>
                          {review.flagCount > 0 && (
                            <div>
                              <span className="font-medium">Signalements:</span> {review.flagCount}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {review.reviewText}
                        </p>
                        {review.flagReason && (
                          <p className="text-sm text-red-600 mt-1">
                            <strong>Raison du signalement:</strong> {review.flagReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(review)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    {review.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(review.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accepter
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => openRejectDialog(review)}
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

      {/* Review Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'Avis</DialogTitle>
            <DialogDescription>
              Informations complètes sur l'avis
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID Avis</label>
                  <p className="font-medium">{selectedReview.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statut</label>
                  <div className="mt-1">
                    <Badge className={getStatusBadgeClass(selectedReview.status)}>
                      {getStatusBadgeText(selectedReview.status)}
                    </Badge>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Élément évalué</label>
                  <p className="font-medium">{selectedReview.itemTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Auteur</label>
                  <p className="font-medium">{selectedReview.reviewerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="font-medium">{selectedReview.itemType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Note</label>
                  <div className="flex items-center mt-1">
                    {getRatingStars(selectedReview.rating)}
                    <span className="ml-2">({selectedReview.rating}/5)</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="font-medium">{formatDate(selectedReview.createdAt)}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Texte de l'avis</label>
                  <p className="font-medium mt-1">{selectedReview.reviewText}</p>
                </div>
                {selectedReview.isFlagged && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Signalé</label>
                      <p className="font-medium text-red-600">Oui</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nombre de signalements</label>
                      <p className="font-medium">{selectedReview.flagCount}</p>
                    </div>
                    {selectedReview.flagReason && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Raison du signalement</label>
                        <p className="font-medium mt-1 text-red-600">{selectedReview.flagReason}</p>
                      </div>
                    )}
                  </>
                )}
                {selectedReview.rejectionReason && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Raison du rejet</label>
                    <p className="font-medium mt-1 text-red-600">{selectedReview.rejectionReason}</p>
                  </div>
                )}
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

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter l'Avis</DialogTitle>
            <DialogDescription>
              Veuillez fournir une raison pour le rejet de cet avis
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Raison du rejet</label>
              <textarea
                className="w-full mt-1 p-2 border rounded-md"
                rows={4}
                placeholder="Expliquez pourquoi cet avis est rejeté..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedReview && handleReject(selectedReview.id)}
            >
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
