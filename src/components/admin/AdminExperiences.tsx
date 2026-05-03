'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Search, Filter, MapPin, Calendar, Users, Star } from 'lucide-react';
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
import { getAllExperiences, approveExperience, rejectExperience } from '@/services/adminService';
import { getStatusBadgeClass, getStatusBadgeText, formatDate } from '@/services/adminService';

export default function AdminExperiences() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperience, setSelectedExperience] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await getAllExperiences();
        
        // Handle different response structures
        let experiencesData = [];
        if (response?.data) {
          experiencesData = Array.isArray(response.data) ? response.data : response.data.data || [];
        } else if (response?.success === false) {
          // API returned error but with proper structure
          experiencesData = [];
        } else {
          // Fallback to empty array
          experiencesData = [];
        }
        
        setExperiences(experiencesData);
        
        // Calculate statistics from experiences data
        const stats = {
          pending: experiencesData.filter((e: any) => e.status === 'pending').length,
          approved: experiencesData.filter((e: any) => e.status === 'approved').length,
          rejected: experiencesData.filter((e: any) => e.status === 'rejected').length,
          total: experiencesData.length
        };
        setStatistics(stats);
        
        // Only set error if it's a real API error, not just empty data
        if (response?.success === false && response?.error) {
          setError(response.error);
        }
      } catch (err: any) {
        console.error('Error fetching experiences:', err);
        // Don't show error for network issues, just use empty data
        setExperiences([]);
        setStatistics({
          pending: 0,
          approved: 0,
          rejected: 0,
          total: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const filteredExperiences = experiences.filter(experience => {
    const matchesFilter = selectedFilter === 'all' || experience.status === selectedFilter;
    const matchesSearch = experience.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.host?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewDetails = (experience: any) => {
    setSelectedExperience(experience);
    setShowDetails(true);
  };

  const handleApprove = async (id: string) => {
    try {
      await approveExperience(id);
      setExperiences(experiences.map(e => 
        e.id === id ? { ...e, status: 'approved' } : e
      ));
      setStatistics(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1
      }));
    } catch (err: any) {
      console.error('Error approving experience:', err);
      alert('Failed to approve experience');
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      alert('Veuillez fournir une raison pour le rejet');
      return;
    }

    try {
      await rejectExperience(id, rejectReason);
      setExperiences(experiences.map(e => 
        e.id === id ? { ...e, status: 'rejected', rejectionReason: rejectReason } : e
      ));
      setStatistics(prev => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1
      }));
      setShowRejectDialog(false);
      setRejectReason('');
      setSelectedExperience(null);
    } catch (err: any) {
      console.error('Error rejecting experience:', err);
      alert('Failed to reject experience');
    }
  };

  const openRejectDialog = (experience: any) => {
    setSelectedExperience(experience);
    setShowRejectDialog(true);
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
        <h1 className="text-3xl font-bold mb-2">Validation des Expériences</h1>
        <p className="text-muted-foreground">
          Consultez et validez les expériences proposées par les hôtes
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
                  placeholder="Rechercher par titre, hôte ou lieu..."
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
                  <SelectItem value="approved">Approuvées</SelectItem>
                  <SelectItem value="rejected">Rejetées</SelectItem>
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
                <p className="text-sm text-muted-foreground">Approuvées</p>
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
                <p className="text-sm text-muted-foreground">Rejetées</p>
                <p className="text-2xl font-bold text-red-600">{statistics.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total expériences</p>
                <p className="text-2xl font-bold text-purple-600">{statistics.total}</p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Experiences List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Expériences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExperiences.map((experience) => (
              <div key={experience.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusBadgeClass(experience.status)}>
                          {getStatusBadgeText(experience.status)}
                        </Badge>
                        {experience.category && (
                          <Badge variant="outline">{experience.category}</Badge>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{experience.title}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Hôte:</span> {experience.host}
                          </div>
                          <div>
                            <span className="font-medium">Lieu:</span> {experience.location}
                          </div>
                          <div>
                            <span className="font-medium">Durée:</span> {experience.duration}
                          </div>
                          <div>
                            <span className="font-medium">Capacité:</span> {experience.capacity} personnes
                          </div>
                          <div>
                            <span className="font-medium">Prix:</span> {experience.price} DT/personne
                          </div>
                          <div>
                            <span className="font-medium">Créée le:</span> {formatDate(experience.createdAt)}
                          </div>
                        </div>
                        {experience.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {experience.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(experience)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    {experience.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(experience.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accepter
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => openRejectDialog(experience)}
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

      {/* Experience Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'Expérience</DialogTitle>
            <DialogDescription>
              Informations complètes sur l'expérience
            </DialogDescription>
          </DialogHeader>
          {selectedExperience && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID Expérience</label>
                  <p className="font-medium">{selectedExperience.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statut</label>
                  <div className="mt-1">
                    <Badge className={getStatusBadgeClass(selectedExperience.status)}>
                      {getStatusBadgeText(selectedExperience.status)}
                    </Badge>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Titre</label>
                  <p className="font-medium">{selectedExperience.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hôte</label>
                  <p className="font-medium">{selectedExperience.host}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Lieu</label>
                  <p className="font-medium">{selectedExperience.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Durée</label>
                  <p className="font-medium">{selectedExperience.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Capacité</label>
                  <p className="font-medium">{selectedExperience.capacity} personnes</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prix</label>
                  <p className="font-medium">{selectedExperience.price} DT/personne</p>
                </div>
                {selectedExperience.description && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="font-medium mt-1">{selectedExperience.description}</p>
                  </div>
                )}
                {selectedExperience.rejectionReason && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Raison du rejet</label>
                    <p className="font-medium mt-1 text-red-600">{selectedExperience.rejectionReason}</p>
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
            <DialogTitle>Rejeter l'Expérience</DialogTitle>
            <DialogDescription>
              Veuillez fournir une raison pour le rejet de cette expérience
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Raison du rejet</label>
              <textarea
                className="w-full mt-1 p-2 border rounded-md"
                rows={4}
                placeholder="Expliquez pourquoi cette expérience est rejetée..."
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
              onClick={() => selectedExperience && handleReject(selectedExperience.id)}
            >
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
