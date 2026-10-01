'use client';

import { useState, useEffect, Suspense } from 'react';
import { MapPin } from 'lucide-react';
import Header from '@/components/moxbnb/Header';
import Footer from '@/components/moxbnb/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ListingHero,  FieldInput,
  ChipBar,
  ResultsToolbar,
  CardGrid,
  CardSkeletonGrid,
  ListingCard,
  StateMessage,
  Pager,
  useDebounced,
  type ChipOption, } from '@/components/moxbnb/listing-kit';

interface StudentListing {
  _id: string;
  title: string;
  type: string;
  address: string;
  city: string;
  price: number;
  monthlyPrice?: number;
  pricingType: 'NIGHTLY' | 'MONTHLY' | 'BOTH';
  images: string[];
  targetAudience?: 'GENERAL' | 'STUDENTS' | 'FAMILIES' | 'PROFESSIONALS';
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviews?: number;
}

const PER_PAGE = 12;

function StudentHousingContent() {
  const { t, language } = useLanguage();
  // tiny helper so every string stays on one line
  const L = (en: string, fr: string, ar: string) =>
    language === 'en' ? en : language === 'fr' ? fr : ar;

  const [listings, setListings] = useState<StudentListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [cityInput, setCityInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [pricingType, setPricingType] = useState('all');

  // typing shouldn't fire one request per keystroke
  const city = useDebounced(cityInput.trim());
  const maxPrice = useDebounced(maxPriceInput.trim());

  // any filter change goes back to page 1
  useEffect(() => {
    setPage(1);
  }, [city, maxPrice, pricingType]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchListings() {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(PER_PAGE) });
        if (city) params.append('city', city);
        if (pricingType !== 'all') params.append('pricingType', pricingType);
        if (maxPrice) params.append('maxPrice', maxPrice);

        const response = await fetch(`/api/listings/students?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (data.success) {
          setListings(data.data);
          setTotal(data.pagination.total);
        } else {
          setError(data.error || L('Failed to fetch listings', 'Impossible de charger les logements', 'تعذر تحميل الإقامات'));
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        setError(
          L(
            'Error fetching student listings',
            'Erreur lors du chargement des logements étudiants',
            'حدث خطأ أثناء تحميل الإقامات الطلابية'
          )
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchListings();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, maxPrice, pricingType, page, reloadKey]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const hasFilters = cityInput !== '' || maxPriceInput !== '' || pricingType !== 'all';

  const reset = () => {
    setCityInput('');
    setMaxPriceInput('');
    setPricingType('all');
  };

  const pricingChips: ChipOption[] = [
    { value: 'all', label: L('All types', 'Tous les types', 'جميع الأنواع') },
    { value: 'NIGHTLY', label: t('properties.nightly') },
    { value: 'MONTHLY', label: t('properties.monthly') },
    { value: 'BOTH', label: t('properties.both') },
  ];

  const perNight = L('/ night', '/ nuit', '/ ليلة');
  const perMonth = L('/ month', '/ mois', '/ شهر');

  const priceProps = (l: StudentListing) => {
    if (l.pricingType === 'MONTHLY') {
      return { price: l.monthlyPrice ?? l.price, priceSuffix: perMonth };
    }
    return {
      price: l.price,
      priceSuffix: perNight,
      altPrice:
        l.pricingType === 'BOTH' && l.monthlyPrice
          ? `${L('or', 'ou', 'أو')} ${l.monthlyPrice} DT ${perMonth}`
          : undefined,
    };
  };

  const countText = loading
    ? L('Loading…', 'Chargement…', 'جارٍ التحميل…')
    : error
    ? ''
    : L(
        `${total} listing${total === 1 ? '' : 's'}`,
        `${total} logement${total > 1 ? 's' : ''}`,
        `${total} إقامة`
      );

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Header />

      <ListingHero
        title={t('properties.studentListings')}
        subtitle={L(
          'Find accommodation options specifically curated for students',
          'Trouvez des options de logement spécialement sélectionnées pour les étudiants',
          'ابحث عن خيارات الإقامة المحددة خصيصًا للطلاب'
        )}
      >
        <FieldInput
          className="flex-1"
          value={cityInput}
          onChange={setCityInput}
          placeholder={L('Search by city', 'Rechercher par ville', 'البحث بالمدينة')}
          label={L('City', 'Ville', 'المدينة')}
        />
        <FieldInput
          className="md:w-56"
          type="number"
          withIcon={false}
          value={maxPriceInput}
          onChange={setMaxPriceInput}
          placeholder={L('Max price (DT)', 'Prix max (DT)', 'السعر الأقصى (DT)')}
          label={L('Max price', 'Prix maximum', 'السعر الأقصى')}
        />
      </ListingHero>

      <ChipBar
        options={pricingChips}
        value={pricingType}
        onChange={setPricingType}
        label={L('Pricing type', 'Type de prix', 'نوع السعر')}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <ResultsToolbar
          countText={countText}
          hasFilters={hasFilters}
          onReset={reset}
          resetLabel={L('Reset', 'Réinitialiser', 'إعادة تعيين')}
        />

        {loading ? (
          <CardSkeletonGrid count={6} />
        ) : error ? (
          <StateMessage
            title={error}
            text={L(
              'Check your connection and try again.',
              'Vérifiez votre connexion puis réessayez.',
              'تحقق من اتصالك ثم حاول مرة أخرى.'
            )}
            action={
              <Button onClick={() => setReloadKey((k) => k + 1)}>
                {L('Try again', 'Réessayer', 'إعادة المحاولة')}
              </Button>
            }
          />
        ) : listings.length === 0 ? (
          <StateMessage
            title={L(
              'No student accommodations found',
              'Aucun logement étudiant trouvé',
              'لم يتم العثور على إقامات طلابية'
            )}
            text={L(
              'Try another city or raise the maximum price.',
              'Essayez une autre ville ou augmentez le prix maximum.',
              'جرّب مدينة أخرى أو ارفع السعر الأقصى.'
            )}
            action={
              hasFilters && (
                <Button variant="outline" onClick={reset}>
                  {L('Reset filters', 'Réinitialiser les filtres', 'إعادة تعيين المرشحات')}
                </Button>
              )
            }
          />
        ) : (
          <>
            <CardGrid>
              {listings.map((l) => (
                <ListingCard
                  key={l._id}
                  href={`/properties/${l._id}`}
                  image={l.images?.[0] || '/placeholder.jpg'}
                  title={l.title}
                  badge={l.type}
                  meta={[{ icon: MapPin, text: l.address || l.city }]}
                  rating={l.rating || 0}
                  reviews={l.reviews || 0}
                  newLabel={L('New', 'Nouveau', 'جديد')}
                  {...priceProps(l)}
                />
              ))}
            </CardGrid>

            <Pager
              page={page}
              totalPages={totalPages}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              prevLabel={L('Previous', 'Précédent', 'السابق')}
              nextLabel={L('Next', 'Suivant', 'التالي')}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function StudentHousingPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16">
          <CardSkeletonGrid />
        </div>
      }
    >
      <StudentHousingContent />
    </Suspense>
  );
}