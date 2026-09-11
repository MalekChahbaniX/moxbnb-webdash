'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PublicInfoPageProps {
  translationPrefix: string;
  sectionCount: number;
}

export default function PublicInfoPage({ translationPrefix, sectionCount }: PublicInfoPageProps) {
  const { language, t } = useLanguage();
  const sectionNumbers = Array.from({ length: sectionCount }, (_, index) => index + 1);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/60 via-background to-background">
      <main className="flex-1 py-10 sm:py-14">
        <article className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-8 rounded-2xl border border-rose-100 bg-white/80 p-6 shadow-sm sm:p-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">Moxbnb</p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">{t(`${translationPrefix}.title`)}</h1>
            {t(`${translationPrefix}.lastUpdated`) !== `${translationPrefix}.lastUpdated` && (
              <p className="mt-3 text-sm text-muted-foreground">{t(`${translationPrefix}.lastUpdated`)}</p>
            )}
            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-700">{t(`${translationPrefix}.intro`)}</p>
          </div>
          <div className="space-y-4">
            {sectionNumbers.map((number) => (
              <section key={number} className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-gray-950">{t(`${translationPrefix}.section${number}Title`)}</h2>
                <p className="mt-3 leading-7 text-gray-700">{t(`${translationPrefix}.section${number}Body`)}</p>
              </section>
            ))}
          </div>
          <div className="mt-8 text-center text-sm">
            <Link href="/" className="font-medium text-rose-600 hover:underline">{t('nav.home')}</Link>
          </div>
        </article>
      </main>
    </div>
  );
}