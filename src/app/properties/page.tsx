'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, LayoutGrid, Building2, Home, Waves, BedDouble, Trees } from 'lucide-react';
import Header from '@/components/moxbnb/Header';
import Footer from '@/components/moxbnb/Footer';
import {
  ListingHero,
  FieldInput,
  SelectField,
  ChipBar,
  ResultsToolbar,
  CardGrid,
  CardSkeletonGrid,
  ListingCard,
  StateMessage,
  LoadMore,
  PAGE_SIZE,
  type ChipOption,
} from '@/components/moxbnb/listing-kit';
import { Button } from '@/components/ui/button';

const allProperties = [
  {
    id: '1',
    title: 'Appartement de Charme à Sidi Bou Said',
    type: 'Appartement',
    location: 'Sidi Bou Said, Tunis',
    price: 350,
    rating: 4.9,
    reviews: 127,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  },
  {
    id: '2',
    title: 'Villa avec Piscine à Hammamet',
    type: 'Villa',
    location: 'Hammamet, Nabeul',
    price: 750,
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
  },
  {
    id: '3',
    title: 'Maison Traditionnelle Djerbienne',
    type: 'Maison',
    location: 'Djerba, Medenine',
    price: 280,
    rating: 4.95,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  },
  {
    id: '4',
    title: 'Studio Vue Mer à Monastir',
    type: 'Chambre privée',
    location: 'Monastir, Monastir',
    price: 180,
    rating: 4.7,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
  },
  {
    id: '5',
    title: 'Cabane dans les Palmiers Tozeur',
    type: 'Cabane',
    location: 'Tozeur, Tozeur',
    price: 420,
    rating: 4.92,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop',
  },
  {
    id: '6',
    title: 'Penthouse Moderne Tunis Centre',
    type: 'Appartement',
    location: 'Tunis, Tunis',
    price: 450,
    rating: 4.85,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  },
  {
    id: '7',
    title: 'Villa Luxueuse Sfax',
    type: 'Villa',
    location: 'Sfax, Sfax',
    price: 850,
    rating: 4.88,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  },
  {
    id: '8',
    title: 'Appartement Vue Médina Kairouan',
    type: 'Appartement',
    location: 'Kairouan, Kairouan',
    price: 220,
    rating: 4.75,
    reviews: 93,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
  },
  {
    id: '9',
    title: 'Maison de Pêche Mahdia',
    type: 'Maison',
    location: 'Mahdia, Mahdia',
    price: 320,
    rating: 4.82,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  },
];

const typeChips: ChipOption[] = [
  { value: 'all', label: 'Tous', icon: LayoutGrid },
  { value: 'Appartement', label: 'Appartements', icon: Building2 },
  { value: 'Maison', label: 'Maisons', icon: Home },
  { value: 'Villa', label: 'Villas', icon: Waves },
  { value: 'Chambre privée', label: 'Chambres privées', icon: BedDouble },
  { value: 'Cabane', label: 'Cabanes', icon: Trees },
];

// villes présentes dans les données (Sousse n'a aucun logement pour l'instant)
const cityOptions = [
  { value: 'all', label: 'Toutes les villes' },
  ...['Tunis', 'Hammamet', 'Djerba', 'Monastir', 'Tozeur', 'Sfax', 'Kairouan', 'Mahdia'].map((c) => ({
    value: c,
    label: c,
  })),
];

const sortOptions = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
];

function PropertiesContent() {
  const searchParams = useSearchParams();
  const urlLocation = searchParams.get('location') ?? '';

  const [searchTerm, setSearchTerm] = useState(urlLocation);
  const [type, setType] = useState('all');
  const [city, setCity] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [visible, setVisible] = useState(PAGE_SIZE);

  // keep the field in sync when the user arrives with a new ?location=
  useEffect(() => {
    setSearchTerm(urlLocation);
    setVisible(PAGE_SIZE);
  }, [urlLocation]);

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = allProperties.filter((p) => {
      if (type !== 'all' && p.type !== type) return false;
      if (city !== 'all' && !p.location.toLowerCase().includes(city.toLowerCase())) return false;
      if (!q) return true;
      return p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    });

    const sorted = [...list];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [searchTerm, type, city, sortBy]);

  const hasFilters = searchTerm !== '' || type !== 'all' || city !== 'all';

  const reset = () => {
    setSearchTerm('');
    setType('all');
    setCity('all');
    setSortBy('relevance');
    setVisible(PAGE_SIZE);
  };

  const withReset =
    <T,>(setter: (v: T) => void) =>
    (v: T) => {
      setter(v);
      setVisible(PAGE_SIZE);
    };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Header />

      <ListingHero
        title="Un logement pour chaque façon de voyager"
        subtitle="Des appartements de la médina aux villas avec piscine, trouvez l'endroit qui vous ressemble."
      >
        <FieldInput
          className="flex-1"
          value={searchTerm}
          onChange={withReset(setSearchTerm)}
          placeholder="Une destination ou un nom de logement"
          label="Rechercher un logement"
        />
        <SelectField
          value={city}
          onChange={withReset(setCity)}
          options={cityOptions}
          placeholder="Ville"
          label="Ville"
        />
      </ListingHero>

      <ChipBar
        options={typeChips}
        value={type}
        onChange={withReset(setType)}
        label="Type de logement"
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <ResultsToolbar
          countText={`${results.length} logement${results.length > 1 ? 's' : ''}`}
          hasFilters={hasFilters}
          onReset={reset}
          sort={sortBy}
          onSort={setSortBy}
          sortOptions={sortOptions}
        />

        {results.length === 0 ? (
          <StateMessage
            title="Aucun logement ne correspond"
            text="Essayez un autre type de logement ou une autre ville."
            action={
              hasFilters && (
                <Button variant="outline" onClick={reset}>
                  Réinitialiser les filtres
                </Button>
              )
            }
          />
        ) : (
          <>
            <CardGrid>
              {results.slice(0, visible).map((p) => (
                <ListingCard
                  key={p.id}
                  href={`/properties/${p.id}`}
                  image={p.image}
                  title={p.title}
                  badge={p.type}
                  meta={[{ icon: MapPin, text: p.location }]}
                  price={p.price}
                  priceSuffix="/ nuit"
                  rating={p.rating}
                  reviews={p.reviews}
                />
              ))}
            </CardGrid>
            <LoadMore
              shown={Math.min(visible, results.length)}
              total={results.length}
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16">
          <CardSkeletonGrid />
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}