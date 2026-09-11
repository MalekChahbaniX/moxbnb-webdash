'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Header from '@/components/moxbnb/Header';
import Footer from '@/components/moxbnb/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const sectionNumbers = Array.from({ length: 11 }, (_, index) => index + 1);

export default function PrivacyPolicyPage() {
  const { language, t } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/60 via-background to-background">
      <Header />
      <main className="flex-1 py-10 sm:py-14">
        <article className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-8 rounded-2xl border border-rose-100 bg-white/80 p-6 shadow-sm sm:p-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">Moxbnb</p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">{t('privacyPolicy.title')}</h1>
            <p className="mt-3 text-sm text-muted-foreground">{t('privacyPolicy.lastUpdated')}</p>
            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-700">{t('privacyPolicy.intro')}</p>
            <p className="mt-5 text-sm leading-6 text-gray-700">
              {t('privacyPolicy.contactLabel')}{' '}
              <a className="font-semibold text-rose-600 hover:underline" href={`mailto:${t('privacyPolicy.contactEmail')}`}>
                {t('privacyPolicy.contactEmail')}
              </a>
              .
            </p>
          </div>

          <div className="space-y-4">
            {sectionNumbers.map((number) => (
              <section key={number} className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-gray-950">{t(`privacyPolicy.section${number}Title`)}</h2>
                <p className="mt-3 leading-7 text-gray-700">{t(`privacyPolicy.section${number}Body`)}</p>
              </section>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <Link href="/" className="font-medium text-rose-600 hover:underline">
              {t('nav.home')}
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}