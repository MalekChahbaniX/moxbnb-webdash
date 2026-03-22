'use client';

import { Home, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HostCTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-rose-600 to-orange-600 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Devenez hôte sur Moxbnb
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Gagnez un revenu supplémentaire en proposant votre logement, vos expériences ou vos services professionnels sur notre plateforme.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Logements</h4>
                  <p className="text-sm opacity-80">Appartements, maisons, villas</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Revenus</h4>
                  <p className="text-sm opacity-80">Gagnez de l'argent</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Calendrier</h4>
                  <p className="text-sm opacity-80">Gérez vos disponibilités</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Support</h4>
                  <p className="text-sm opacity-80">Assistance 24/7</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-100">
              Commencer à accueillir
            </Button>
          </div>

          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
              alt="Devenir hôte"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
