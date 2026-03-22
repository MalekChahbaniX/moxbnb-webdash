'use client';

import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent mb-4">
              Moxbnb
            </h3>
            <p className="text-muted-foreground mb-4">
              La plateforme nationale de locations et expériences en Tunisie
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-rose-600 cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-rose-600 cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-rose-600 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#properties" className="text-muted-foreground hover:text-rose-600">{t('nav.properties')}</a></li>
              <li><a href="#experiences" className="text-muted-foreground hover:text-rose-600">{t('nav.experiences')}</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-rose-600">{t('nav.services')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-rose-600">Devenir Hôte</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-rose-600">Centre d'aide</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>Tunis, Tunisie</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+216 71 123 456</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>contact@moxbnb.tn</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Recevez nos meilleures offres et destinations
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Votre email"
                className="flex-1"
              />
              <Button className="bg-rose-600 hover:bg-rose-700">
                S'inscrire
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 Moxbnb. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-rose-600">Confidentialité</a>
            <a href="#" className="hover:text-rose-600">Conditions</a>
            <a href="#" className="hover:text-rose-600">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
