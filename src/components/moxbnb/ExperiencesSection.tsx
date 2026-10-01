'use client';

import { Clock, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import FeaturedSection, { reviewsCount }  from './FeaturedSection';

interface Experience {
  _id: string;
  title: string;
  category: string;
  host?: { name?: string };
  duration: string;
  maxGuests: number;
  price: number;
  rating: number;
  reviews: number | unknown[];
  images: string[];
}

export default function ExperiencesSection() {
  const { t } = useLanguage();

  return (
    <FeaturedSection<Experience>
      id="experiences"
      title={t('experiences.title')}
      subtitle={t('experiences.subtitle')}
      endpoint="/experiences"
      limit={4}
      cols={4}
      href="/experiences"
      seeAll="Voir toutes les expériences"
      emptyText="Aucune expérience disponible pour le moment"
      toCard={(e) => ({
        image: e.images?.[0] || '/api/placeholder/400/300',
        title: e.title,
        badge: e.category,
        subtitle: `Avec ${e.host?.name || 'un hôte local'}`,
        meta: [
          ...(e.duration ? [{ icon: Clock, text: e.duration }] : []),
          ...(e.maxGuests ? [{ icon: Users, text: `Max ${e.maxGuests}` }] : []),
        ],
        price: e.price,
        priceSuffix: '/ personne',
        rating: e.rating,
        reviews: reviewsCount(e.reviews),
      })}
    />
  );
}