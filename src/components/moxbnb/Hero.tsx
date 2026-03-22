'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  const [destination, setDestination] = useState('');
  const { t } = useLanguage();

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-orange-900 to-amber-900">
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {t('hero.title')}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow">
          {t('hero.subtitle')}
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Destination */}
            <div className="relative">
              <div className="flex items-center border rounded-lg px-3 py-2">
                <MapPin className="h-5 w-5 text-rose-600 mr-2" />
                <Input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="border-0 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Check In */}
            <div className="relative">
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Calendar className="h-5 w-5 text-rose-600 mr-2" />
                <Input
                  type="date"
                  placeholder={t('common.checkIn')}
                  className="border-0 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Check Out */}
            <div className="relative">
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Calendar className="h-5 w-5 text-rose-600 mr-2" />
                <Input
                  type="date"
                  placeholder={t('common.checkOut')}
                  className="border-0 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Guests & Search */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center border rounded-lg px-3 py-2 flex-1">
                <Users className="h-5 w-5 text-rose-600 mr-2" />
                <Input
                  type="number"
                  placeholder="2 {t('common.guests')}"
                  min={1}
                  defaultValue={2}
                  className="border-0 focus-visible:ring-0"
                />
              </div>
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700 px-6">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
