'use client';

import ServiceCard from './ServiceCard';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const mockServices = [
  {
    id: '1',
    title: 'Cuisine Traditionnelle à Domicile',
    provider: 'Chef Fatma Mansouri',
    type: 'Chef privé',
    location: 'Tunis',
    duration: '4 heures',
    price: 500,
    rating: 4.9,
    reviews: 78,
    available: true,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop'
  },
  {
    id: '2',
    title: 'Soin Massage Relaxant',
    provider: 'Spa Zen Hammamet',
    type: 'Massages',
    location: 'Hammamet',
    duration: '1 heure',
    price: 200,
    rating: 4.8,
    reviews: 156,
    available: true,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop'
  },
  {
    id: '3',
    title: 'Coaching Sportif Personnalisé',
    provider: 'Karim Ben Hassen',
    type: 'Coach sportif',
    location: 'Sousse',
    duration: '1 heure',
    price: 150,
    rating: 4.95,
    reviews: 203,
    available: true,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop'
  },
  {
    id: '4',
    title: 'Séance Photo Voyage',
    provider: 'Studio Photo Tunis',
    type: 'Photographie',
    location: 'Tunis',
    duration: '2 heures',
    price: 350,
    rating: 4.92,
    reviews: 89,
    available: true,
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=600&fit=crop'
  },
  {
    id: '5',
    title: 'Service de Traiteur pour Événements',
    provider: 'Catering El Gusto',
    type: 'Traiteur',
    location: 'Sfax',
    duration: 'Sur demande',
    price: 1500,
    rating: 4.85,
    reviews: 67,
    available: false,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop'
  },
  {
    id: '6',
    title: 'Coiffure et Maquillage Mariage',
    provider: 'Salon de Beauté Lilla',
    type: 'Coiffure',
    location: 'Djerba',
    duration: '3 heures',
    price: 600,
    rating: 4.88,
    reviews: 134,
    available: true,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop'
  }
];

export default function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('services.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockServices.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="text-rose-600 font-medium hover:underline">
            Voir tous les services →
          </Link>
        </div>
      </div>
    </section>
  );
}
