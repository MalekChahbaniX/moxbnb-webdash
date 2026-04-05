'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export function AuthGuard({ children, requiredRole, redirectTo = '/login' }: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      switch (user?.role) {
        case 'ADMIN':
          router.push('/admin');
          break;
        case 'HOST':
          router.push('/host/dashboard');
          break;
        case 'PROVIDER':
          router.push('/provider/dashboard');
          break;
        case 'CLIENT':
          router.push('/');
          break;
        default:
          router.push('/');
      }
      return;
    }
  }, [user, loading, isAuthenticated, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}

// Role-based auth guards
export function HostGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="HOST">{children}</AuthGuard>;
}

export function ProviderGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="PROVIDER">{children}</AuthGuard>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="ADMIN">{children}</AuthGuard>;
}
