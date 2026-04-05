'use client';

import { Sidebar } from '@/components/host/Sidebar';
import { Header } from '@/components/host/Header';
import { HostGuard } from '@/components/auth/AuthGuard';

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HostGuard>
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
    </HostGuard>
  );
}
