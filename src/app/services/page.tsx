'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Heart,
  Star,
  MapPin,
  Clock,
  LayoutGrid,
  ChefHat,
  Sparkles,
  Dumbbell,
  Camera,
  Scissors,
  UtensilsCrossed,
} from 'lucide-react';
import Header from '@/components/moxbnb/Header';
import Footer from '@/components/moxbnb/Footer';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ServiceItem {
  id: string;
  title: string;
  provider: string;
  type: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  available: boolean;
  image: string;
}

const serviceTypeOptions = [
  { value: 'all', label: 'Tous', icon: LayoutGrid },
  { value: 'privateChef', label: 'Chef privé', icon: ChefHat },
  { value: 'massage', label: 'Massages', icon: Sparkles },
  { value: 'sportsCoach', label: 'Coach sportif', icon: Dumbbell },
  { value: 'photography', label: 'Photographie', icon: Camera },
  { value: 'hairdressing', label: 'Coiffure', icon: Scissors },
  { value: 'catering', label: 'Traiteur', icon: UtensilsCrossed },
];

const cityOptions = [
  { value: 'all', label: 'Toutes les villes' },
  { value: 'Tunis', label: 'Tunis' },
  { value: 'Hammamet', label: 'Hammamet' },
  { value: 'Sousse', label: 'Sousse' },
  { value: 'Sfax', label: 'Sfax' },
  { value: 'Djerba', label: 'Djerba' },
];

const sortOptions = [
  { value: 'default', label: 'Pertinence' },
  { value: 'priceAsc', label: 'Prix croissant' },
  { value: 'priceDesc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
];

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop';
const PAGE_SIZE = 9;

/* ---------- card ---------- */

function ServiceListingCard({ service }: { service: ServiceItem }) {
  const [fav, setFav] = useState(false);

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-2xl bg-slate-100">
        <Link
          href={`/services/${service.id}`}
          aria-label={service.title}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 rounded-2xl"
        >
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            className={`aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${
              service.available ? '' : 'grayscale-[60%]'
            }`}
          />
        </Link>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-sky-900 shadow-sm">
          {service.type}
        </span>

        <button
          onClick={() => setFav(!fav)}
          aria-pressed={fav}
          aria-label={fav ? 'Retirer des favoris' : 'Enregistrer'}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
        >
          <Heart className={`h-4 w-4 ${fav ? 'fill-rose-600 text-rose-600' : 'text-slate-700'}`} />
        </button>

        {!service.available && (
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-medium text-white">
            Indisponible
          </span>
        )}
      </div>

      <Link href={`/services/${service.id}`} className="mt-3 block">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-semibold text-slate-900 group-hover:underline underline-offset-2">
            {service.title}
          </h3>
          <span className="inline-flex flex-shrink-0 items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {service.rating > 0 ? service.rating.toFixed(1) : 'Nouveau'}
            {service.reviews > 0 && <span className="text-slate-500">({service.reviews})</span>}
          </span>
        </div>

        <p className="mt-0.5 text-sm text-slate-600">Par {service.provider}</p>

        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{service.location}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {service.duration}
          </span>
        </p>

        <p className="mt-2 text-slate-900">
          <span className="text-lg font-semibold">{service.price} DT</span>
          <span className="text-sm text-slate-500"> / prestation</span>
        </p>
      </Link>
    </article>
  );
}

function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] rounded-2xl bg-slate-100" />
      <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
      <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
      <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />
      <div className="mt-3 h-5 w-24 rounded bg-slate-100" />
    </div>
  );
}

/* ---------- page ---------- */

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState('default');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchServices() {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (selectedType !== 'all') params.append('type', selectedType);
        if (selectedCity !== 'all') params.append('city', selectedCity);
        if (onlyAvailable) params.append('available', 'true');

        const response = await fetch(`/api/services?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'Erreur lors du chargement des services');
        }

        const list: any[] = Array.isArray(data) ? data : data?.data || [];

        setServices(
          list.map((service: any) => ({
            id: service._id,
            title: service.title,
            provider: service.providerId?.name || 'Prestataire',
            type:
              serviceTypeOptions.find(
                (option) => option.value === service.type || option.value === service.category
              )?.label ||
              service.type ||
              service.category ||
              'Service',
            location: service.location || service.address || service.city || 'Lieu non spécifié',
            duration: service.duration || 'Durée non précisée',
            price: Number(service.price) || 0,
            rating: Number(service.rating) || 0,
            reviews: Number(service.reviewsCount) || 0,
            available: Boolean(service.isAvailable ?? service.available),
            image: service.images?.[0] || FALLBACK_IMAGE,
          }))
        );
        setVisible(PAGE_SIZE);
      } catch (fetchError: any) {
        if (fetchError?.name === 'AbortError') return;
        setError(fetchError.message || 'Impossible de charger les services');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchServices();
    return () => controller.abort();
  }, [selectedType, selectedCity, onlyAvailable, reloadKey]);

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const filtered = q
      ? services.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.provider.toLowerCase().includes(q) ||
            s.location.toLowerCase().includes(q)
        )
      : services;

    const sorted = [...filtered];
    if (sort === 'priceAsc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'priceDesc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [services, searchTerm, sort]);

  const hasFilters =
    searchTerm !== '' || selectedType !== 'all' || selectedCity !== 'all' || onlyAvailable;

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCity('all');
    setOnlyAvailable(false);
    setSort('default');
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Header />

      {/* ---------- hero + search ---------- */}
      <section className="border-b bg-sky-50/60">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-10">
          <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Des professionnels à votre porte, pendant votre séjour
          </h1>
          <p className="mt-2 max-w-[60ch] text-slate-600">
            Chef à domicile, massage, shooting photo : réservez un prestataire pour la date qui
            vous arrange.
          </p>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Un service, un prestataire, un lieu"
                aria-label="Rechercher un service"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-10 text-sm shadow-sm placeholder:text-slate-400 focus:border-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-900/20"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  aria-label="Effacer la recherche"
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger
                aria-label="Ville"
                className="h-12 w-full rounded-2xl border-slate-200 bg-white shadow-sm md:w-52"
              >
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent>
                {cityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* ---------- type chips + toggles (sticky) ---------- */}
      <div className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <div
            className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 py-1"
            role="group"
            aria-label="Type de service"
          >
            {serviceTypeOptions.map(({ value, label, icon: Icon }) => {
              const active = selectedType === value;
              return (
                <button
                  key={value}
                  onClick={() => setSelectedType(value)}
                  aria-pressed={active}
                  className={`inline-flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${
                    active
                      ? 'border-sky-900 bg-sky-900 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </div>

          <label className="hidden flex-shrink-0 cursor-pointer select-none items-center gap-2 text-sm text-slate-700 md:flex">
            <button
              role="switch"
              aria-checked={onlyAvailable}
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${
                onlyAvailable ? 'bg-sky-900' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  onlyAvailable ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </button>
            Disponibles
          </label>
        </div>
      </div>

      {/* ---------- results ---------- */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600" aria-live="polite">
            {loading
              ? 'Chargement…'
              : error
              ? ''
              : `${results.length} service${results.length > 1 ? 's' : ''}`}
          </p>

          <div className="flex items-center gap-3">
            {/* availability toggle on mobile */}
            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              aria-pressed={onlyAvailable}
              className={`rounded-full border px-3 py-1.5 text-sm md:hidden ${
                onlyAvailable
                  ? 'border-sky-900 bg-sky-50 text-sky-900'
                  : 'border-slate-200 text-slate-700'
              }`}
            >
              Disponibles
            </button>

            {hasFilters && (
              <button
                onClick={resetFilters}
                className="text-sm font-medium text-sky-900 underline underline-offset-2"
              >
                Réinitialiser
              </button>
            )}

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger aria-label="Trier" className="h-9 w-44 rounded-full border-slate-200">
                <SelectValue placeholder="Trier" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="mx-auto max-w-sm py-20 text-center">
            <p className="font-medium">{error}</p>
            <p className="mt-1 text-sm text-slate-500">
              Vérifiez votre connexion puis réessayez.
            </p>
            <Button className="mt-5" onClick={() => setReloadKey((k) => k + 1)}>
              Réessayer
            </Button>
          </div>
        ) : results.length === 0 ? (
          <div className="mx-auto max-w-sm py-20 text-center">
            <p className="font-medium">Aucun service ne correspond</p>
            <p className="mt-1 text-sm text-slate-500">
              Essayez un autre type, une autre ville, ou retirez le filtre de disponibilité.
            </p>
            {hasFilters && (
              <Button variant="outline" className="mt-5" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {results.slice(0, visible).map((service) => (
                <ServiceListingCard key={service.id} service={service} />
              ))}
            </div>

            {visible < results.length && (
              <div className="mt-12 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                >
                  Afficher {Math.min(PAGE_SIZE, results.length - visible)} de plus
                </Button>
                <p className="mt-2 text-xs text-slate-500">
                  {visible} sur {results.length}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}