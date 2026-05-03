'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Edit, Trash2, Eye, Plus, Filter, Star, Users, Clock, Mountain } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

const experienceCategories = [
  { value: 'all', label: 'Toutes les catégories' },
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

const difficultyColors = {
  BEGINNER: 'bg-green-100 text-green-800',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
  ADVANCED: 'bg-orange-100 text-orange-800',
  EXPERT: 'bg-red-100 text-red-800',
};

const difficultyLabels = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
  EXPERT: 'Expert',
};

export default function ProviderExperiencesPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await api.get('/experiences/my');
        const experiencesData = response.data?.data || response.data;
        setExperiences(experiencesData);
        setFiltered(experiencesData);
      } catch (err: any) {
        console.error('Error fetching experiences:', err);
        setError(`Failed to load experiences: ${err.response?.data?.error || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  useEffect(() => {
    let filtered = experiences;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(experience =>
        experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        experience.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(experience => experience.category === categoryFilter);
    }

    setFiltered(filtered);
  }, [experiences, searchTerm, categoryFilter]);

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette expérience?')) {
      try {
        await api.delete(`/experiences/${id}`);
        setExperiences(experiences.filter(experience => experience._id !== id));
        setFiltered(filtered.filter(experience => experience._id !== id));
      } catch (err) {
        console.error('Error deleting experience:', err);
        alert('Failed to delete experience');
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/experiences/${id}`, { status: newStatus });
      setExperiences(experiences.map(experience =>
        experience._id === id ? { ...experience, status: newStatus } : experience
      ));
      setFiltered(filtered.map(experience =>
        experience._id === id ? { ...experience, status: newStatus } : experience
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Expériences</h1>
            <p className="text-gray-600">Gérez toutes vos offres d'expériences</p>
          </div>
          <Link href="/provider/experiences/new">
            <Button className="bg-rose-600 hover:bg-rose-700">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une Expérience
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre ou ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrer par catégorie" />
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
        </CardContent>
      </Card>

      {/* Experiences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((experience) => (
          <Card key={experience._id} className="overflow-hidden">
            {/* Image */}
            <div className="aspect-video bg-gray-200 relative">
              <img 
                src={experience.images?.[0] || '/api/placeholder/400/300'} 
                alt={experience.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge variant={experience.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                  {experience.status === 'PUBLISHED' ? 'Publiée' : 'Brouillon'}
                </Badge>
                <Badge className={difficultyColors[experience.difficulty] || 'bg-gray-100 text-gray-800'}>
                  {difficultyLabels[experience.difficulty] || experience.difficulty}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              {/* Title and Location */}
              <div className="mb-3">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{experience.title}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Mountain className="mr-1 h-4 w-4" />
                  <span className="capitalize">{experience.category}</span>
                  <span className="mx-2">•</span>
                  <span>{experience.city}, {experience.country}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{experience.duration} min</span>
                </div>
              </div>

              {/* Experience Details */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-1">💰</span>
                  <span>{experience.price} TND</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{experience.maxGuests} pers. max</span>
                </div>
              </div>

              {/* Includes preview */}
              {experience.includes && experience.includes.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Inclus:</p>
                  <div className="flex flex-wrap gap-1">
                    {experience.includes.slice(0, 2).map((item: string, index: number) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                    {experience.includes.length > 2 && (
                      <span className="text-xs text-gray-500">+{experience.includes.length - 2}+</span>
                    )}
                  </div>
                </div>
              )}

              {/* Description preview */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {experience.description?.substring(0, 100)}...
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Link href={`/provider/experiences/${experience._id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-1 h-4 w-4" />
                    Voir
                  </Button>
                </Link>
                <Link href={`/provider/experiences/${experience._id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-1 h-4 w-4" />
                    Modifier
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(experience._id)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Mountain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune expérience trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Commencez par ajouter votre première expérience'
              }
            </p>
            <Link href="/provider/experiences/new">
              <Button className="bg-rose-600 hover:bg-rose-700">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une Expérience
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
