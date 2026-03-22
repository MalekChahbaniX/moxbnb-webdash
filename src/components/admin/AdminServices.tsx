'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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

export default function AdminServices() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    location: '',
    city: '',
    price: '',
    duration: '',
    providerId: ''
  });

  const serviceTypes = [
    'privateChef',
    'massage',
    'sportsCoach',
    'photography',
    'hairdressing',
    'catering'
  ];

  const typeLabels: Record<string, string> = {
    privateChef: 'Chef privé',
    massage: 'Massages',
    sportsCoach: 'Coach sportif',
    photography: 'Photographie',
    hairdressing: 'Coiffure',
    catering: 'Traiteur'
  };

  const mockServices = [
    {
      id: 'SRV-001',
      title: 'Cuisine Traditionnelle à Domicile',
      type: 'privateChef',
      provider: 'Chef Fatma Mansouri',
      location: 'Tunis',
      city: 'Tunis',
      price: 500,
      duration: '4 heures',
      rating: 4.9,
      reviews: 78,
      isAvailable: true,
      createdAt: '2025-01-10'
    },
    {
      id: 'SRV-002',
      title: 'Soin Massage Relaxant',
      type: 'massage',
      provider: 'Spa Zen Hammamet',
      location: 'Hammamet',
      city: 'Nabeul',
      price: 200,
      duration: '1 heure',
      rating: 4.8,
      reviews: 156,
      isAvailable: true,
      createdAt: '2025-01-08'
    },
    {
      id: 'SRV-003',
      title: 'Coaching Sportif Personnalisé',
      type: 'sportsCoach',
      provider: 'Karim Ben Hassen',
      location: 'Sousse',
      city: 'Sousse',
      price: 150,
      duration: '1 heure',
      rating: 4.95,
      reviews: 203,
      isAvailable: true,
      createdAt: '2025-01-05'
    },
    {
      id: 'SRV-004',
      title: 'Séance Photo Voyage',
      type: 'photography',
      provider: 'Studio Photo Tunis',
      location: 'Tunis',
      city: 'Tunis',
      price: 350,
      duration: '2 heures',
      rating: 4.92,
      reviews: 89,
      isAvailable: true,
      createdAt: '2025-01-03'
    }
  ];

  const handleCreateService = () => {
    console.log('Creating service:', formData);
    // API call to create service
    setShowCreateDialog(false);
    setFormData({
      title: '',
      description: '',
      type: '',
      location: '',
      city: '',
      price: '',
      duration: '',
      providerId: ''
    });
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || '',
      type: service.type,
      location: service.location,
      city: service.city,
      price: service.price.toString(),
      duration: service.duration,
      providerId: ''
    });
    setShowCreateDialog(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      console.log('Deleting service:', serviceId);
      // API call to delete service
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Services</h1>
          <p className="text-muted-foreground">
            Créez et gérez les services professionnels sur Moxbnb
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-rose-600 hover:bg-rose-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Service
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher un service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {typeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{typeLabels[service.type]}</Badge>
                    {service.isAvailable ? (
                      <Badge className="bg-green-100 text-green-800">Disponible</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">Indisponible</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
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
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prestataire:</span>
                  <span className="font-medium">{service.provider}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Localisation:</span>
                  <span className="font-medium">{service.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Durée:</span>
                  <span className="font-medium">{service.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Note:</span>
                  <span className="font-medium">
                    ⭐ {service.rating} ({service.reviews} avis)
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2 mt-2">
                  <span className="text-muted-foreground">Prix:</span>
                  <span className="font-bold text-lg text-rose-600">{service.price} DT</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Service Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Modifier le Service' : 'Créer un Nouveau Service'}
            </DialogTitle>
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
                      <SelectItem key={type} value={type}>
                        {typeLabels[type]}
                      </SelectItem>
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
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setEditingService(null);
            }}>
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
