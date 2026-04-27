'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, AlertCircle, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  getPendingServices,
  getAllServices,
  approveService,
  rejectService,
  getStatusBadgeClass,
  getStatusBadgeText,
  formatDate,
} from '@/services/adminService';

const serviceTypes = ['privateChef', 'massage', 'sportsCoach', 'photography', 'hairdressing', 'catering'];

const typeLabels: Record<string, string> = {
  privateChef: 'Chef privé',
  massage: 'Massages',
  sportsCoach: 'Coach sportif',
  photography: 'Photographie',
  hairdressing: 'Coiffure',
  catering: 'Traiteur',
};

const defaultFormData = {
  title: '',
  description: '',
  type: '',
  location: '',
  city: '',
  price: '',
  duration: '',
  providerId: '',
};

export default function AdminServices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [approving, setApproving] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    loadServices();
  }, [page, statusFilter]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response =
        statusFilter === 'pending'
          ? await getPendingServices(page, 6)
          : await getAllServices({ status: statusFilter, page, limit: 6 });

      if (response.success) {
        setServices(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
        }
      } else {
        setError('Erreur lors du chargement des services');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (serviceId: string) => {
    try {
      setApproving(serviceId);
      const response = await approveService(serviceId);
      if (response.success) {
        setServices(services.filter(s => s._id !== serviceId));
        if (services.length === 1 && page > 1) setPage(page - 1);
      }
    } catch (err) {
      setError("Erreur lors de l'approbation");
    } finally {
      setApproving(null);
    }
  };

  const handleRejectClick = (serviceId: string) => {
    setRejectingId(serviceId);
    setRejectReason('');
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingId) return;
    try {
      setApproving(rejectingId);
      const response = await rejectService(rejectingId, rejectReason);
      if (response.success) {
        setServices(services.filter(s => s._id !== rejectingId));
        setShowRejectDialog(false);
        if (services.length === 1 && page > 1) setPage(page - 1);
      }
    } catch (err) {
      setError('Erreur lors du rejet');
    } finally {
      setApproving(null);
    }
  };

  const handleViewDetails = (service: any) => {
    setSelectedService(service);
    setShowDetails(true);
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || '',
      type: service.type || service.serviceType || '',
      location: service.location,
      city: service.city || '',
      price: service.price?.toString() || '',
      duration: service.duration,
      providerId: '',
    });
    setShowCreateDialog(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      console.log('Deleting service:', serviceId);
      // TODO: API call to delete service
    }
  };

  const handleCreateService = () => {
    console.log(editingService ? 'Updating service:' : 'Creating service:', formData);
    // TODO: API call to create/update service
    setShowCreateDialog(false);
    setEditingService(null);
    setFormData(defaultFormData);
  };

  const filteredServices = services.filter(s =>
    s.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && services.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Validation des Services</h1>
          <p className="text-muted-foreground">
            Consultez, validez ou rejetez les nouveaux services
          </p>
        </div>
        <Button onClick={() => { setEditingService(null); setFormData(defaultFormData); setShowCreateDialog(true); }} className="bg-rose-600 hover:bg-rose-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Service
        </Button>
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvés</SelectItem>
                  <SelectItem value="rejected">Rejetés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <Card key={service._id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                {service.image && (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge className={getStatusBadgeClass(service.status)}>
                    {getStatusBadgeText(service.status)}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Badge variant="outline">{service.serviceType}</Badge>
                  <span>{service.location}</span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-2xl font-bold text-rose-600">{service.price} DT</p>
                      <p className="text-xs text-muted-foreground">{service.duration}</p>
                    </div>

                    <div className="flex gap-2 flex-wrap justify-end">
                      {service.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(service._id)}
                            disabled={approving === service._id}
                          >
                            {approving === service._id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectClick(service._id)}
                            disabled={approving === service._id}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeter
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(service)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(service._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <p>Prestataire: {service.provider?.name || 'N/A'}</p>
                    <p>Soumis le: {formatDate(service.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">Aucun service trouvé</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {services.length > 0 && totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page} sur {totalPages} &bull; {services.length} service{services.length > 1 ? 's' : ''}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Précédent
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                  Suivant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du Service</DialogTitle>
            <DialogDescription>Informations complètes sur le service</DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              {selectedService.image && (
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Titre</label>
                  <p className="font-medium">{selectedService.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statut</label>
                  <div className="mt-1">
                    <Badge className={getStatusBadgeClass(selectedService.status)}>
                      {getStatusBadgeText(selectedService.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prestataire</label>
                  <p className="font-medium">{selectedService.provider?.name || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">{selectedService.provider?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Localisation</label>
                  <p className="font-medium">{selectedService.location}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm">{selectedService.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type de Service</label>
                  <p className="font-medium">{selectedService.serviceType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Durée</label>
                  <p className="font-medium">{selectedService.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prix</label>
                  <p className="font-bold text-rose-600">{selectedService.price} DT</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>Soumis le: {formatDate(selectedService.createdAt)}</p>
                <p>ID: {selectedService._id}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter le Service</DialogTitle>
            <DialogDescription>Fournissez une raison pour le rejet</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Raison du rejet du service..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Annuler</Button>
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

      {/* Create / Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => { setShowCreateDialog(open); if (!open) { setEditingService(null); setFormData(defaultFormData); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Modifier le Service' : 'Créer un Nouveau Service'}</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour {editingService ? 'modifier' : 'créer'} un service
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Titre du service *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Cuisine Traditionnelle à Domicile"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez le service en détail..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type de service *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>{typeLabels[type]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Prix (DT) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Tunis"
                />
              </div>
              <div>
                <Label htmlFor="duration">Durée *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="4 heures"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Adresse / Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Tunis, Tunisie"
              />
            </div>
            <div>
              <Label htmlFor="providerId">ID du Prestataire</Label>
              <Input
                id="providerId"
                value={formData.providerId}
                onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
                placeholder="ID utilisateur du prestataire"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateDialog(false); setEditingService(null); }}>
              Annuler
            </Button>
            <Button onClick={handleCreateService} className="bg-rose-600 hover:bg-rose-700">
              {editingService ? 'Modifier' : 'Créer'} le Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}