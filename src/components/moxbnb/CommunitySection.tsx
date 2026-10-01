'use client';

import { Shield, Users, Star, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Communauté de confiance',
    description: 'Profils vérifiés et système de notation pour une expérience sécurisée',
  },
  {
    icon: Users,
    title: 'Connexions authentiques',
    description: 'Rencontrez des hôtes et voyageurs passionnés par la Tunisie',
  },
  {
    icon: Star,
    title: 'Avis transparents',
    description: 'Des avis authentiques pour vous aider à faire le bon choix',
  },
  {
    icon: MessageSquare,
    title: 'Communication directe',
    description: 'Échangez directement avec vos hôtes et prestataires',
  },
];

export default function CommunitySection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Une communauté basée sur la confiance
          </h2>
          <p className="mt-4 max-w-[45ch] text-slate-600">
            Moxbnb connecte des voyageurs et des hôtes dans toute la Tunisie.
          </p>
        </div>

        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="border-t border-slate-200 pt-5">
              <Icon className="h-6 w-6 text-sky-900" aria-hidden />
              <dt className="mt-3 font-semibold">{title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-slate-600">{description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}