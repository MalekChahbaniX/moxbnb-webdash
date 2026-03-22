'use client';

import ExperienceCard from './ExperienceCard';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const mockExperiences = [
  {
    id: '1',
    title: 'Dégustation de Cuisine Traditionnelle Tunisienne',
    category: 'Culinaire',
    host: 'Fatma Ben Ali',
    duration: '4 heures',
    maxGuests: 8,
    price: 150,
    rating: 4.9,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop'
  },
  {
    id: '2',
    title: 'Visite Guidée de la Médina de Tunis',
    category: 'Visites guidées',
    host: 'Ahmed Kaddour',
    duration: '3 heures',
    maxGuests: 10,
    price: 80,
    rating: 4.8,
    reviews: 512,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop'
  },
  {
    id: '3',
    title: 'Atelier de Poterie à Sejnane',
    category: 'Artistic',
    host: 'Leila Messaoudi',
    duration: '5 heures',
    maxGuests: 6,
    price: 200,
    rating: 4.95,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop'
  },
  {
    id: '4',
    title: 'Balade en Chameau dans le Sahara',
    category: 'Adventure',
    host: 'Omar Ben Salah',
    duration: '1 journée',
    maxGuests: 4,
    price: 350,
    rating: 4.97,
    reviews: 345,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop'
  }
];

export default function ExperiencesSection() {
  const { t } = useLanguage();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockExperiences.map((experience) => (
            <ExperienceCard key={experience.id} {...experience} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/experiences" className="text-rose-600 font-medium hover:underline">
            Voir toutes les expériences →
          </Link>
        </div>
      </div>
    </section>
  );
}
