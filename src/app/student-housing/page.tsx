'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/moxbnb/Header';
import Footer from '@/components/moxbnb/Footer';
import PropertyCard from '@/components/moxbnb/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader } from 'lucide-react';

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

function StudentHousingContent() {
  const [listings, setListings] = useState<StudentListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalListings, setTotalListings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    city: '',
    pricingType: '',
    maxPrice: ''
  });

  const { t, language } = useLanguage();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchStudentListings();
  }, [filters, currentPage]);

  const fetchStudentListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      if (filters.city) params.append('city', filters.city);
      if (filters.pricingType) params.append('pricingType', filters.pricingType);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await fetch(`/api/listings/students?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setListings(data.data);
        setTotalListings(data.pagination.total);
      } else {
        setError(data.error || 'Failed to fetch listings');
      }
    } catch (err) {
      setError('Error fetching student listings');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalListings / 12);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t('properties.studentListings')}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Find accommodation options specifically curated for students'
              : language === 'fr'
              ? 'Trouvez des options de logement spécialement sélectionnées pour les étudiants'
              : 'ابحث عن خيارات الإقامة المحددة خصيصًا للطلاب'}
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Input
            placeholder={language === 'en' ? 'Search by city...' : language === 'fr' ? 'Rechercher par ville...' : 'البحث بالمدينة...'}
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          />

          <Select value={filters.pricingType || 'ALL'} onValueChange={(value) => handleFilterChange('pricingType', value === 'ALL' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder={language === 'en' ? 'Pricing Type' : language === 'fr' ? 'Type de prix' : 'نوع السعر'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                {language === 'en' ? 'All Types' : language === 'fr' ? 'Tous les types' : 'جميع الأنواع'}
              </SelectItem>
              <SelectItem value="NIGHTLY">
                {t('properties.nightly')}
              </SelectItem>
              <SelectItem value="MONTHLY">
                {t('properties.monthly')}
              </SelectItem>
              <SelectItem value="BOTH">
                {t('properties.both')}
              </SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder={language === 'en' ? 'Max Price (DT)' : language === 'fr' ? 'Prix Max (DT)' : 'السعر الأقصى (DT)'}
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />

          <Button 
            variant="outline"
            onClick={() => setFilters({ city: '', pricingType: '', maxPrice: '' })}
          >
            {language === 'en' ? 'Reset' : language === 'fr' ? 'Réinitialiser' : 'إعادة تعيين'}
          </Button>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="h-8 w-8 animate-spin text-rose-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            {error}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'No student accommodations found with these filters'
                : language === 'fr'
                ? 'Aucun logement étudiant trouvé avec ces filtres'
                : 'لم يتم العثور على إقامات طلابية بهذه المرشحات'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {listings.map((listing) => (
                <PropertyCard
                  key={listing._id}
                  id={listing._id}
                  title={listing.title}
                  type={listing.type}
                  location={listing.address}
                  price={listing.price}
                  monthlyPrice={listing.monthlyPrice}
                  pricingType={listing.pricingType}
                  rating={listing.rating || 0}
                  reviews={listing.reviews || 0}
                  image={listing.images[0] || '/placeholder.jpg'}
                  targetAudience={listing.targetAudience}
                  latitude={listing.latitude}
                  longitude={listing.longitude}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  {language === 'en' ? 'Previous' : language === 'fr' ? 'Précédent' : 'السابق'}
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  {language === 'en' ? 'Next' : language === 'fr' ? 'Suivant' : 'التالي'}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function StudentHousingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-rose-600 mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    }>
      <StudentHousingContent />
    </Suspense>
  );
}
