'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wrench, MapPin, Clock, Users, Star, Plus, X, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import LocationPicker from '@/components/moxbnb/LocationPicker';

const experienceCategories = [
  { value: 'adventure', label: 'Aventure' },
  { value: 'cultural', label: 'Culturel' },
  { value: 'water-sports', label: 'Sports nautiques' },
  { value: 'desert', label: 'Désert' },
  { value: 'gastronomy', label: 'Gastronomie' },
  { value: 'nature', label: 'Nature' },
  { value: 'wellness', label: 'Bien-être' },
  { value: 'photography', label: 'Photographie' },
  { value: 'crafts', label: 'Artisanat' },
  { value: 'music', label: 'Musique' },
];

const difficultyLevels = [
  { value: 'BEGINNER', label: 'Débutant' },
  { value: 'INTERMEDIATE', label: 'Intermédiaire' },
  { value: 'ADVANCED', label: 'Avancé' },
  { value: 'EXPERT', label: 'Expert' },
];

export default function NewExperiencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    currency: 'TND',
    duration: '',
    maxGuests: '',
    location: '', // Will be synced with address
    address: '',
    city: '',
    country: 'Tunisie',
    latitude: 33.820627,
    longitude: 11.04222,
    images: [] as string[],
    includes: [] as string[],
    requirements: [] as string[],
    difficulty: 'BEGINNER',
    status: 'DRAFT',
  });

  const [newInclude, setNewInclude] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }) => {
    setFormData(prev => ({
      ...prev,
      location: location.address, // Use address as location
      address: location.address,
      city: location.city,
      country: location.country,
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng
    }));
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, newInclude.trim()]
      }));
      setNewInclude('');
    }
  };

  const removeInclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('Files selected:', files);
    console.log('Files length:', files?.length);
    
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      Array.from(files).forEach((file, index) => {
        console.log(`Appending file ${index}:`, file.name, file.size);
        uploadFormData.append('images', file);
      });

      console.log('Uploading to /upload/multiple...');
      const response = await api.post('/upload/multiple', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);
      const uploadedUrls = response.data?.data?.map((item: any) => 
        typeof item === 'string' ? item : item?.url || item?.filename || String(item)
      ) || [];
      console.log('Uploaded URLs:', uploadedUrls);
      
      setFormData(prev => {
        const newImages = [...prev.images, ...uploadedUrls];
        console.log('New images array:', newImages);
        return {
          ...prev,
          images: newImages
        };
      });
    } catch (error: any) {
      console.error('Error uploading images:', error);
      console.error('Error response:', error.response?.data);
      alert(`Erreur lors du téléchargement des images: ${error.response?.data?.error || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        maxGuests: Number(formData.maxGuests),
        location: formData.address || formData.location, // Ensure location is set
        status: 'PUBLISHED'
      };

      const response = await api.post('/experiences', payload);
      
      if (response.data?.success) {
        router.push('/provider/experiences');
      } else {
        throw new Error('Failed to create experience');
      }
    } catch (error: any) {
      console.error('Error creating experience:', error);
      alert(error.response?.data?.error || 'Erreur lors de la création de l\'expérience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/provider/experiences">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouvelle Expérience</h1>
            <p className="text-gray-600">Créez une expérience unique pour vos clients</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
            <CardDescription>Détails principaux de votre expérience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Tour en quad dans le désert"
                  required
                  maxLength={200}
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez votre expérience en détail..."
                rows={4}
                required
                maxLength={2000}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="price">Prix (TND) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="150"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Durée (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="120"
                  min="15"
                  max="480"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxGuests">Nombre max de participants *</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  value={formData.maxGuests}
                  onChange={(e) => handleInputChange('maxGuests', e.target.value)}
                  placeholder="8"
                  min="1"
                  max="100"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="difficulty">Niveau de difficulté *</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Localisation</CardTitle>
            <CardDescription>Où se déroule l'expérience?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LocationPicker
              onLocationSelect={handleLocationChange}
              initialLocation={{
                address: formData.address,
                city: formData.city,
                country: formData.country,
                coordinates: {
                  lat: formData.latitude,
                  lng: formData.longitude
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Includes & Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Inclus & Prérequis</CardTitle>
            <CardDescription>Ce qui est inclus et ce que les participants doivent savoir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Ce qui est inclus</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newInclude}
                  onChange={(e) => setNewInclude(e.target.value)}
                  placeholder="Ex: Équipement, guide, transport..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                />
                <Button type="button" onClick={addInclude} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.includes.map((item, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeInclude(index)}>
                    {item}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Prérequis</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Ex: Permis de conduire, bonne condition physique..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <Button type="button" onClick={addRequirement} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.requirements.map((item, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeRequirement(index)}>
                    {item}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Ajoutez des photos de votre expérience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="images">Télécharger des images</Label>
              <div className="mt-2">
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-600 mt-1">Téléchargement en cours...</p>}
              </div>
            </div>

            {formData.images.length > 0 && (
              <div>
                <Label>Images téléchargées</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="text-sm">
                <p><strong>Images count:</strong> {formData.images.length}</p>
                <p><strong>Images:</strong> {JSON.stringify(formData.images)}</p>
                <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                <p><strong>Button disabled:</strong> {(loading || formData.images.length === 0) ? 'Yes' : 'No'}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/provider/experiences">
            <Button variant="outline" type="button">
              Annuler
            </Button>
          </Link>
          <div className="flex flex-col items-end">
            {formData.images.length === 0 && !loading && (
              <p className="text-sm text-red-600 mb-2">Au moins une image est requise</p>
            )}
            <Button type="submit" disabled={loading || formData.images.length === 0}>
              {loading ? 'Création en cours...' : 'Créer l\'expérience'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
