'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addDays, format, startOfToday } from 'date-fns';
import { ar, enUS, fr } from 'date-fns/locale';
import {
  MapPin,
  Star,
  Clock,
  Users,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Minus,
  Plus,
  Grid2x2,
  BadgeCheck,
  ShieldCheck,
  MessageCircle,
  UtensilsCrossed,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ContactHostModal from '@/components/moxbnb/ContactHostModal';

const PLACEHOLDER = '/api/placeholder/800/600';
const DAYS_AHEAD = 14;
const MAX_PEOPLE = 4; // above this, the user is asked to contact the provider

const reviewsCount = (s: any): number =>
  Array.isArray(s?.reviews) ? s.reviews.length : Number(s?.reviews) || 0;

const serviceCategoryLabel = (type: string | undefined, t: (key: string) => string): string => {
  const typeKeys: Record<string, string> = {
    photography: 'services.photography',
    cleaning: 'services.cleaning',
    catering: 'services.catering',
    transport: 'services.transport',
    beauty: 'services.beauty',
    sport: 'services.sport',
    wellness: 'services.wellness',
    cooking: 'services.cooking',
    adventure: 'services.adventure',
    workshop: 'services.workshop',
    massage: 'services.massage',
    'private-chef': 'services.privateChef',
    'private chef': 'services.privateChef',
    'sports-coach': 'services.sportsCoach',
    'sports coach': 'services.sportsCoach',
    hairdressing: 'services.hairdressing',
  };
  const key = type ? type.trim().toLowerCase() : undefined;
  return key && typeKeys[key] ? t(typeKeys[key]) : type || '';
};

const periodLabel = (value: string, t: (key: string) => string): string => {
  const periodKeys: Record<string, string> = {
    matin: 'serviceDetail.morning',
    morning: 'serviceDetail.morning',
    am: 'serviceDetail.morning',
    'après-midi': 'serviceDetail.afternoon',
    'apres-midi': 'serviceDetail.afternoon',
    afternoon: 'serviceDetail.afternoon',
    pm: 'serviceDetail.afternoon',
  };
  const key = periodKeys[value.trim().toLowerCase()];
  return key ? t(key) : value;
};

export default function ServiceDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const dateLocale = language === 'ar' ? ar : language === 'en' ? enUS : fr;

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(addDays(startOfToday(), 1));
  const [period, setPeriod] = useState<string | null>(null);
  const [people, setPeople] = useState(2);
  const [menu, setMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/services/${params.id}`);
        setService(response.data?.data?.service || response.data?.data || response.data);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('serviceDetail.loadError');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [params.id]);

  const images: string[] = useMemo(
    () => (service?.images?.length ? service.images : [PLACEHOLDER]),
    [service]
  );
  const periods: string[] = useMemo(
    () => (service?.periods?.length ? service.periods : ['Matin', 'Après-midi']),
    [service]
  );
  const menuOptions: string[] = useMemo(() => service?.menuOptions || [], [service]);

  // sensible defaults once data is in
  useEffect(() => {
    if (!period && periods.length) setPeriod(periods[0]);
  }, [periods, period]);
  useEffect(() => {
    if (!menu && menuOptions.length) setMenu(menuOptions[0]);
  }, [menuOptions, menu]);

  const dates = useMemo(
    () => Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(startOfToday(), i + 1)),
    []
  );

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const stepLightbox = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') stepLightbox(1);
      if (e.key === 'ArrowLeft') stepLightbox(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, closeLightbox, stepLightbox]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 animate-pulse">
          <div className="h-8 w-1/2 rounded-lg bg-slate-100 mb-6" />
          <div className="h-[420px] rounded-3xl bg-slate-100 mb-8" />
          <div className="grid lg:grid-cols-[1fr_380px] gap-10">
            <div className="space-y-4">
              <div className="h-6 w-2/3 rounded bg-slate-100" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-5/6 rounded bg-slate-100" />
            </div>
            <div className="h-96 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-slate-900 font-medium mb-1">
            {error ? t(error) : t('serviceDetail.notFound')}
          </p>
          <p className="text-sm text-slate-500 mb-5">
            {t('serviceDetail.loadErrorHint')}
          </p>
          <Button onClick={() => router.back()}>{t('serviceDetail.back')}</Button>
        </div>
      </div>
    );
  }

  /* derived */
  const price = Number(service.price) || 0;
  const rating = service.rating ? Number(service.rating).toFixed(1) : null;
  const nReviews = reviewsCount(service);
  const provider = service.provider || {};
  const providerName = provider.name || t('serviceDetail.providerFallback');
  const included: string[] = service.servicesIncluded || [];
  const available = Boolean(service.available);
  const dateLabel = format(selectedDate, 'EEEE d MMMM', { locale: dateLocale });

  const handleBooking = () => {
    if (!available || !period) return;
    const qs = new URLSearchParams({
      serviceId: String(params.id),
      date: selectedDate.toISOString(),
      period,
      guests: String(people),
      ...(menu ? { menu } : {}),
    });
    router.push(`/bookings/confirm?${qs.toString()}`);
  };

  const facts = [
    service.duration && { icon: Clock, label: service.duration },
    (service.city || service.location) && {
      icon: MapPin,
      label: service.city || service.location,
    },
  ].filter(Boolean) as { icon: any; label: string }[];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ---------- top bar ---------- */}
      <header className="mx-auto max-w-6xl px-4 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 rounded-full py-1.5 pr-3 pl-2 text-sm text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('serviceDetail.back')}
          </button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="rounded-full gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('serviceDetail.share')}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full gap-2"
              onClick={() => setIsFavorite(!isFavorite)}
              aria-pressed={isFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span className="hidden sm:inline">
                {isFavorite ? t('serviceDetail.saved') : t('serviceDetail.save')}
              </span>
            </Button>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-balance">
          {service.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {rating ? (
              <>
                <b className="text-slate-900">{rating}</b>
                <span>
                  ({nReviews} {t(nReviews === 1 ? 'serviceDetail.reviewCount' : 'serviceDetail.reviewCountPlural')})
                </span>
              </>
            ) : (
              <span>{t('serviceDetail.new')}</span>
            )}
          </span>
          {service.type && (
            <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-900">
              {serviceCategoryLabel(service.type, t)}
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              available ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-emerald-600' : 'bg-slate-400'}`}
            />
            {available ? t('serviceDetail.available') : t('serviceDetail.unavailable')}
          </span>
        </div>
      </header>

      {/* ---------- gallery ---------- */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="relative md:hidden">
          <img
            src={images[0]}
            alt={service.title || t('services.title')}
            className="h-72 w-full rounded-2xl object-cover"
            onClick={() => setLightbox(0)}
          />
          <button
            onClick={() => setLightbox(0)}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium shadow"
          >
            <Grid2x2 className="h-3.5 w-3.5" />
            {images.length} {t(images.length === 1 ? 'serviceDetail.photoCount' : 'serviceDetail.photoCountPlural')}
          </button>
        </div>

        <div
          className={`relative hidden md:grid gap-2 overflow-hidden rounded-3xl h-[440px] ${
            images.length > 1 ? 'grid-cols-4 grid-rows-2' : 'grid-cols-1'
          }`}
        >
          <button
            onClick={() => setLightbox(0)}
            className={`group overflow-hidden ${images.length > 1 ? 'col-span-2 row-span-2' : ''}`}
            aria-label={`${t('serviceDetail.openPhoto')} 1`}
          >
            <img
              src={images[0]}
              alt={service.title || t('services.title')}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
          {images.slice(1, 5).map((src, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i + 1)}
              className="group overflow-hidden"
              aria-label={`${t('serviceDetail.openPhoto')} ${i + 2}`}
            >
              <img
                src={src}
                alt={`${service.title || t('services.title')} ${i + 2}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
          ))}
          {images.length > 1 && (
            <button
              onClick={() => setLightbox(0)}
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-md hover:bg-slate-50"
            >
              <Grid2x2 className="h-4 w-4" />
              {t('serviceDetail.viewPhotos')} ({images.length})
            </button>
          )}
        </div>
      </section>

      {/* ---------- body ---------- */}
      <main className="mx-auto max-w-6xl px-4 py-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-12">
          {/* facts + provider */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-8">
            <div>
              <h2 className="text-xl font-semibold">{t('serviceDetail.hostedBy')} {providerName}</h2>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                {facts.map(({ icon: Icon, label }, i) => (
                  <li key={i} className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4 text-sky-900" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-3">
              {provider.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-900">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {t('serviceDetail.verifiedProvider')}
                </span>
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-900 text-white font-semibold">
                {providerName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* about */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{t('serviceDetail.about')}</h2>
            <p className="max-w-[65ch] leading-relaxed text-slate-600">
              {service.description || t('serviceDetail.descriptionFallback')}
            </p>
          </section>

          {/* included */}
          {included.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">{t('serviceDetail.included')}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {included.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* menu: selectable, synced with the booking card */}
          {menuOptions.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-1">{t('serviceDetail.menuOptions')}</h2>
              <p className="mb-4 text-sm text-slate-500">
                {t('serviceDetail.menuPrompt')}
              </p>
              <div role="radiogroup" aria-label={t('serviceDetail.menuOptions')} className="grid gap-3 sm:grid-cols-2">
                {menuOptions.map((option) => {
                  const active = menu === option;
                  return (
                    <button
                      key={option}
                      role="radio"
                      aria-checked={active}
                      onClick={() => setMenu(option)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${
                        active
                          ? 'border-sky-900 bg-sky-50'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                          active ? 'bg-sky-900 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {active ? <Check className="h-4 w-4" /> : <UtensilsCrossed className="h-4 w-4" />}
                      </span>
                      <span className="text-sm font-medium">{option}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* location */}
          {(service.location || service.city) && (
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('serviceDetail.location')}</h2>
              <p className="inline-flex items-center gap-2 text-slate-600">
                <MapPin className="h-5 w-5 text-sky-900" />
                {[service.location, service.city]
                  .filter((v, i, a) => v && a.indexOf(v) === i)
                  .join(', ')}
              </p>
            </section>
          )}

          {/* provider */}
          <section className="rounded-2xl bg-sky-50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-900 text-lg font-semibold text-white">
                {providerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{providerName}</p>
                <p className="text-sm text-slate-600">
                  {provider.memberSince
                    ? `${t('serviceDetail.memberSince')} ${provider.memberSince}`
                    : t('serviceDetail.defaultProvider')}
                </p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">{t('serviceDetail.responseRate')}</dt>
                <dd className="font-semibold">
                  {provider.responseRate ? `${provider.responseRate} %` : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">{t('serviceDetail.responseTime')}</dt>
                <dd className="font-semibold">{provider.responseTime || '—'}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t('serviceDetail.reviewsReceived')}</dt>
                <dd className="font-semibold">{provider.reviews ?? nReviews}</dd>
              </div>
            </dl>
            <Button
              variant="outline"
              className="mt-5 rounded-full bg-white gap-2"
              onClick={() => setIsContactModalOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
              {t('serviceDetail.contactProvider')}
            </Button>
          </section>
        </div>

        {/* ---------- booking card ---------- */}
        <aside id="reserver" className="lg:sticky lg:top-6 lg:self-start scroll-mt-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(15_58_91/0.08)]">
            <div className="flex items-baseline justify-between">
              <p>
                <span className="text-3xl font-semibold tracking-tight">{price} DT</span>
                <span className="text-sm text-slate-500"> {t('serviceDetail.perService')}</span>
              </p>
              {rating && (
                <span className="inline-flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {rating}
                </span>
              )}
            </div>

            {!available && (
              <p className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                {t('serviceDetail.unavailableBooking')}
              </p>
            )}

            <fieldset disabled={!available} className={available ? '' : 'opacity-50'}>
              {/* date strip */}
              <div className="mt-5">
                <p className="mb-2 text-sm font-medium capitalize">{dateLabel}</p>
                <div
                  className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
                  role="listbox"
                  aria-label={t('serviceDetail.chooseDate')}
                >
                  {dates.map((d) => {
                    const active = d.toDateString() === selectedDate.toDateString();
                    return (
                      <button
                        key={d.toISOString()}
                        role="option"
                        aria-selected={active}
                        onClick={() => setSelectedDate(d)}
                        className={`flex w-14 flex-shrink-0 flex-col items-center rounded-2xl border px-2 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${
                          active
                            ? 'border-sky-900 bg-sky-900 text-white'
                            : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <span className={`text-xs ${active ? 'text-sky-100' : 'text-slate-500'}`}>
                          {format(d, 'EEE', { locale: dateLocale })}
                        </span>
                        <span className="text-lg font-semibold leading-tight">{format(d, 'd')}</span>
                        <span className={`text-xs ${active ? 'text-sky-100' : 'text-slate-500'}`}>
                          {format(d, 'MMM', { locale: dateLocale })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* period */}
              <div className="mt-3 flex flex-wrap gap-2">
                {periods.map((p) => {
                  const active = period === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      aria-pressed={active}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${
                        active
                          ? 'border-sky-900 bg-sky-50 text-sky-900'
                          : 'border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {periodLabel(p, t)}
                    </button>
                  );
                })}
              </div>

              {/* people */}
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                <Users className="h-5 w-5 text-slate-500" />
                <span className="flex-1">
                  <span className="block text-xs text-slate-500">{t('serviceDetail.peopleLabel')}</span>
                  <span className="block text-sm font-medium">
                    {people} {t(people === 1 ? 'serviceDetail.person' : 'serviceDetail.people')}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPeople((g) => Math.max(1, g - 1))}
                    disabled={people <= 1}
                    aria-label={t('serviceDetail.removePerson')}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50 disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPeople((g) => Math.min(MAX_PEOPLE, g + 1))}
                    disabled={people >= MAX_PEOPLE}
                    aria-label={t('serviceDetail.addPerson')}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50 disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {people >= MAX_PEOPLE && (
                <p className="mt-2 text-xs text-slate-500">
                  {t('serviceDetail.moreThan')} {MAX_PEOPLE} {t('serviceDetail.people')}?{' '}
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(true)}
                    className="font-medium text-sky-900 underline underline-offset-2"
                  >
                    {t('serviceDetail.contactProviderVerb')}
                  </button>
                </p>
              )}

              {/* chosen menu recap */}
              {menuOptions.length > 0 && (
                <p className="mt-3 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                  <UtensilsCrossed className="h-4 w-4 flex-shrink-0 text-slate-500" />
                  <span className="text-slate-500">{t('serviceDetail.menuLabel')}</span>
                  <span className="ml-auto text-right font-medium">{menu}</span>
                </p>
              )}
            </fieldset>

            {available ? (
              <Button
                size="lg"
                onClick={handleBooking}
                disabled={!period}
                className="mt-5 h-12 w-full rounded-2xl bg-rose-600 text-base hover:bg-rose-700"
              >
                {t('serviceDetail.book')} · {price} DT
              </Button>
            ) : (
              <Button size="lg" disabled className="mt-5 h-12 w-full rounded-2xl text-base">
                {t('serviceDetail.unavailable')}
              </Button>
            )}

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t('serviceDetail.freeCancellation')}
            </p>
          </div>
        </aside>
      </main>

      {/* ---------- mobile sticky bar ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="font-semibold">
              {price} DT <span className="text-sm font-normal text-slate-500">{t('serviceDetail.perService')}</span>
            </p>
            <p className="text-xs capitalize text-slate-500">
              {available
                ? `${format(selectedDate, 'EEE d MMM', { locale: dateLocale })}${period ? ` · ${periodLabel(period, t)}` : ''}`
                : t('serviceDetail.unavailable')}
            </p>
          </div>
          <Button
            className="rounded-xl bg-rose-600 px-6 hover:bg-rose-700"
            onClick={() =>
              document.getElementById('reserver')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {available ? t('serviceDetail.book') : t('serviceDetail.details')}
          </Button>
        </div>
      </div>
      <div className="h-20 lg:hidden" />

      {/* ---------- lightbox ---------- */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label={t('serviceDetail.galleryLabel')}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label={t('serviceDetail.close')}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stepLightbox(-1);
                }}
                aria-label={t('serviceDetail.previousPhoto')}
                className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stepLightbox(1);
                }}
                aria-label={t('serviceDetail.nextPhoto')}
                className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <img
            src={images[lightbox]}
            alt={`${service.title} ${lightbox + 1}`}
            className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-5 text-sm text-white/80">
            {lightbox + 1} / {images.length}
          </p>
        </div>
      )}

      {/* ---------- contact modal ---------- */}
      <ContactHostModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        hostId={provider._id || provider.id}
        hostName={providerName}
        propertyTitle={service.title}
        userId={user?.id}
      />
    </div>
  );
}