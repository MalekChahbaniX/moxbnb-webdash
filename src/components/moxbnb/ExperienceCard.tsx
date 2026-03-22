'use client';

import { Star, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExperienceCardProps {
  id: string;
  title: string;
  category: string;
  host: string;
  duration: string;
  maxGuests: number;
  price: number;
  rating: number;
  reviews: number;
  image: string;
}

export default function ExperienceCard({
  id,
  title,
  category,
  host,
  duration,
  maxGuests,
  price,
  rating,
  reviews,
  image
}: ExperienceCardProps) {
  const { t } = useLanguage();

  return (
    <Link href={`/experiences/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
        <div className="relative h-56 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-xs uppercase tracking-wider opacity-90">{category}</p>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
            <Users className="h-4 w-4 ml-3 mr-1" />
            {maxGuests} max
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <span>par {host}</span>
          </div>
          
          <div className="flex items-baseline justify-between">
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{rating}</span>
              <span className="text-muted-foreground ml-1">({reviews} {t('common.reviews')})</span>
            </div>
            
            <div className="text-right">
              <span className="text-lg font-bold text-rose-600">{price} DT</span>
              <span className="text-muted-foreground text-sm block">/ personne</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button className="w-full bg-rose-600 hover:bg-rose-700">
            {t('experiences.bookNow')}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
