'use client';

import { MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import FeaturedSection, { reviewsCount } from './FeaturedSection';

interface Property {
  _id: string;
  title: string;
  type: string;
  location: string;
  city: string;
  price: number;
  rating: number;
  reviews: number | unknown[];
  images: string[];
}

export default function PropertiesSection() {
  const { t } = useLanguage();

  return (
    <FeaturedSection<Property>
      id="properties"
      tone="tint"
      title={t('properties.title')}
      subtitle={t('properties.subtitle')}
      endpoint="/listings"
      limit={6}
      href="/properties"
      seeAll="Voir tous les logements"
      emptyText="Aucun logement disponible pour le moment"
      toCard={(p) => ({
        image: p.images?.[0] || '/api/placeholder/400/300',
        title: p.title,
        badge: p.type,
        meta: [{ icon: MapPin, text: p.location || p.city }],
        price: p.price,
        priceSuffix: '/ nuit',
        rating: p.rating,
        reviews: reviewsCount(p.reviews),
      })}
    />
  );
}