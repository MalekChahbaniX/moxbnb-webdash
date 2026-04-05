'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Trash2, Upload, MapPin, Home, Bed, Bath, Square, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    category: 'entire_home',
    price: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    address: '',
    city: '',
    country: '',
    amenities: [],
    images: [],
    rules: '',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    instantBook: false,
    status: 'active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to create listing
    console.log('Creating listing:', formData);
    // router.push('/host/listings');
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
          <Link href="/host/listings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 ml-4">Ajouter une Propriété</h1>
        </div>
        <p className="text-gray-600">Remplissez les informations de votre nouvelle propriété</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de Base</CardTitle>
            <CardDescription>Détails principaux de votre propriété</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Villa de Luxe avec Piscine"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type de propriété</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Appartement</SelectItem>
                    <SelectItem value="house">Maison</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="room">Chambre</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
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
                placeholder="Décrivez votre propriété en détail..."
                rows={4}
                required
              />
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
            <CardDescription>Où se trouve votre propriété</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="123 Rue de la République"
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

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Home className="mr-2 h-5 w-5" />
              Détails de la Propriété
            </CardTitle>
            <CardDescription>Caractéristiques et capacités</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Prix par nuit (TND)</Label>
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
                <Label htmlFor="bedrooms">
                  <Bed className="mr-1 h-4 w-4" />
                  Chambres
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                  placeholder="3"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">
                  <Bath className="mr-1 h-4 w-4" />
                  Salles de bain
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                  placeholder="2"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxGuests">
                  <User className="mr-1 h-4 w-4" />
                  Nombre maximum de voyageurs
                </Label>
                <Input
                  id="maxGuests"
                  type="number"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData({...formData, maxGuests: e.target.value})}
                  placeholder="6"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Upload className="mr-2 h-5 w-5" />
              Photos
            </CardTitle>
            <CardDescription>Ajoutez des photos de votre propriété</CardDescription>
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

        {/* Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Règles de la Maison</CardTitle>
            <CardDescription>Règles importantes pour les voyageurs</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.rules}
              onChange={(e) => setFormData({...formData, rules: e.target.value})}
              placeholder="Ex: Pas de fêtes, Pas d'animaux, Check-in après 15h..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link href="/host/listings">
            <Button variant="outline">
              Annuler
            </Button>
          </Link>
          <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
            <Save className="mr-2 h-4 w-4" />
            Créer l'annonce
          </Button>
        </div>
      </form>
    </div>
  );
}
