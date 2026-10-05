'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addDays, format, startOfToday } from 'date-fns';
import { fr } from 'date-fns/locale';
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
import ContactHostModal from '@/components/moxbnb/ContactHostModal';
import LoginRequiredDialog from '@/components/moxbnb/LoginRequiredDialog';

const PLACEHOLDER = '/api/placeholder/800/600';
const DAYS_AHEAD = 14;
const MAX_PEOPLE = 4; // above this, the user is asked to contact the provider

const reviewsCount = (s: any): number =>
  Array.isArray(s?.reviews) ? s.reviews.length : Number(s?.reviews) || 0;

export default function ServiceDetail() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(addDays(startOfToday(), 1));
  const [period, setPeriod] = useState<string | null>(null);
  const [people, setPeople] = useState(2);
  const [sheetOpen, setSheetOpen] = useState(false); // mobile booking sheet
  const [slide, setSlide] = useState(0); // mobile gallery position
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
        setError('Impossible de charger ce service.');
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

  const toggleFavorite = () => {
    if (authLoading) return;
    if (!user) {
      setLoginPromptOpen(true);
      return;
    }
    setIsFavorite((current) => !current);
  };
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

  // mobile booking sheet: lock scroll, Esc to close, auto-close when the layout becomes desktop
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheetOpen(false);
    };
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => mq.matches && setSheetOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [sheetOpen]);

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
          <p className="text-slate-900 font-medium mb-1">{error || 'Service introuvable'}</p>
          <p className="text-sm text-slate-500 mb-5">
            Vérifiez votre connexion ou revenez à la liste des services.
          </p>
          <Button onClick={() => router.back()}>Retour</Button>
        </div>
      </div>
    );
  }

  /* derived */
  const price = Number(service.price) || 0;
  const rating = service.rating ? Number(service.rating).toFixed(1) : null;
  const nReviews = reviewsCount(service);
  const provider = service.provider || {};
  const providerName = provider.name || 'Prestataire';
  const included: string[] = service.servicesIncluded || [];
  const available = Boolean(service.available);
  const dateLabel = format(selectedDate, 'EEEE d MMMM', { locale: fr });

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
            Retour
          </button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="rounded-full gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Partager</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full gap-2"
              onClick={toggleFavorite}
              disabled={authLoading}
              aria-pressed={isFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? 'Enregistré' : 'Enregistrer'}</span>
            </Button>
          </div>
        </div>
        <LoginRequiredDialog open={loginPromptOpen} onOpenChange={setLoginPromptOpen} />

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-balance">
          {service.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {rating ? (
              <>
                <b className="text-slate-900">{rating}</b>
                <span>({nReviews} avis)</span>
              </>
            ) : (
              <span>Nouveau</span>
            )}
          </span>
          {service.type && (
            <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-900">
              {service.type}
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
            {available ? 'Disponible' : 'Non disponible'}
          </span>
        </div>
      </header>

      {/* ---------- gallery ---------- */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="relative -mx-4 md:hidden">
          <div
            className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={(e) => {
              const el = e.currentTarget;
              setSlide(Math.round(Math.abs(el.scrollLeft) / el.clientWidth));
            }}
          >
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                aria-label={`Ouvrir la photo ${i + 1}`}
                className="w-full flex-shrink-0 snap-center"
              >
                <img
                  src={src}
                  alt={i === 0 ? service.title : `${service.title} ${i + 1}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="h-72 w-full object-cover"
                />
              </button>
            ))}
          </div>
          <span className="pointer-events-none absolute bottom-3 end-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            {Math.min(slide + 1, images.length)} / {images.length}
          </span>
        </div>

        <div
          className={`relative hidden md:grid gap-2 overflow-hidden rounded-3xl h-[440px] ${
            images.length > 1 ? 'grid-cols-4 grid-rows-2' : 'grid-cols-1'
          }`}
        >
          <button
            onClick={() => setLightbox(0)}
            className={`group overflow-hidden ${images.length > 1 ? 'col-span-2 row-span-2' : ''}`}
            aria-label="Ouvrir la photo 1"
          >
            <img
              src={images[0]}
              alt={service.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
          {images.slice(1, 5).map((src, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i + 1)}
              className="group overflow-hidden"
              aria-label={`Ouvrir la photo ${i + 2}`}
            >
              <img
                src={src}
                alt={`${service.title} ${i + 2}`}
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
              Voir les {images.length} photos
            </button>
          )}
        </div>
      </section>

      {/* ---------- body ---------- */}
      <main className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="space-y-10 md:space-y-12">
          {/* facts + provider */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-8">
            <div>
              <h2 className="text-xl font-semibold">Proposé par {providerName}</h2>
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
                  Prestataire vérifié
                </span>
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-900 text-white font-semibold">
                {providerName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* about */}
          <section>
            <h2 className="text-xl font-semibold mb-3">À propos de ce service</h2>
            <p className="max-w-[65ch] leading-relaxed text-slate-600">
              {service.description || "Le prestataire n'a pas encore ajouté de description."}
            </p>
          </section>

          {/* included */}
          {included.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Ce qui est inclus</h2>
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
              <h2 className="text-xl font-semibold mb-1">Options de menu</h2>
              <p className="mb-4 text-sm text-slate-500">
                Votre choix est repris dans la réservation.
              </p>
              <div role="radiogroup" aria-label="Options de menu" className="grid gap-3 sm:grid-cols-2">
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
              <h2 className="text-xl font-semibold mb-3">Localisation</h2>
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
                  {provider.memberSince ? `Membre depuis ${provider.memberSince}` : 'Prestataire Moxbnb'}
                </p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">Taux de réponse</dt>
                <dd className="font-semibold">
                  {provider.responseRate ? `${provider.responseRate} %` : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Réponse en</dt>
                <dd className="font-semibold">{provider.responseTime || '—'}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Avis reçus</dt>
                <dd className="font-semibold">{provider.reviews ?? nReviews}</dd>
              </div>
            </dl>
            <Button
              variant="outline"
              className="mt-5 rounded-full bg-white gap-2"
              onClick={() => setIsContactModalOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
              Contacter le prestataire
            </Button>
          </section>
        </div>

        {/* ---------- booking card ---------- */}
        {sheetOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSheetOpen(false)}
            aria-hidden
          />
        )}
        <aside
          id="reserver"
          role={sheetOpen ? 'dialog' : undefined}
          aria-modal={sheetOpen ? true : undefined}
          aria-label="Réservation"
          className={`${
            sheetOpen
              ? 'fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto overscroll-contain rounded-t-3xl bg-white shadow-2xl'
              : 'hidden'
          } scroll-mt-6 lg:sticky lg:top-6 lg:block lg:self-start`}
        >
          <div className="bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] lg:rounded-3xl lg:border lg:border-slate-200 lg:pb-6 lg:shadow-[0_8px_30px_rgb(15_58_91/0.08)]">
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              aria-label="Fermer"
              className="-mt-1 mb-2 ms-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-baseline justify-between">
              <p>
                <span className="text-3xl font-semibold tracking-tight">{price} DT</span>
                <span className="text-sm text-slate-500"> / prestation</span>
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
                Ce service n'accepte pas de réservation pour le moment. Vous pouvez contacter le
                prestataire pour connaître ses prochaines disponibilités.
              </p>
            )}

            <fieldset disabled={!available} className={available ? '' : 'opacity-50'}>
              {/* date strip */}
              <div className="mt-5">
                <p className="mb-2 text-sm font-medium capitalize">{dateLabel}</p>
                <div
                  className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2"
                  role="listbox"
                  aria-label="Choisir une date"
                >
                  {dates.map((d) => {
                    const active = d.toDateString() === selectedDate.toDateString();
                    return (
                      <button
                        key={d.toISOString()}
                        role="option"
                        aria-selected={active}
                        onClick={() => setSelectedDate(d)}
                        className={`flex w-14 flex-shrink-0 snap-start flex-col items-center rounded-2xl border px-2 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${
                          active
                            ? 'border-sky-900 bg-sky-900 text-white'
                            : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <span className={`text-xs ${active ? 'text-sky-100' : 'text-slate-500'}`}>
                          {format(d, 'EEE', { locale: fr })}
                        </span>
                        <span className="text-lg font-semibold leading-tight">{format(d, 'd')}</span>
                        <span className={`text-xs ${active ? 'text-sky-100' : 'text-slate-500'}`}>
                          {format(d, 'MMM', { locale: fr })}
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
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* people */}
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                <Users className="h-5 w-5 text-slate-500" />
                <span className="flex-1">
                  <span className="block text-xs text-slate-500">Nombre de personnes</span>
                  <span className="block text-sm font-medium">
                    {people} personne{people > 1 ? 's' : ''}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPeople((g) => Math.max(1, g - 1))}
                    disabled={people <= 1}
                    aria-label="Retirer une personne"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50 disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPeople((g) => Math.min(MAX_PEOPLE, g + 1))}
                    disabled={people >= MAX_PEOPLE}
                    aria-label="Ajouter une personne"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50 disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {people >= MAX_PEOPLE && (
                <p className="mt-2 text-xs text-slate-500">
                  Plus de {MAX_PEOPLE} personnes ?{' '}
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(true)}
                    className="font-medium text-sky-900 underline underline-offset-2"
                  >
                    Contactez le prestataire
                  </button>
                </p>
              )}

              {/* chosen menu recap */}
              {menuOptions.length > 0 && (
                <p className="mt-3 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                  <UtensilsCrossed className="h-4 w-4 flex-shrink-0 text-slate-500" />
                  <span className="text-slate-500">Menu</span>
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
                Réserver · {price} DT
              </Button>
            ) : (
              <Button size="lg" disabled className="mt-5 h-12 w-full rounded-2xl text-base">
                Non disponible
              </Button>
            )}

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              Annulation gratuite jusqu'à 48 h avant
            </p>
          </div>
        </aside>
      </main>

      {/* ---------- mobile sticky bar ---------- */}
      <div className={`fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden ${sheetOpen ? 'hidden' : ''}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="font-semibold">
              {price} DT <span className="text-sm font-normal text-slate-500">/ prestation</span>
            </p>
            <p className="text-xs capitalize text-slate-500">
              {available
                ? `${format(selectedDate, 'EEE d MMM', { locale: fr })}${period ? ` · ${period}` : ''}`
                : 'Non disponible'}
            </p>
          </div>
          <Button
            className="rounded-xl bg-rose-600 px-6 hover:bg-rose-700"
            onClick={() => setSheetOpen(true)}
          >
            {available ? 'Réserver' : 'Détails'}
          </Button>
        </div>
      </div>
      <div className="h-24 lg:hidden" />

      {/* ---------- lightbox ---------- */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie photos"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label="Fermer"
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
                aria-label="Photo précédente"
                className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stepLightbox(1);
                }}
                aria-label="Photo suivante"
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