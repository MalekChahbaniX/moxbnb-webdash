'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Minus, Plus, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import TunisSkyline from './TunisSkyline';

const DEFAULT_GUESTS = 2;
const MAX_GUESTS = 16;

/** Local YYYY-MM-DD (toISOString would give the UTC day). */
const localISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export default function Hero() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const L = (en: string, fr: string, ar: string) =>
    language === 'en' ? en : language === 'fr' ? fr : ar;

  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(DEFAULT_GUESTS);

  // set after mount so server and client markup match
  const [today, setToday] = useState('');
  useEffect(() => setToday(localISO()), []);

  const handleCheckIn = (value: string) => {
    setCheckIn(value);
    // a departure on or before the arrival makes no sense
    if (checkOut && value && checkOut <= value) setCheckOut('');
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (destination.trim()) params.append('location', destination.trim());
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests !== DEFAULT_GUESTS) params.append('guests', String(guests));

    const queryString = params.toString();
    router.push(`/properties${queryString ? '?' + queryString : ''}`);
  };

  const segment =
    'flex items-center gap-3 rounded-full px-5 py-3 transition-colors hover:bg-slate-50 focus-within:bg-slate-50';
  const labelCls = 'block text-xs font-medium text-slate-500';
  const inputCls =
    'w-full bg-transparent text-sm font-medium text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:outline-none';
  const divider = <span className="my-3 hidden w-px bg-slate-200 md:block" aria-hidden />;

  return (
    <section className="relative isolate flex min-h-[560px] items-center overflow-hidden">
      {/* illustrated skyline (unchanged), deep-blue wash to match the rest of the site */}
      <div className="absolute inset-0 -z-10">
        <TunisSkyline />
      </div>
      <div className="absolute inset-0 -z-10 bg-sky-950/60" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
          Tunisie · Méditerranée · Culture
        </p>

        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-white drop-shadow-lg md:text-6xl">
          {t('hero.title')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/90 drop-shadow md:text-xl">
          {t('hero.subtitle')}
        </p>

        <form
          onSubmit={handleSearch}
          role="search"
          className="mt-10 flex flex-col gap-1 rounded-3xl bg-white p-2 shadow-2xl md:flex-row md:items-stretch md:rounded-full"
        >
          <label className={`${segment} md:flex-[1.5]`}>
            <MapPin className="h-5 w-5 flex-shrink-0 text-rose-600" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className={labelCls}>{L('Where', 'Destination', 'الوجهة')}</span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className={inputCls}
                autoComplete="off"
              />
            </span>
          </label>

          {divider}

          <label className={`${segment} md:flex-1`}>
            <span className="min-w-0 flex-1">
              <span className={labelCls}>{t('common.checkIn')}</span>
              <input
                type="date"
                value={checkIn}
                min={today || undefined}
                onChange={(e) => handleCheckIn(e.target.value)}
                className={inputCls}
              />
            </span>
          </label>

          {divider}

          <label className={`${segment} md:flex-1`}>
            <span className="min-w-0 flex-1">
              <span className={labelCls}>{t('common.checkOut')}</span>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today || undefined}
                onChange={(e) => setCheckOut(e.target.value)}
                className={inputCls}
              />
            </span>
          </label>

          {divider}

          <div className={`${segment} md:flex-[0.9]`}>
            <Users className="h-5 w-5 flex-shrink-0 text-rose-600" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className={labelCls}>{L('Guests', 'Voyageurs', 'المسافرون')}</span>
              <span className="text-sm font-medium text-slate-900" aria-live="polite">
                {guests}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                disabled={guests <= 1}
                aria-label={L('Remove a guest', 'Retirer un voyageur', 'إزالة مسافر')}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 hover:bg-white disabled:opacity-30"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                disabled={guests >= MAX_GUESTS}
                aria-label={L('Add a guest', 'Ajouter un voyageur', 'إضافة مسافر')}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 hover:bg-white disabled:opacity-30"
              >
                <Plus className="h-4 w-4" />
              </button>
            </span>
          </div>

          <button
            type="submit"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-rose-600 px-8 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 md:h-auto"
          >
            <Search className="h-5 w-5" aria-hidden />
            {L('Search', 'Rechercher', 'بحث')}
          </button>
        </form>
      </div>
    </section>
  );
}