'use client';

import { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';

interface Service {
  _id: string;
  title: string;
  provider: {
    name: string;
  };
  type: string;
  location: string;
  city: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  isAvailable: boolean;
  images: string[];
}

export default function ServicesSection() {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await api.get('/services');
        // Backend returns {success: true, data: [...]}
        const servicesArray = response.data?.data || [];
        setServices(servicesArray.slice(0, 6));
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const formatServiceForCard = (service: Service) => ({
    id: service._id,
    title: service.title,
    provider: service.provider?.name || 'Prestataire',
    type: service.type,
    location: service.location,
    duration: service.duration,
    price: service.price,
    rating: service.rating,
    reviews: service.reviews,
    available: service.isAvailable,
    image: service.images?.[0] || '/api/placeholder/400/300'
  });

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
        ) : services.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Aucun service disponible pour le moment
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id} {...formatServiceForCard(service)} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/services" className="text-rose-600 font-medium hover:underline">
            Voir tous les services →
          </Link>
        </div>
      </div>
    </section>
  );
}
