'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Trash2, Upload, MapPin, Home, Bed, Bath, X, Loader2, AlertCircle, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { uploadListingImages, createListing as createListingApi } from '@/services/hostService';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">Chargement de la carte...</div>
});

type FormData = {
  title: string;
  description: string;
  type: string;
  category: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  maxGuests: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  imageFiles: File[];
  imagePreviews: string[];
  rules: string;
  status: string;
};

type ErrorState = {
  field?: string;
  message: string;
};

export default function NewListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'APARTMENT',
    category: 'entire_home',
    price: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    address: '',
    city: '',
    country: 'Tunisia',
    latitude: undefined,
    longitude: undefined,
    amenities: [],
    imageFiles: [],
    imagePreviews: [],
    rules: '',
    status: 'DRAFT'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [amenityInput, setAmenityInput] = useState('');

  const validateForm = (): boolean => {
    if (!formData.title.trim() || formData.title.length < 10) {
      setError({ field: 'title', message: 'Title must be at least 10 characters' });
      return false;
    }
    if (!formData.description.trim() || formData.description.length < 50) {
      setError({ field: 'description', message: 'Description must be at least 50 characters' });
      return false;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError({ field: 'price', message: 'Price must be greater than 0' });
      return false;
    }
    if (!formData.maxGuests || Number(formData.maxGuests) < 1) {
      setError({ field: 'maxGuests', message: 'Must accommodate at least 1 guest' });
      return false;
    }
    if (!formData.address.trim()) {
      setError({ field: 'address', message: 'Address is required' });
      return false;
    }
    if (!formData.city.trim()) {
      setError({ field: 'city', message: 'City is required' });
      return false;
    }
    if (formData.imageFiles.length === 0) {
      setError({ message: 'At least one image is required' });
      return false;
    }
    return true;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.imageFiles.length > 5) {
      setError({ message: 'Maximum 5 images allowed' });
      return;
    }

    const previews = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files],
      imagePreviews: [...prev.imagePreviews, ...previews]
    }));
    setError(null);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: address.split(',')[0] || prev.address,
      city: address.split(',')[1]?.trim() || prev.city,
      country: address.split(',')[2]?.trim() || prev.country
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Step 1: Upload images
      const imageUrls = await uploadListingImages(formData.imageFiles);

      // Step 2: Create listing
      const listingData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        price: Number(formData.price),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        maxGuests: Number(formData.maxGuests),
        address: formData.address,
        city: formData.city,
        country: formData.country,
        latitude: formData.latitude,
        longitude: formData.longitude,
        images: imageUrls,
        amenities: formData.amenities,
        rules: formData.rules ? formData.rules.split('\n').filter(r => r.trim()) : [],
        status: formData.status
      };

      const result = await createListingApi(listingData);
      
      // Clear object URLs
      formData.imagePreviews.forEach(url => URL.revokeObjectURL(url));
      
      // Redirect to listings
      router.push('/host/listings');
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : 'Failed to create listing' });
    } finally {
      setLoading(false);
    }
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

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">{error.message}</p>
            {error.field && (
              <p className="text-red-700 text-sm">Please check the {error.field} field</p>
            )}
          </div>
        </div>
      )}

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
                  className={error?.field === 'title' ? 'border-red-500' : ''}
                  required
                />
                <p className="text-xs text-gray-500">{formData.title.length}/200 caractères (min 10)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type de propriété</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APARTMENT">Appartement</SelectItem>
                    <SelectItem value="HOUSE">Maison</SelectItem>
                    <SelectItem value="VILLA">Villa</SelectItem>
                    <SelectItem value="ROOM">Chambre</SelectItem>
                    <SelectItem value="STUDIO">Studio</SelectItem>
                    <SelectItem value="CABIN">Cabine</SelectItem>
                    <SelectItem value="LOFT">Loft</SelectItem>
                    <SelectItem value="CONDO">Condo</SelectItem>
                    <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
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
                className={error?.field === 'description' ? 'border-red-500' : ''}
                required
              />
              <p className="text-xs text-gray-500">{formData.description.length}/2000 caractères (min 50)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Ex: entire_home, private_room"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Localisation
            </CardTitle>
            <CardDescription>Sélectionnez l'emplacement de votre propriété sur la carte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LocationPicker 
              onLocationSelect={handleLocationSelect}
              initialPosition={formData.latitude && formData.longitude ? { lat: formData.latitude, lng: formData.longitude } : undefined}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="123 Rue de la République"
                  className={error?.field === 'address' ? 'border-red-500' : ''}
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
                  className={error?.field === 'city' ? 'border-red-500' : ''}
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
                placeholder="Tunisia"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
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
                  className={error?.field === 'price' ? 'border-red-500' : ''}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">
                  <Bed className="mr-1 h-4 w-4 inline" />
                  Chambres
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">
                  <Bath className="mr-1 h-4 w-4 inline" />
                  Salles de bain
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                  placeholder="2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxGuests">Max. voyageurs</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData({...formData, maxGuests: e.target.value})}
                  placeholder="6"
                  className={error?.field === 'maxGuests' ? 'border-red-500' : ''}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Équipements</CardTitle>
            <CardDescription>Sélectionnez les équipements disponibles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
                placeholder="Ex: WiFi, Climatisation, Piscine"
              />
              <Button type="button" onClick={addAmenity} variant="outline">
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, idx) => (
                <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => removeAmenity(idx)}>
                  {amenity}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Photos ({formData.imageFiles.length}/5)
            </CardTitle>
            <CardDescription>Ajoutez jusqu'à 5 photos de votre propriété</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Zone */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={formData.imageFiles.length >= 5}
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600">
                  Cliquez pour télécharger des images
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, WebP jusqu'à 10MB chaque • Max 5 images
                </p>
              </label>
            </div>

            {/* Image Previews */}
            {formData.imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error?.message?.includes('image') && (
              <p className="text-red-600 text-sm">{error.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Règles de la Maison</CardTitle>
            <CardDescription>Règles importantes pour les voyageurs (une par ligne)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.rules}
              onChange={(e) => setFormData({...formData, rules: e.target.value})}
              placeholder="Ex: Pas de fêtes&#10;Pas d'animaux&#10;Check-in après 15h&#10;Check-out avant 11h"
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Statut d'Publication</CardTitle>
            <CardDescription>Choisissez le statut initial de votre annonce</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Brouillon - Non publié</SelectItem>
                <SelectItem value="PUBLISHED">Publié - Visible aux clients</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-2">
              Vous pouvez modifier le statut ultérieurement depuis la page de gestion
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/host/listings">
            <Button variant="outline" disabled={loading}>
              Annuler
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-rose-600 hover:bg-rose-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Créer l'annonce
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
