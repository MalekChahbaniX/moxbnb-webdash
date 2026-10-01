'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addDays, format, startOfToday } from 'date-fns';
import { ar, enUS, fr } from 'date-fns/locale';
import {
  MapPin,
  Star,
  Users,
  Clock,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Minus,
  Plus,
  Grid2x2,
  Award,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ContactHostModal from '@/components/moxbnb/ContactHostModal';

const PLACEHOLDER = '/api/placeholder/800/600';
const DAYS_AHEAD = 14;

const reviewsCount = (e: any): number =>
  Array.isArray(e?.reviews) ? e.reviews.length : Number(e?.reviews) || 0;

const experienceCategoryLabel = (category: string | undefined, t: (key: string) => string): string => {
  const categoryKeys: Record<string, string> = {
    'guided tour': 'experiences.guidedTours',
    'guided tours': 'experiences.guidedTours',
    guided_tours: 'experiences.guidedTours',
    'visite guidée': 'experiences.guidedTours',
    'visites guidées': 'experiences.guidedTours',
    cultural: 'experiences.cultural',
    culturel: 'experiences.cultural',
    culinary: 'experiences.culinary',
    culinaire: 'experiences.culinary',
    adventure: 'experiences.adventure',
    aventure: 'experiences.adventure',
    artistic: 'experiences.artistic',
    artistique: 'experiences.artistic',
    'water-sports': 'experiences.waterSports',
    water_sports: 'experiences.waterSports',
    'sports nautiques': 'experiences.waterSports',
    desert: 'experiences.desert',
    désert: 'experiences.desert',
    gastronomy: 'experiences.gastronomy',
    gastronomie: 'experiences.gastronomy',
    nature: 'experiences.nature',
    wellness: 'experiences.wellness',
    'bien-être': 'experiences.wellness',
    photography: 'experiences.photography',
    photographie: 'experiences.photography',
    crafts: 'experiences.crafts',
    artisanat: 'experiences.crafts',
    music: 'experiences.music',
    musique: 'experiences.music',
  };
  const key = category ? categoryKeys[category.trim().toLowerCase()] : undefined;
  return key ? t(key) : category || '';
};

export default function ExperienceDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const dateLocale = language === 'ar' ? ar : language === 'en' ? enUS : fr;

  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(addDays(startOfToday(), 1));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [participants, setParticipants] = useState(2);

  useEffect(() => {
    if (!params.id) return;
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/experiences/${params.id}`);
        setExperience(response.data?.data?.experience || response.data?.data || response.data);
      } catch (err) {
        console.error('Error fetching experience:', err);
        setError('experienceDetail.loadError');
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [params.id]);

  const images: string[] = useMemo(
    () => (experience?.images?.length ? experience.images : [PLACEHOLDER]),
    [experience]
  );

  const timeSlots: string[] = useMemo(
    () => (experience?.timeSlots?.length ? experience.timeSlots : ['14:00']),
    [experience]
  );

  // default to the first slot once data is loaded
  useEffect(() => {
    if (!selectedTime && timeSlots.length) setSelectedTime(timeSlots[0]);
  }, [timeSlots, selectedTime]);

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

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-slate-900 font-medium mb-1">
            {error ? t(error) : t('experienceDetail.notFound')}
          </p>
          <p className="text-sm text-slate-500 mb-5">
            {t('experienceDetail.loadErrorHint')}
          </p>
          <Button onClick={() => router.back()}>{t('experienceDetail.back')}</Button>
        </div>
      </div>
    );
  }

  /* derived */
  const price = Number(experience.price) || 0;
  const total = price * participants;
  const maxGuests = Number(experience.maxGuests) || 8;
  const rating = experience.rating ? Number(experience.rating).toFixed(1) : null;
  const nReviews = reviewsCount(experience);
  const host = experience.host || experience.hostId || {};
  const hostName =
    host.name ||
    (host.firstName || host.lastName
      ? `${host.firstName || ''} ${host.lastName || ''}`.trim()
      : t('experienceDetail.hostFallback'));
  const steps: string[] = experience.whatYouWillDo || [];
  const included: string[] = experience.whatIsIncluded || [];
  const requirements: string[] = experience.requirements || [];

  const dateLabel = format(selectedDate, 'EEEE d MMMM', { locale: dateLocale });

  const handleBooking = () => {
    if (!selectedTime) return;
    const [h, m] = selectedTime.split(':').map(Number);
    const start = new Date(selectedDate);
    start.setHours(h || 0, m || 0, 0, 0);
    router.push(
      `/bookings/confirm?experienceId=${params.id}&date=${start.toISOString()}&guests=${participants}`
    );
  };

  const facts = [
    experience.duration && { icon: Clock, label: experience.duration },
    {
      icon: Users,
      label: `${maxGuests} ${t(maxGuests === 1 ? 'experienceDetail.maxPerson' : 'experienceDetail.maxPeople')}`,
    },
    experience.location && { icon: MapPin, label: experience.location },
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
            {t('experienceDetail.back')}
          </button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="rounded-full gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('experienceDetail.share')}</span>
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
                {isFavorite ? t('experienceDetail.saved') : t('experienceDetail.save')}
              </span>
            </Button>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-balance">
          {experience.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {rating ? (
              <>
                <b className="text-slate-900">{rating}</b>
                <span>
                  ({nReviews} {t(nReviews === 1 ? 'experienceDetail.reviewCount' : 'experienceDetail.reviewCountPlural')})
                </span>
              </>
            ) : (
              <span>{t('experienceDetail.new')}</span>
            )}
          </span>
          {experience.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {experience.location}
            </span>
          )}
          {experience.category && (
            <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-900">
              {experienceCategoryLabel(experience.category, t)}
            </span>
          )}
        </div>
      </header>

      {/* ---------- gallery ---------- */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="relative md:hidden">
          <img
            src={images[0]}
            alt={experience.title || t('experiences.title')}
            className="h-72 w-full rounded-2xl object-cover"
            onClick={() => setLightbox(0)}
          />
          <button
            onClick={() => setLightbox(0)}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium shadow"
          >
            <Grid2x2 className="h-3.5 w-3.5" />
            {images.length} {t(images.length === 1 ? 'experienceDetail.photoCount' : 'experienceDetail.photoCountPlural')}
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
            aria-label={`${t('experienceDetail.openPhoto')} 1`}
          >
            <img
              src={images[0]}
              alt={experience.title || t('experiences.title')}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
          {images.slice(1, 5).map((src, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i + 1)}
              className="group overflow-hidden"
              aria-label={`${t('experienceDetail.openPhoto')} ${i + 2}`}
            >
              <img
                src={src}
                alt={`${experience.title} ${i + 2}`}
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
              {t('experienceDetail.viewPhotos')} ({images.length})
            </button>
          )}
        </div>
      </section>

      {/* ---------- body ---------- */}
      <main className="mx-auto max-w-6xl px-4 py-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-12">
          {/* facts + host */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-8">
            <div>
              <h2 className="text-xl font-semibold">{t('experienceDetail.hostedBy')} {hostName}</h2>
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
              {host.superhost && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
                  <Award className="h-3.5 w-3.5" />
                  {t('experienceDetail.superhost')}
                </span>
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-900 text-white font-semibold">
                {hostName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* about */}
          <section>
            <h2 className="text-xl font-semibold mb-3">{t('experienceDetail.about')}</h2>
            <p className="max-w-[65ch] leading-relaxed text-slate-600">
              {experience.description || t('experienceDetail.descriptionFallback')}
            </p>
          </section>

          {/* what you will do: a real sequence, so a timeline fits */}
          {steps.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-5">{t('experienceDetail.whatYouWillDo')}</h2>
              <ol className="relative space-y-6 border-l-2 border-sky-100 pl-8">
                {steps.map((item, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full bg-sky-900 text-sm font-semibold text-white ring-4 ring-white">
                      {i + 1}
                    </span>
                    <p className="max-w-[65ch] pt-1 text-slate-700">{item}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* included */}
          {included.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">{t('experienceDetail.included')}</h2>
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

          {/* requirements */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t('experienceDetail.thingsToKnow')}</h2>
            {requirements.length > 0 ? (
              <ul className="space-y-2.5">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-700" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">
                {t('experienceDetail.noRequirements')}
              </p>
            )}
          </section>

          {/* host */}
          <section className="rounded-2xl bg-sky-50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-900 text-lg font-semibold text-white">
                {hostName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{hostName}</p>
                <p className="text-sm text-slate-600">
                  {host.memberSince
                    ? `${t('experienceDetail.memberSince')} ${host.memberSince}`
                    : t('experienceDetail.defaultHost')}
                </p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">{t('experienceDetail.responseRate')}</dt>
                <dd className="font-semibold">
                  {host.responseRate ? `${host.responseRate} %` : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">{t('experienceDetail.responseTime')}</dt>
                <dd className="font-semibold">{host.responseTime || '—'}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t('experienceDetail.reviewsReceived')}</dt>
                <dd className="font-semibold">{host.reviews ?? nReviews}</dd>
              </div>
            </dl>
            <Button
              variant="outline"
              className="mt-5 rounded-full bg-white gap-2"
              onClick={() => setIsContactModalOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
              {t('experienceDetail.contactHost')}
            </Button>
          </section>
        </div>

        {/* ---------- booking card ---------- */}
        <aside id="reserver" className="lg:sticky lg:top-6 lg:self-start scroll-mt-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(15_58_91/0.08)]">
            <div className="flex items-baseline justify-between">
              <p>
                <span className="text-3xl font-semibold tracking-tight">{price} DT</span>
                <span className="text-sm text-slate-500"> {t('experienceDetail.perPerson')}</span>
              </p>
              {rating && (
                <span className="inline-flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {rating}
                </span>
              )}
            </div>

            {/* date strip */}
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium capitalize">{dateLabel}</p>
              <div
                className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
                role="listbox"
                aria-label={t('experienceDetail.chooseDate')}
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

            {/* time slots */}
            <div className="mt-3 flex flex-wrap gap-2">
              {timeSlots.map((t) => {
                const active = selectedTime === t;
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${
                      active
                        ? 'border-sky-900 bg-sky-50 text-sky-900'
                        : 'border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {/* participants */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <Users className="h-5 w-5 text-slate-500" />
              <span className="flex-1">
                <span className="block text-xs text-slate-500">{t('experienceDetail.participants')}</span>
                <span className="block text-sm font-medium">
                  {participants} {t(participants === 1 ? 'experienceDetail.person' : 'experienceDetail.people')}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setParticipants((g) => Math.max(1, g - 1))}
                  disabled={participants <= 1}
                  aria-label={t('experienceDetail.removeParticipant')}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50 disabled:opacity-30"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setParticipants((g) => Math.min(maxGuests, g + 1))}
                  disabled={participants >= maxGuests}
                  aria-label={t('experienceDetail.addParticipant')}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50 disabled:opacity-30"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleBooking}
              disabled={!selectedTime}
              className="mt-5 h-12 w-full rounded-2xl bg-rose-600 text-base hover:bg-rose-700"
            >
              {t('experienceDetail.book')} · {total} DT
            </Button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t('experienceDetail.freeCancellation')}
            </p>

            <div className="mt-5 space-y-2 border-t pt-5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>
                  {price} DT × {participants} {t(participants === 1 ? 'experienceDetail.person' : 'experienceDetail.people')}
                </span>
                <span>{total} DT</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>{t('experienceDetail.total')}</span>
                <span>{total} DT</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* ---------- mobile sticky bar ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="font-semibold">
              {price} DT <span className="text-sm font-normal text-slate-500">{t('experienceDetail.perPerson')}</span>
            </p>
            <p className="text-xs capitalize text-slate-500">
              {format(selectedDate, 'EEE d MMM', { locale: dateLocale })}
              {selectedTime ? ` · ${selectedTime}` : ''}
            </p>
          </div>
          <Button
            className="rounded-xl bg-rose-600 px-6 hover:bg-rose-700"
            onClick={() =>
              document.getElementById('reserver')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {t('experienceDetail.book')}
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
          aria-label={t('experienceDetail.galleryLabel')}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label={t('experienceDetail.close')}
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
                aria-label={t('experienceDetail.previousPhoto')}
                className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stepLightbox(1);
                }}
                aria-label={t('experienceDetail.nextPhoto')}
                className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <img
            src={images[lightbox]}
            alt={`${experience.title} ${lightbox + 1}`}
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
        hostId={host._id || host.id}
        hostName={hostName}
        propertyTitle={experience.title}
        userId={user?.id}
      />
    </div>
  );
}