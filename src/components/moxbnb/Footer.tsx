'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

// TODO: replace the "#" placeholders with the real social profile URLs.
const SOCIALS = [
  { label: 'Facebook', href: '#', icon: Facebook },
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'Twitter', href: '#', icon: Twitter },
];

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: FormEvent) => {
    event.preventDefault();
    // TODO: send `email` to the newsletter endpoint (nothing is stored yet, as before).
    setSubscribed(true);
    setEmail('');
  };

  const linkCls =
    'text-slate-600 underline-offset-4 hover:text-sky-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 rounded-sm';

  return (
    <footer className="mt-auto border-t bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="Moxbnb"
              className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-2xl font-bold text-transparent"
            >
              Moxbnb
            </Link>
            <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-slate-600">
              La plateforme nationale de locations et expériences en Tunisie
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-sky-900 hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore: real pages, so it works from any route (the old #anchors only worked on the home page) */}
          <nav aria-label={t('footer.quickLinks')}>
            <h2 className="text-sm font-semibold text-slate-900">{t('footer.quickLinks')}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/properties" className={linkCls}>{t('nav.properties')}</Link></li>
              <li><Link href="/student-housing" className={linkCls}>{t('properties.studentHousing')}</Link></li>
              <li><Link href="/experiences" className={linkCls}>{t('nav.experiences')}</Link></li>
              <li><Link href="/services" className={linkCls}>{t('nav.services')}</Link></li>
              <li><Link href="/signup/host" className={linkCls}>{t('footer.becomeHost')}</Link></li>
              <li><Link href="/help-center" className={linkCls}>{t('footer.helpCenter')}</Link></li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{t('footer.contact')}</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-900" aria-hidden />
                <span>Tunis, Tunisie</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-sky-900" aria-hidden />
                <a href="tel:+21628653396" className={linkCls} dir="ltr">
                  +216 28 653 396
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-sky-900" aria-hidden />
                <a href="mailto:contact@moxbnb.com" className={linkCls}>
                  contact@moxbnb.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{t('footer.newsletter')}</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{t('footer.newsletterText')}</p>
            <form className="mt-4 flex gap-2" onSubmit={handleSubscribe}>
              <label htmlFor="footer-email" className="sr-only">
                {t('footer.emailPlaceholder')}
              </label>
              <Input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (subscribed) setSubscribed(false);
                }}
                placeholder={t('footer.emailPlaceholder')}
                className="h-10 flex-1 rounded-full bg-white px-4"
              />
              <Button type="submit" className="h-10 rounded-full bg-rose-600 px-5 hover:bg-rose-700">
                {t('footer.subscribe')}
              </Button>
            </form>
            {subscribed && (
              <p className="mt-2 text-xs text-emerald-700" role="status">
                {t('footer.subscribed')}
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} Moxbnb. Tous droits réservés.</p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <li><Link href="/privacy-policy" className={linkCls}>{t('privacyPolicy.title')}</Link></li>
            <li><Link href="/terms" className={linkCls}>{t('footer.terms')}</Link></li>
            <li><Link href="/cookie-policy" className={linkCls}>{t('footer.cookies')}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}