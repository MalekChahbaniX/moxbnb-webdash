'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/provider/Sidebar';
import { Header } from '@/components/provider/Header';
import { ProviderGuard } from '@/components/auth/AuthGuard';

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProviderGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <div className="md:pl-64 flex flex-col min-h-screen">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProviderGuard>
  );
}