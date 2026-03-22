'use client';

import { useState } from 'react';
import Header from '@/components/moxbnb/Header';
import Hero from '@/components/moxbnb/Hero';
import PropertiesSection from '@/components/moxbnb/PropertiesSection';
import ExperiencesSection from '@/components/moxbnb/ExperiencesSection';
import ServicesSection from '@/components/moxbnb/ServicesSection';
import CommunitySection from '@/components/moxbnb/CommunitySection';
import HostCTASection from '@/components/moxbnb/HostCTASection';
import Footer from '@/components/moxbnb/Footer';
import Dashboard from '@/components/moxbnb/Dashboard';

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        <PropertiesSection />
        <ExperiencesSection />
        <ServicesSection />
        <CommunitySection />
        <HostCTASection />
      </main>

      <Footer />
    </div>
  );
}
