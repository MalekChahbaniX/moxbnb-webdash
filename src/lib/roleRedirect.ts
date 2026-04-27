import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified?: boolean;
  avatar?: string;
  phone?: string;
}

/**
 * Redirects user to appropriate dashboard based on their role
 * @param router - Next.js router instance
 * @param user - User object with role
 * @param refresh - Whether to refresh the page after redirect
 */
export const redirectByRole = (
  router: AppRouterInstance,
  user: User | null,
  refresh: boolean = true
) => {
  if (!user) {
    router.push('/');
    if (refresh) router.refresh();
    return;
  }

  const routes: Record<string, string> = {
    ADMIN: '/admin',
    HOST: '/host/dashboard',
    PROVIDER: '/provider/dashboard',
    CLIENT: '/',
    GUEST: '/'
  };

  const redirectPath = routes[user.role] || '/';
  router.push(redirectPath);
  
  if (refresh) {
    router.refresh();
  }
};

/**
 * Gets the redirect path for a given role
 * @param role - User role
 * @returns Redirect path
 */
export const getRedirectPathByRole = (role: string): string => {
  const routes: Record<string, string> = {
    ADMIN: '/admin',
    HOST: '/host/dashboard',
    PROVIDER: '/provider/dashboard',
    CLIENT: '/',
    GUEST: '/'
  };

  return routes[role] || '/';
};

/**
 * Gets the user from localStorage
 * @returns User object or null
 */
export const getUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from storage:', error);
    return null;
  }
};
