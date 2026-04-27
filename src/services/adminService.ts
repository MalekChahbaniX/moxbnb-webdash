'use client';

import { api } from '@/lib/api';

// ==================== LISTINGS ====================

export async function getAllListings(filters?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await api.get(`/admin/listings?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPendingListings(page = 1, limit = 10) {
  try {
    const response = await api.get(`/admin/listings/pending?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getListingDetails(id: string) {
  try {
    const response = await api.get(`/admin/listings/${id}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveListing(id: string) {
  try {
    const response = await api.put(`/admin/listings/${id}/approve`, {});
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectListing(id: string, reason: string) {
  try {
    const response = await api.put(`/admin/listings/${id}/reject`, { reason });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ==================== SERVICES ====================

export async function getAllServices(filters?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await api.get(`/admin/services?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPendingServices(page = 1, limit = 10) {
  try {
    const response = await api.get(`/admin/services/pending?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getServiceDetails(id: string) {
  try {
    const response = await api.get(`/admin/services/${id}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveService(id: string) {
  try {
    const response = await api.put(`/admin/services/${id}/approve`, {});
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectService(id: string, reason: string) {
  try {
    const response = await api.put(`/admin/services/${id}/reject`, { reason });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ==================== EXPERIENCES ====================

export async function getAllExperiences(filters?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await api.get(`/admin/experiences?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPendingExperiences(page = 1, limit = 10) {
  try {
    const response = await api.get(`/admin/experiences/pending?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getExperienceDetails(id: string) {
  try {
    const response = await api.get(`/admin/experiences/${id}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveExperience(id: string) {
  try {
    const response = await api.put(`/admin/experiences/${id}/approve`, {});
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectExperience(id: string, reason: string) {
  try {
    const response = await api.put(`/admin/experiences/${id}/reject`, { reason });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ==================== USERS ====================

export async function getAllUsers(filters?: {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserDetails(id: string) {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function banUser(id: string, reason: string) {
  try {
    const response = await api.put(`/admin/users/${id}/ban`, { reason });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function unbanUser(id: string) {
  try {
    const response = await api.put(`/admin/users/${id}/unban`, {});
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(id: string, role: string) {
  try {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ==================== REVIEWS ====================

export async function getFlaggedReviews(page = 1, limit = 10) {
  try {
    const response = await api.get(`/admin/reviews/flagged?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveReview(id: string) {
  try {
    const response = await api.put(`/admin/reviews/${id}/approve`, {});
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectReview(id: string) {
  try {
    const response = await api.put(`/admin/reviews/${id}/reject`, {});
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ==================== STATISTICS ====================

export async function getPlatformOverview() {
  try {
    const response = await api.get('/admin/statistics/overview');
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getRevenueStats() {
  try {
    const response = await api.get('/admin/statistics/revenue');
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserStats() {
  try {
    const response = await api.get('/admin/statistics/users');
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBookingStats() {
  try {
    const response = await api.get('/admin/statistics/bookings');
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAdminDashboard() {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ==================== UTILITIES ====================

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'banned':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusBadgeText(status: string): string {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'approved':
      return 'Approuvée';
    case 'rejected':
      return 'Rejetée';
    case 'active':
      return 'Actif';
    case 'banned':
      return 'Banni';
    default:
      return status;
  }
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('fr-TN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
