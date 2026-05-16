'use client';

import Header from '@/components/moxbnb/Header';
import Footer from '@/components/moxbnb/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PreferencesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{t('profile.preferences')}</h1>
            <p className="text-gray-600 mt-2">{t('profile.customizeExperience')}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('profile.preferences')}</CardTitle>
              <CardDescription>{t('profile.customizeExperience')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{t('profile.preferences')} content goes here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
