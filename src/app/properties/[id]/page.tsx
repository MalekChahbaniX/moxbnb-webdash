'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addDays, differenceInCalendarDays, format, startOfToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import {
  MapPin,
  Users,
  Bath,
  Bed,
  Home,
  Share2,
  Heart,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Minus,
  Plus,
  Grid2x2,
  Wifi,
  Car,
  Snowflake,
  Waves,
  Utensils,
  Tv,
  Coffee,
  Sun,
  Star,
  CalendarDays,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import ContactHostModal from '@/components/moxbnb/ContactHostModal';

const PLACEHOLDER = '/api/placeholder/800/600';

/* ---------- helpers ---------- */

const amenityIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('wifi')) return Wifi;
  if (n.includes('clim')) return Snowflake;
  if (n.includes('mer') || n.includes('piscine')) return Waves;
  if (n.includes('cuisine')) return Utensils;
  if (n.includes('parking')) return Car;
  if (n.includes('tv') || n.includes('télé')) return Tv;
  if (n.includes('café') || n.includes('petit')) return Coffee;
  if (n.includes('terrasse') || n.includes('jardin')) return Sun;
  return Check;
};

const reviewsCount = (p: any): number =>
  Array.isArray(p?.reviews) ? p.reviews.length : Number(p?.reviews) || 0;

const hostFullName = (p: any): string => {
  const first = p?.hostId?.firstName;
  const last = p?.hostId?.lastName;
  return first || last ? `${first || ''} ${last || ''}`.trim() : 'Hôte';
};

/* ---------- page ---------- */

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [range, setRange] = useState<DateRange | undefined>({
    from: addDays(startOfToday(), 1),
    to: addDays(startOfToday(), 4),
  });
  const [isDatesOpen, setIsDatesOpen] = useState(false);
  const [guests, setGuests] = useState(2);

  /* fetch */
  useEffect(() => {
    if (!params.id) return;
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/listings/${params.id}`);
        const data = response.data?.data?.listing || response.data?.data || response.data;
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Impossible de charger ce logement.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [params.id]);

  const images: string[] = useMemo(
    () => (property?.images?.length ? property.images : [PLACEHOLDER]),
    [property]
  );

  /* lightbox keyboard controls (hook stays above early returns) */
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

  /* loading / error */
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
            <div className="h-80 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-slate-900 font-medium mb-1">
            {error || 'Logement introuvable'}
          </p>
          <p className="text-sm text-slate-500 mb-5">
            Vérifiez votre connexion ou revenez à la liste des logements.
          </p>
          <Button onClick={() => router.back()}>Retour</Button>
        </div>
      </div>
    );
  }

  /* derived values */
  const price = Number(property.price) || 0;
  const nights =
    range?.from && range?.to ? Math.max(differenceInCalendarDays(range.to, range.from), 0) : 0;
  const total = nights * price;
  const maxGuests = Number(property.maxGuests) || 8;
  const rating = property.rating ? Number(property.rating).toFixed(1) : null;
  const nReviews = reviewsCount(property);
  const amenities: string[] = property.amenities || [];
  const rules: string[] = property.houseRules || [];
  const hostName = hostFullName(property);
  const hostSince = new Date(property.hostId?.createdAt || Date.now()).getFullYear();

  const handleBooking = () => {
    if (!range?.from || !range?.to || nights < 1) {
      setIsDatesOpen(true);
      return;
    }
    router.push(
      `/bookings/confirm?propertyId=${params.id}&checkIn=${range.from.toISOString()}&checkOut=${range.to.toISOString()}&guests=${guests}`
    );
  };

  const datesLabel =
    range?.from && range?.to
      ? `${format(range.from, 'd MMM', { locale: fr })} → ${format(range.to, 'd MMM yyyy', { locale: fr })}`
      : 'Choisir vos dates';

  const facts = [
    { icon: Bed, label: `${property.bedrooms} chambre${property.bedrooms > 1 ? 's' : ''}` },
    { icon: Bath, label: `${property.bathrooms} salle${property.bathrooms > 1 ? 's' : ''} de bain` },
    { icon: Users, label: `${property.maxGuests} voyageurs max` },
  ].filter((f) => !f.label.startsWith('undefined'));

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
              onClick={() => setIsFavorite(!isFavorite)}
              aria-pressed={isFavorite}
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`}
              />
              <span className="hidden sm:inline">{isFavorite ? 'Enregistré' : 'Enregistrer'}</span>
            </Button>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-balance">
          {property.title || 'Logement'}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
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
          {property.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {property.location}
            </span>
          )}
          {property.type && (
            <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-900">
              {property.type}
            </span>
          )}
        </div>
      </header>

      {/* ---------- gallery ---------- */}
      <section className="mx-auto max-w-6xl px-4">
        {/* mobile: single hero */}
        <div className="relative md:hidden">
          <img
            src={images[0]}
            alt={property.title}
            className="h-72 w-full rounded-2xl object-cover"
            onClick={() => setLightbox(0)}
          />
          <button
            onClick={() => setLightbox(0)}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium shadow"
          >
            <Grid2x2 className="h-3.5 w-3.5" />
            {images.length} photo{images.length > 1 ? 's' : ''}
          </button>
        </div>

        {/* desktop: bento */}
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
              alt={property.title}
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
                alt={`${property.title} ${i + 2}`}
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
      <main className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="space-y-12">
          {/* facts strip + host */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-8">
            <div>
              <h2 className="text-xl font-semibold">
                {property.type || 'Logement'} proposé par {hostName}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {facts.map((f) => f.label).join(' · ')}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-900 text-white font-semibold">
              {hostName.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* description */}
          <section>
            <h2 className="text-xl font-semibold mb-3">À propos de ce logement</h2>
            <p className="max-w-[65ch] leading-relaxed text-slate-600">
              {property.description || "L'hôte n'a pas encore ajouté de description."}
            </p>
          </section>

          {/* amenities */}
          {amenities.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Ce que propose ce logement</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {amenities.map((a, i) => {
                  const Icon = amenityIcon(a);
                  return (
                    <li
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-900">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="text-sm font-medium">{a}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* rules */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Règles de la maison</h2>
            {rules.length > 0 ? (
              <ul className="space-y-2.5">
                {rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">
                Aucune règle particulière. Contactez l'hôte pour toute question.
              </p>
            )}
          </section>

          {/* host block (mobile-friendly, mirrors the card) */}
          <section className="rounded-2xl bg-sky-50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-900 text-lg font-semibold text-white">
                {hostName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{hostName}</p>
                <p className="text-sm text-slate-600">Membre depuis {hostSince}</p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">Taux de réponse</dt>
                <dd className="font-semibold">95 %</dd>
              </div>
              <div>
                <dt className="text-slate-500">Réponse en</dt>
                <dd className="font-semibold">Quelques heures</dd>
              </div>
              <div>
                <dt className="text-slate-500">Avis reçus</dt>
                <dd className="font-semibold">{nReviews}</dd>
              </div>
            </dl>
            <Button
              variant="outline"
              className="mt-5 rounded-full bg-white gap-2"
              onClick={() => setIsContactModalOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
              Contacter l'hôte
            </Button>
          </section>
        </div>

        {/* ---------- booking card ---------- */}
        <aside id="reserver" className="lg:sticky lg:top-6 lg:self-start scroll-mt-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(15_58_91/0.08)]">
            <div className="flex items-baseline justify-between">
              <p>
                <span className="text-3xl font-semibold tracking-tight">{price} DT</span>
                <span className="text-sm text-slate-500"> / nuit</span>
              </p>
              {rating && (
                <span className="inline-flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {rating}
                </span>
              )}
            </div>

            {/* dates */}
            <Popover open={isDatesOpen} onOpenChange={setIsDatesOpen}>
              <PopoverTrigger asChild>
                <button
                  className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-left hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
                >
                  <CalendarDays className="h-5 w-5 text-slate-500" />
                  <span className="flex-1">
                    <span className="block text-xs text-slate-500">Dates du séjour</span>
                    <span className="block text-sm font-medium">{datesLabel}</span>
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  numberOfMonths={1}
                  selected={range}
                  onSelect={(r) => {
                    setRange(r);
                    if (r?.from && r?.to && r.to > r.from) setIsDatesOpen(false);
                  }}
                  disabled={{ before: startOfToday() }}
                  locale={fr}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* guests stepper */}
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <Users className="h-5 w-5 text-slate-500" />
              <span className="flex-1">
                <span className="block text-xs text-slate-500">Voyageurs</span>
                <span className="block text-sm font-medium">
                  {guests} voyageur{guests > 1 ? 's' : ''}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  disabled={guests <= 1}
                  aria-label="Retirer un voyageur"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 disabled:opacity-30 hover:bg-slate-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                  disabled={guests >= maxGuests}
                  aria-label="Ajouter un voyageur"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 disabled:opacity-30 hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleBooking}
              className="mt-5 h-12 w-full rounded-2xl bg-rose-600 text-base hover:bg-rose-700"
            >
              {nights > 0 ? `Réserver ${nights} nuit${nights > 1 ? 's' : ''}` : 'Choisir des dates'}
            </Button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              Aucun montant ne vous sera débité pour le moment
            </p>

            {nights > 0 && (
              <div className="mt-5 space-y-2 border-t pt-5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>
                    {price} DT × {nights} nuit{nights > 1 ? 's' : ''}
                  </span>
                  <span>{total} DT</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{total} DT</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* ---------- mobile sticky bar ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="font-semibold">
              {price} DT <span className="text-sm font-normal text-slate-500">/ nuit</span>
            </p>
            <p className="text-xs text-slate-500">{datesLabel}</p>
          </div>
          <Button
            className="rounded-xl bg-rose-600 px-6 hover:bg-rose-700"
            onClick={() =>
              document.getElementById('reserver')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Réserver
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
            alt={`${property.title} ${lightbox + 1}`}
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
        hostId={property?.hostId?._id}
        hostName={hostName}
        propertyTitle={property?.title}
        userId={user?.id}
      />
    </div>
  );
}