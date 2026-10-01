'use client';

import { useMemo, useState } from 'react';
import { Clock, Users, ChefHat, Landmark, Palette, Compass, LayoutGrid } from 'lucide-react';
import Header from '@/components/moxbnb/Header';
import Footer from '@/components/moxbnb/Footer';
import {
  ListingHero,
  FieldInput,
  SelectField,
  ChipBar,
  ResultsToolbar,
  CardGrid,
  ListingCard,
  StateMessage,
  LoadMore,
  PAGE_SIZE,
  type ChipOption,
} from '@/components/moxbnb/listing-kit';
import { Button } from '@/components/ui/button';

type CategoryKey = 'culinary' | 'guidedTour' | 'artistic' | 'adventure';

const CATEGORIES: Record<CategoryKey, { label: string; icon: typeof ChefHat }> = {
  culinary: { label: 'Culinaire', icon: ChefHat },
  guidedTour: { label: 'Visites guidées', icon: Landmark },
  artistic: { label: 'Artistique', icon: Palette },
  adventure: { label: 'Aventure', icon: Compass },
};

const categoryChips: ChipOption[] = [
  { value: 'all', label: 'Toutes', icon: LayoutGrid },
  ...(Object.entries(CATEGORIES) as [CategoryKey, (typeof CATEGORIES)[CategoryKey]][]).map(
    ([value, { label, icon }]) => ({ value, label, icon })
  ),
];

const sortOptions = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notées' },
];

// NB: les villes ci-dessous sont déduites des titres, à remplacer par les vraies données de l'API.
const allExperiences = [
  {
    id: '1',
    title: 'Dégustation de Cuisine Traditionnelle Tunisienne',
    category: 'culinary' as CategoryKey,
    city: 'Tunis',
    host: 'Fatma Ben Ali',
    duration: '4 heures',
    maxGuests: 8,
    price: 150,
    rating: 4.9,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop',
  },
  {
    id: '2',
    title: 'Visite Guidée de la Médina de Tunis',
    category: 'guidedTour' as CategoryKey,
    city: 'Tunis',
    host: 'Ahmed Kaddour',
    duration: '3 heures',
    maxGuests: 10,
    price: 80,
    rating: 4.8,
    reviews: 512,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
  },
  {
    id: '3',
    title: 'Atelier de Poterie à Sejnane',
    category: 'artistic' as CategoryKey,
    city: 'Bizerte',
    host: 'Leila Messaoudi',
    duration: '5 heures',
    maxGuests: 6,
    price: 200,
    rating: 4.95,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop',
  },
  {
    id: '4',
    title: 'Balade en Chameau dans le Sahara',
    category: 'adventure' as CategoryKey,
    city: 'Tozeur',
    host: 'Omar Ben Salah',
    duration: '1 journée',
    maxGuests: 4,
    price: 350,
    rating: 4.97,
    reviews: 345,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop',
  },
  {
    id: '5',
    title: 'Cours de Cuisine Tunisienne',
    category: 'culinary' as CategoryKey,
    city: 'Tunis',
    host: 'Fatma Ben Ali',
    duration: '3 heures',
    maxGuests: 6,
    price: 120,
    rating: 4.85,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop',
  },
  {
    id: '6',
    title: 'Visite des Musées de Carthage',
    category: 'guidedTour' as CategoryKey,
    city: 'Tunis',
    host: 'Ahmed Kaddour',
    duration: '4 heures',
    maxGuests: 12,
    price: 100,
    rating: 4.88,
    reviews: 278,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
  },
  {
    id: '7',
    title: 'Atelier de Tapisserie à Kairouan',
    category: 'artistic' as CategoryKey,
    city: 'Kairouan',
    host: 'Leila Messaoudi',
    duration: '6 heures',
    maxGuests: 4,
    price: 250,
    rating: 4.9,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop',
  },
  {
    id: '8',
    title: 'Excursion en Mer Méditerranée',
    category: 'adventure' as CategoryKey,
    city: 'Hammamet',
    host: 'Omar Ben Salah',
    duration: '6 heures',
    maxGuests: 8,
    price: 280,
    rating: 4.82,
    reviews: 201,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop',
  },
];

// only offer cities that actually have an experience
const cityOptions = [
  { value: 'all', label: 'Toutes les villes' },
  ...Array.from(new Set(allExperiences.map((e) => e.city)))
    .sort()
    .map((c) => ({ value: c, label: c })),
];

export default function ExperiencesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [city, setCity] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let list = allExperiences.filter((e) => {
      if (category !== 'all' && e.category !== category) return false;
      if (city !== 'all' && e.city !== city) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.host.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q)
      );
    });

    list = [...list];
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [searchTerm, category, city, sortBy]);

  const hasFilters = searchTerm !== '' || category !== 'all' || city !== 'all';

  const reset = () => {
    setSearchTerm('');
    setCategory('all');
    setCity('all');
    setSortBy('relevance');
    setVisible(PAGE_SIZE);
  };

  // any filter change restarts pagination
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
        title="Vivez la Tunisie avec ceux qui la font vivre"
        subtitle="Cuisine, artisanat, balades : des activités animées par des hôtes locaux, à réserver à la date de votre choix."
      >
        <FieldInput
          className="flex-1"
          value={searchTerm}
          onChange={withReset(setSearchTerm)}
          placeholder="Une activité, un hôte, une ville"
          label="Rechercher une expérience"
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
        options={categoryChips}
        value={category}
        onChange={withReset(setCategory)}
        label="Catégorie d'expérience"
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <ResultsToolbar
          countText={`${results.length} expérience${results.length > 1 ? 's' : ''}`}
          hasFilters={hasFilters}
          onReset={reset}
          sort={sortBy}
          onSort={setSortBy}
          sortOptions={sortOptions}
        />

        {results.length === 0 ? (
          <StateMessage
            title="Aucune expérience ne correspond"
            text="Essayez une autre catégorie ou une autre ville."
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
            <CardGrid cols={4}>
              {results.slice(0, visible).map((e) => (
                <ListingCard
                  key={e.id}
                  href={`/experiences/${e.id}`}
                  image={e.image}
                  title={e.title}
                  badge={CATEGORIES[e.category].label}
                  subtitle={`Avec ${e.host}`}
                  meta={[
                    { icon: Clock, text: e.duration },
                    { icon: Users, text: `Max ${e.maxGuests}` },
                  ]}
                  price={e.price}
                  priceSuffix="/ personne"
                  rating={e.rating}
                  reviews={e.reviews}
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