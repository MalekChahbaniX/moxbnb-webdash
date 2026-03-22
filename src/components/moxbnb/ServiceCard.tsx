'use client';

import { Star, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceCardProps {
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

export default function ServiceCard({
  id,
  title,
  provider,
  type,
  location,
  duration,
  price,
  rating,
  reviews,
  available,
  image
}: ServiceCardProps) {
  const { t } = useLanguage();

  return (
    <Link href={`/services/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {available ? (
            <Badge className="absolute top-2 right-2 bg-green-600">
              Disponible
            </Badge>
          ) : (
            <Badge className="absolute top-2 right-2 bg-muted-foreground">
              Non disponible
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">{type}</Badge>
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{rating}</span>
              <span className="text-muted-foreground ml-1">({reviews})</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
          
          <p className="text-sm text-muted-foreground mb-3">par {provider}</p>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </div>
          
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-rose-600">{price} DT</span>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full bg-rose-600 hover:bg-rose-700"
            disabled={!available}
          >
            {available ? t('services.bookService') : 'Non disponible'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
