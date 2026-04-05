'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Trash2, Upload, MapPin, Clock, DollarSign, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const serviceCategories = [
  { value: 'photography', label: 'Photographie' },
  { value: 'cleaning', label: 'Nettoyage' },
  { value: 'catering', label: 'Traiteur' },
  { value: 'transport', label: 'Transport' },
  { value: 'beauty', label: 'Beauté' },
  { value: 'sport', label: 'Sport' },
  { value: 'wellness', label: 'Bien-être' },
  { value: 'photography', label: 'Photographie' },
  { value: 'cooking', label: 'Cuisine' },
  { value: 'adventure', label: 'Aventure' },
  { value: 'workshop', label: 'Atelier' },
];

export default function NewServicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    maxGuests: '',
    location: '',
    city: '',
    country: '',
    images: [],
    requirements: '',
    included: '',
    notIncluded: '',
    instantBook: false,
    status: 'active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to create service
    console.log('Creating service:', formData);
    // router.push('/provider/services');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // TODO: Handle image upload
    console.log('Uploading images:', files);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/provider/services">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 ml-4">Ajouter un Service</h1>
        </div>
        <p className="text-gray-600">Créez une nouvelle offre de service</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de Base</CardTitle>
            <CardDescription>Détails principaux de votre service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du service</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Séance Photo Professionnelle"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Décrivez votre service en détail..."
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Tag className="mr-2 h-5 w-5" />
              Détails du Service
            </CardTitle>
            <CardDescription>Prix, durée et capacités</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">
                  <DollarSign className="mr-1 h-4 w-4" />
                  Prix (TND)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="150"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">
                  <Clock className="mr-1 h-4 w-4" />
                  Durée
                </Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="2 heures"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxGuests">Nombre maximum de clients</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData({...formData, maxGuests: e.target.value})}
                  placeholder="10"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>
              <MapPin className="mr-2 h-5 w-5" />
              Localisation
            </CardTitle>
            <CardDescription>Où le service est disponible</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Lieu spécifique</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Studio Photo, Centre Ville"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Tunis"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                placeholder="Tunisie"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card>
          <CardHeader>
            <CardTitle>Ce qui est Inclus</CardTitle>
            <CardDescription>Détaillez ce que les clients recevront</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="included">Services Inclus</Label>
              <Textarea
                id="included"
                value={formData.included}
                onChange={(e) => setFormData({...formData, included: e.target.value})}
                placeholder="Ex: Appareil photo professionnel, 10 photos retouchées, livraison numérique..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notIncluded">Non Inclus</Label>
              <Textarea
                id="notIncluded"
                value={formData.notIncluded}
                onChange={(e) => setFormData({...formData, notIncluded: e.target.value})}
                placeholder="Ex: Déplacement, vêtements, maquillage..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Prérequis</CardTitle>
            <CardDescription>Conditions pour les clients</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              placeholder="Ex: Âge minimum 18 ans, pièce d'identité requise..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Upload className="mr-2 h-5 w-5" />
              Photos
            </CardTitle>
            <CardDescription>Ajoutez des photos de votre service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600">
                  Cliquez pour télécharger des images
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG jusqu'à 10MB chaque
                </p>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link href="/provider/services">
            <Button variant="outline">
              Annuler
            </Button>
          </Link>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            Créer le Service
          </Button>
        </div>
      </form>
    </div>
  );
}
