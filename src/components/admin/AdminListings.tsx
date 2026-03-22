'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Search, Filter, Home as HomeIcon } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

export default function AdminListings() {
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const mockListings = [
    {
      id: 'LST-001',
      title: 'Villa Luxueuse avec Vue Mer - Sfax',
      type: 'villa',
      host: 'Moncef Gharbi',
      hostEmail: 'moncef@email.com',
      location: 'Sfax',
      city: 'Sfax',
      price: 1200,
      bedrooms: 5,
      bathrooms: 3,
      maxGuests: 10,
      description: 'Magnifique villa avec piscine privée et vue imprenable sur la mer.',
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'],
      amenities: ['Piscine', 'Vue mer', 'WiFi', 'Climatisation', 'Parking'],
      status: 'pending',
      submittedAt: '2025-01-12 10:30',
      reviewsCount: 0
    },
    {
      id: 'LST-002',
      title: 'Appartement Moderne Centre-Ville - Sousse',
      type: 'apartment',
      host: 'Leila Belaid',
      hostEmail: 'leila@email.com',
      location: 'Sousse',
      city: 'Sousse',
      price: 350,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      description: 'Appartement entièrement rénové au cœur de Sousse, proche de la plage.',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
      amenities: ['WiFi', 'Climatisation', 'Cuisine équipée'],
      status: 'pending',
      submittedAt: '2025-01-11 14:15',
      reviewsCount: 0
    },
    {
      id: 'LST-003',
      title: 'Maison Traditionnelle - Tataouine',
      type: 'house',
      host: 'Khaled Tlili',
      hostEmail: 'khaled@email.com',
      location: 'Tataouine',
      city: 'Tataouine',
      price: 280,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      description: 'Authentique maison troglodyte rénovée avec tout le confort moderne.',
      images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
      amenities: ['Patio', 'WiFi', 'Climatisation', 'Cuisine traditionnelle'],
      status: 'pending',
      submittedAt: '2025-01-10 09:45',
      reviewsCount: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejetée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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

  const handleApprove = (listingId: string) => {
    console.log('Approving listing:', listingId);
    // API call to approve listing
  };

  const handleReject = (listingId: string) => {
    if (confirm('Êtes-vous sûr de vouloir rejeter cette annonce ?')) {
      console.log('Rejecting listing:', listingId);
      // API call to reject listing
    }
  };

  const handleViewDetails = (listing: any) => {
    setSelectedListing(listing);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Validation des Annonces</h1>
        <p className="text-muted-foreground">
          Consultez, validez ou rejetez les nouvelles annonces de logements
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre, hôte ou ville..."
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
                  <SelectItem value="all">Toutes les annonces</SelectItem>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">12</p>
              </div>
              <HomeIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approuvées</p>
                <p className="text-2xl font-bold text-green-600">1,234</p>
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
                <p className="text-2xl font-bold text-red-600">45</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockListings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <div className="relative h-48 bg-gray-200">
              {listing.images[0] && (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 left-2 flex gap-2">
                {getStatusBadge(listing.status)}
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-lg">{listing.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Badge variant="outline">{getTypeLabel(listing.type)}</Badge>
                <span>{listing.location}</span>
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
                    <p className="text-2xl font-bold text-rose-600">{listing.price} DT</p>
                    <p className="text-xs text-muted-foreground">par nuit</p>
                  </div>

                  <div className="flex gap-2">
                    {listing.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(listing.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(listing.id)}
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
                  <p>Hôte: {listing.host}</p>
                  <p>Soumis le: {listing.submittedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              {selectedListing.images[0] && (
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
                  <div className="mt-1">{getStatusBadge(selectedListing.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hôte</label>
                  <p className="font-medium">{selectedListing.host}</p>
                  <p className="text-sm text-muted-foreground">{selectedListing.hostEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Localisation</label>
                  <p className="font-medium">{selectedListing.location}, {selectedListing.city}</p>
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
                  <p className="font-bold text-rose-600">{selectedListing.price} DT/nuit</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Équipements</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedListing.amenities.map((amenity: string, index: number) => (
                    <Badge key={index} variant="outline">{amenity}</Badge>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>Soumis le: {selectedListing.submittedAt}</p>
                <p>ID: {selectedListing.id}</p>
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
