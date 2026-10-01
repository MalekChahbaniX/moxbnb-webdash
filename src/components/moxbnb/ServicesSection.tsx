'use client';

import { MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import FeaturedSection, { reviewsCount } from './FeaturedSection';

interface Service {
  _id: string;
  title: string;
  provider?: { name?: string };
  type: string;
  location: string;
  city: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number | unknown[];
  isAvailable: boolean;
  images: string[];
}

export default function ServicesSection() {
  const { t } = useLanguage();

  return (
    <FeaturedSection<Service>
      id="services"
      tone="tint"
      title={t('services.title')}
      subtitle={t('services.subtitle')}
      endpoint="/services"
      limit={6}
      href="/services"
      seeAll="Voir tous les services"
      emptyText="Aucun service disponible pour le moment"
      toCard={(s) => ({
        image: s.images?.[0] || '/api/placeholder/400/300',
        title: s.title,
        badge: s.type,
        subtitle: `Par ${s.provider?.name || 'un prestataire'}`,
        meta: [
          ...(s.location || s.city ? [{ icon: MapPin, text: s.location || s.city }] : []),
          ...(s.duration ? [{ icon: Clock, text: s.duration }] : []),
        ],
        price: s.price,
        priceSuffix: '/ prestation',
        rating: s.rating,
        reviews: reviewsCount(s.reviews),
        unavailable: !s.isAvailable,
      })}
    />
  );
}