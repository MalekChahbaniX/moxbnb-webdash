'use client';

import { MapPin, Star, Map } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface PropertyCardProps {
  id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  monthlyPrice?: number;
  pricingType?: 'NIGHTLY' | 'MONTHLY' | 'BOTH';
  rating: number;
  reviews: number;
  image: string;
  targetAudience?: 'GENERAL' | 'STUDENTS' | 'FAMILIES' | 'PROFESSIONALS';
  latitude?: number;
  longitude?: number;
}

export default function PropertyCard({
  id,
  title,
  type,
  location,
  price,
  monthlyPrice,
  pricingType = 'NIGHTLY',
  rating,
  reviews,
  image,
  targetAudience = 'GENERAL',
  latitude,
  longitude
}: PropertyCardProps) {
  const { t, language } = useLanguage();

  const handleViewOnMap = (e: any) => {
    e.preventDefault();
    if (latitude && longitude) {
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(mapsUrl, '_blank');
    }
  };

  const displayPrice = () => {
    if (pricingType === 'NIGHTLY') {
      return <span className="text-muted-foreground text-sm ml-1">/ {t('properties.perNight')}</span>;
    } else if (pricingType === 'MONTHLY') {
      return <span className="text-muted-foreground text-sm ml-1">/ {t('properties.perMonth')}</span>;
    } else if (pricingType === 'BOTH') {
      return (
        <div className="text-sm text-muted-foreground ml-1">
          <div>{price} DT / {t('properties.perNight')}</div>
          {monthlyPrice && <div>{monthlyPrice} DT / {t('properties.perMonth')}</div>}
        </div>
      );
    }
  };

  return (
    <Link href={`/properties/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
            <Badge className="bg-white text-black hover:bg-white">
              {type}
            </Badge>
            {targetAudience === 'STUDENTS' && (
              <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                {language === 'en' ? '🎓 Student' : language === 'fr' ? '🎓 Étudiant' : '🎓 طالب'}
              </Badge>
            )}
          </div>
          {latitude && longitude && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute bottom-2 right-2 bg-white/90 hover:bg-white"
              onClick={handleViewOnMap}
            >
              <Map className="h-4 w-4 mr-1" />
              {t('properties.viewMap') || 'Map'}
            </Button>
          )}
        </div>
        
        <CardContent className="p-4 flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{rating || 0}</span>
              <span className="text-muted-foreground ml-1">({reviews || 0})</span>
            </div>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </div>
          
          <div className="flex items-baseline flex-wrap">
            <span className="text-xl font-bold text-rose-600">{price} DT</span>
            {displayPrice()}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button className="w-full bg-rose-600 hover:bg-rose-700">
            {t('properties.viewDetails')}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
