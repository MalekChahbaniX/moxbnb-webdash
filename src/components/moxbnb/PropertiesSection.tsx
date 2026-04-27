'use client';

import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';

interface Property {
  _id: string;
  title: string;
  type: string;
  location: string;
  city: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
}

export default function PropertiesSection() {
  const { t } = useLanguage();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await api.get('/listings');
        // Backend returns {success: true, data: [...]}
        const propertiesArray = response.data?.data || [];
        setProperties(propertiesArray.slice(0, 6));
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const formatPropertyForCard = (property: Property) => ({
    id: property._id,
    title: property.title,
    type: property.type,
    location: property.location,
    price: property.price,
    rating: property.rating,
    reviews: property.reviews,
    image: property.images?.[0] || '/api/placeholder/400/300'
  });

  return (
    <section id="properties" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('properties.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('properties.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            {error}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Aucun logement disponible pour le moment
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} {...formatPropertyForCard(property)} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/properties" className="text-rose-600 font-medium hover:underline">
            Voir tous les logements →
          </Link>
        </div>
      </div>
    </section>
  );
}
