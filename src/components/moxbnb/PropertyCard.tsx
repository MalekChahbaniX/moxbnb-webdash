'use client';

import { MapPin, Star } from 'lucide-react';
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
  rating: number;
  reviews: number;
  image: string;
}

export default function PropertyCard({
  id,
  title,
  type,
  location,
  price,
  rating,
  reviews,
  image
}: PropertyCardProps) {
  const { t } = useLanguage();

  return (
    <Link href={`/properties/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 left-2 bg-white text-black hover:bg-white">
            {type}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{rating}</span>
              <span className="text-muted-foreground ml-1">({reviews})</span>
            </div>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </div>
          
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-rose-600">{price} DT</span>
            <span className="text-muted-foreground text-sm ml-1">
              / {t('properties.perNight')}
            </span>
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
