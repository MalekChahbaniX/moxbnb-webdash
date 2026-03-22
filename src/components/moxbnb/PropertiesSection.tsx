'use client';

import PropertyCard from './PropertyCard';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const mockProperties = [
  {
    id: '1',
    title: 'Appartement de Charme à Sidi Bou Said',
    type: 'Appartement',
    location: 'Sidi Bou Said, Tunis',
    price: 350,
    rating: 4.9,
    reviews: 127,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
  },
  {
    id: '2',
    title: 'Villa avec Piscine à Hammamet',
    type: 'Villa',
    location: 'Hammamet, Nabeul',
    price: 750,
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'
  },
  {
    id: '3',
    title: 'Maison Traditionnelle Djerbienne',
    type: 'Maison',
    location: 'Djerba, Medenine',
    price: 280,
    rating: 4.95,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
  },
  {
    id: '4',
    title: 'Studio Vue Mer à Monastir',
    type: 'Chambre privée',
    location: 'Monastir, Monastir',
    price: 180,
    rating: 4.7,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
  },
  {
    id: '5',
    title: 'Cabane dans les Palmiers Tozeur',
    type: 'Cabane',
    location: 'Tozeur, Tozeur',
    price: 420,
    rating: 4.92,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop'
  },
  {
    id: '6',
    title: 'Pentasse Moderne Tunis Centre',
    type: 'Appartement',
    location: 'Tunis, Tunis',
    price: 450,
    rating: 4.85,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
  }
];

export default function PropertiesSection() {
  const { t } = useLanguage();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/properties" className="text-rose-600 font-medium hover:underline">
            Voir tous les logements →
          </Link>
        </div>
      </div>
    </section>
  );
}
