'use client';

import { Shield, Users, Star, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CommunitySection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: 'Communauté de confiance',
      description: 'Profils vérifiés et système de notation pour une expérience sécurisée'
    },
    {
      icon: Users,
      title: 'Connexions authentiques',
      description: 'Rencontrez des hôtes et voyageurs passionnés par la Tunisie'
    },
    {
      icon: Star,
      title: 'Avis transparents',
      description: 'Des avis authentiques pour vous aider à faire le bon choix'
    },
    {
      icon: MessageSquare,
      title: 'Communication directe',
      description: 'Échangez directement avec vos hôtes et prestataires'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Une communauté basée sur la confiance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Moxbnb connecte des voyageurs et des hôtes dans toute la Tunisie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                  <feature.icon className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
