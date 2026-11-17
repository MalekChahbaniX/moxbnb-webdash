'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgePercent, CalendarClock, MapPin, Sparkles } from 'lucide-react';
import Header from '@/components/moxbnb/Header';
import Footer from '@/components/moxbnb/Footer';
import { api } from '@/lib/api';

type Promotion = {
  id: string;
  type: 'PROPERTY' | 'EXPERIENCE' | 'SERVICE';
  title: string;
  image?: string;
  price: number;
  currency: string;
  city?: string;
  promotionPercent: number;
  promotionEndDate: string;
};

const typeLabels: Record<Promotion['type'], string> = {
  PROPERTY: 'Hébergement',
  EXPERIENCE: 'Expérience',
  SERVICE: 'Service',
};

const detailPath = (promotion: Promotion) => {
  const paths = { PROPERTY: 'properties', EXPERIENCE: 'experiences', SERVICE: 'services' };
  return `/${paths[promotion.type]}/${promotion.id}`;
};

const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat('fr-TN', { style: 'currency', currency: currency || 'TND', maximumFractionDigits: 0 }).format(amount);

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/promotions/public')
      .then((response) => setPromotions(response.data?.data || []))
      .catch((loadError) => {
        console.error('Unable to load public promotions:', loadError);
        setError('Les offres promotionnelles ne peuvent pas être chargées pour le moment.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.34),transparent_48%),radial-gradient(ellipse_at_bottom_left,rgba(244,63,94,0.26),transparent_42%)]" />
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-sky-100">
                <Sparkles className="h-4 w-4" aria-hidden /> Les bons plans Moxbnb
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">Vos prochaines découvertes, à prix réduit.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Explorez des hébergements, des expériences et des services proposés en promotion par notre communauté.
              </p>
            </div>
            <div className="hidden rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur-sm lg:block">
              <BadgePercent className="h-14 w-14 text-rose-300" aria-hidden />
              <p className="mt-4 max-w-48 text-sm leading-6 text-slate-300">Les réductions sont appliquées aux tarifs admissibles pendant leur période de validité.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-sky-800">Sélection du moment</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Offres en cours</h2>
            </div>
            {!loading && !error && <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">{promotions.length} offre{promotions.length === 1 ? '' : 's'}</span>}
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-3xl bg-slate-200" />)}
            </div>
          ) : error ? (
            <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900">{error}</div>
          ) : promotions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <BadgePercent className="mx-auto h-10 w-10 text-slate-400" aria-hidden />
              <h3 className="mt-4 text-xl font-semibold text-slate-900">Aucune offre en cours</h3>
              <p className="mt-2 text-slate-600">Revenez bientôt pour découvrir les prochaines promotions.</p>
              <Link href="/properties" className="mt-6 inline-flex items-center gap-2 font-semibold text-sky-900 hover:underline">
                Explorer les hébergements<ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promotions.map((promotion) => {
                const reducedPrice = Math.round(promotion.price * (1 - promotion.promotionPercent / 100) * 100) / 100;
                return (
                  <article key={`${promotion.type}:${promotion.id}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <Link href={detailPath(promotion)} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-700">
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        {promotion.image ? <img src={promotion.image} alt={promotion.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-slate-400"><BadgePercent className="h-12 w-12" aria-hidden /></div>}
                        <span className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg">−{promotion.promotionPercent}%</span>
                        <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">{typeLabels[promotion.type]}</span>
                      </div>
                      <div className="p-5">
                        <h3 className="truncate text-lg font-bold text-slate-950">{promotion.title}</h3>
                        {promotion.city && <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="h-4 w-4" aria-hidden />{promotion.city}</p>}
                        <div className="mt-5 flex items-end justify-between gap-3">
                          <div>
                            <p className="text-sm text-slate-400 line-through">{formatPrice(promotion.price, promotion.currency)}</p>
                            <p className="text-xl font-bold text-sky-950">{formatPrice(reducedPrice, promotion.currency)}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-sky-900">Découvrir<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span>
                        </div>
                        <p className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                          <CalendarClock className="h-3.5 w-3.5" aria-hidden /> Offre jusqu’au {new Date(promotion.promotionEndDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
