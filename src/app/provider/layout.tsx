'use client';

import { Sidebar } from '@/components/provider/Sidebar';
import { Header } from '@/components/provider/Header';
import { ProviderGuard } from '@/components/auth/AuthGuard';

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProviderGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="pl-64">
          <Header />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </ProviderGuard>
  );
}
