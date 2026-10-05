'use client';

import Link from 'next/link';
import { Home, Wallet, CalendarCheck, Headset } from 'lucide-react';

const benefits = [
  { icon: Home, title: 'Logements', text: 'Appartements, maisons, villas' },
  { icon: Wallet, title: 'Revenus', text: "Gagnez de l'argent" },
  { icon: CalendarCheck, title: 'Calendrier', text: 'Gérez vos disponibilités' },
  { icon: Headset, title: 'Support', text: 'Assistance 24/7' },
];

export default function HostCTASection() {
  return (
    <section className="bg-white px-4 pb-16 md:pb-20">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-sky-900 text-white">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              Devenez hôte sur Moxbnb
            </h2>
            <p className="mt-4 max-w-[50ch] text-sky-100">
              Gagnez un revenu supplémentaire en proposant votre logement, vos expériences ou vos
              services professionnels sur notre plateforme.
            </p>

            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {benefits.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-medium">{title}</span>
                    <span className="block text-sm text-sky-100/80">{text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup/host"
              className="mt-10 inline-flex h-12 items-center rounded-full bg-rose-600 px-8 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-900"
            >
              Commencer à accueillir
            </Link>
          </div>

          <div className="relative hidden min-h-[380px] lg:block">
            <img
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&h=800&fit=crop"
              alt="Un logement accueillant, prêt pour des voyageurs"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}