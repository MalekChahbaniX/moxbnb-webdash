'use client';

import { useState, useEffect } from 'react';
import ExperienceCard from './ExperienceCard';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';

interface Experience {
  _id: string;
  title: string;
  category: string;
  host: {
    name: string;
  };
  duration: string;
  maxGuests: number;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
}

export default function ExperiencesSection() {
  const { t } = useLanguage();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await api.get('/experiences');
        // Backend returns {success: true, data: [...]}
        const experiencesArray = response.data?.data || [];
        setExperiences(experiencesArray.slice(0, 4));
      } catch (err) {
        console.error('Error fetching experiences:', err);
        setError('Failed to load experiences');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const formatExperienceForCard = (experience: Experience) => ({
    id: experience._id,
    title: experience.title,
    category: experience.category,
    host: experience.host?.name || 'Hôte',
    duration: experience.duration,
    maxGuests: experience.maxGuests,
    price: experience.price,
    rating: experience.rating,
    reviews: experience.reviews,
    image: experience.images?.[0] || '/api/placeholder/400/300'
  });

  return (
    <section id="experiences" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('experiences.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('experiences.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            {error}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Aucune expérience disponible pour le moment
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {experiences.map((experience) => (
              <ExperienceCard key={experience._id} {...formatExperienceForCard(experience)} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/experiences" className="text-rose-600 font-medium hover:underline">
            Voir toutes les expériences →
          </Link>
        </div>
      </div>
    </section>
  );
}
