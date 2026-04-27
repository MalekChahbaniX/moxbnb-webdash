import { api, getMediaBaseUrl } from '@/lib/api';

const PLACEHOLDER = 'https://placehold.co/400x280/f1f5f9/64748b?text=MoxBnB';

export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return PLACEHOLDER;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const origin = getMediaBaseUrl();
  return url.startsWith('/') ? `${origin}${url}` : `${origin}/${url}`;
}

export type UiItemStatus = 'active' | 'inactive' | 'pending';

export function mapItemStatusToUi(status: string): UiItemStatus {
  if (status === 'PUBLISHED') return 'active';
  if (status === 'DRAFT') return 'pending';
  return 'inactive';
}

// ============================================
// PROVIDER DASHBOARD
// ============================================

export async function fetchProviderDashboard() {
  const { data } = await api.get('/provider/dashboard');
  if (!data.success) throw new Error((data as any).error || 'Dashboard error');
  return data.data;
}

export async function fetchProviderEarnings(period: string = 'month') {
  const { data } = await api.get('/provider/earnings', { params: { period } });
  if (!data.success) throw new Error((data as any).error || 'Earnings error');
  return data.data;
}

export async function fetchProviderBookings(params?: { status?: string; page?: number; limit?: number }) {
  const { data } = await api.get('/provider/bookings', {
    params: { ...params, limit: params?.limit ?? 100 },
  });
  if (!data.success) throw new Error((data as any).error || 'Bookings error');
  return { items: data.data as any[], pagination: data.pagination };
}

export async function updateProviderBookingStatus(bookingId: string, status: string) {
  const { data } = await api.put(`/provider/bookings/${bookingId}/status`, { status });
  if (!data.success) throw new Error((data as any).error || 'Mise à jour impossible');
  return data.data;
}

export async function fetchProviderClients() {
  const { data } = await api.get('/provider/clients');
  if (!data.success) throw new Error((data as any).error || 'Clients error');
  return data.data as any[];
}

// ============================================
// SERVICES MANAGEMENT
// ============================================

export async function fetchMyServices(params?: { status?: string; search?: string; page?: number; limit?: number }) {
  const { data } = await api.get('/services/my', { params });
  if (!data.success) throw new Error((data as any).error || 'Services error');
  return { items: data.data, pagination: data.pagination };
}

export async function fetchServiceById(id: string) {
  const { data } = await api.get(`/services/${id}`);
  if (!data.success) throw new Error((data as any).error || 'Service introuvable');
  return (data as any).data?.service ?? (data as any).data;
}

export async function createService(service: {
  title: string;
  description: string;
  category: string;
  price: number;
  currency?: string;
  duration: number;
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  images: string[];
  status?: string;
  latitude?: number;
  longitude?: number;
}) {
  const { data } = await api.post('/services', service);
  if (!data.success) throw new Error((data as any).error || 'Création service échouée');
  return data.data;
}

export async function updateServiceApi(id: string, service: Record<string, unknown>) {
  const { data } = await api.put(`/services/${id}`, service);
  if (!data.success) throw new Error((data as any).error || 'Mise à jour impossible');
  return data.data;
}

export async function deleteService(id: string) {
  const { data } = await api.delete(`/services/${id}`);
  if (!data.success) throw new Error((data as any).error || 'Suppression impossible');
  return data;
}

// ============================================
// EXPERIENCES MANAGEMENT
// ============================================

export async function fetchMyExperiences(params?: { status?: string; search?: string; page?: number; limit?: number }) {
  const { data } = await api.get('/experiences/my', { params });
  if (!data.success) throw new Error((data as any).error || 'Experiences error');
  return { items: data.data, pagination: data.pagination };
}

export async function fetchExperienceById(id: string) {
  const { data } = await api.get(`/experiences/${id}`);
  if (!data.success) throw new Error((data as any).error || 'Expérience introuvable');
  return (data as any).data?.experience ?? (data as any).data;
}

export async function createExperience(experience: {
  title: string;
  description: string;
  category: string;
  price: number;
  currency?: string;
  duration: number;
  maxGuests: number;
  location: string;
  address: string;
  city: string;
  country?: string;
  images: string[];
  includes?: string[];
  requirements?: string[];
  difficulty?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
}) {
  const { data } = await api.post('/experiences', experience);
  if (!data.success) throw new Error((data as any).error || 'Création expérience échouée');
  return data.data;
}

export async function updateExperienceApi(id: string, experience: Record<string, unknown>) {
  const { data } = await api.put(`/experiences/${id}`, experience);
  if (!data.success) throw new Error((data as any).error || 'Mise à jour impossible');
  return data.data;
}

export async function deleteExperience(id: string) {
  const { data } = await api.delete(`/experiences/${id}`);
  if (!data.success) throw new Error((data as any).error || 'Suppression impossible');
  return data;
}

// ============================================
// IMAGE UPLOAD
// ============================================

export async function uploadProviderImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'}/upload/multiple`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    return result.data.map((file: any) => file.url) as string[];
  } catch (error) {
    throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================
// UTILITIES
// ============================================

export function bookingToUiRow(b: any) {
  const listing = b.listingId;
  const exp = b.experienceId;
  const svc = b.serviceId;
  const guest = b.userId;
  const title = listing?.title || exp?.title || svc?.title || 'Réservation';
  const guestName = guest
    ? [guest.firstName, guest.lastName].filter(Boolean).join(' ').trim() || 'Voyageur'
    : 'Voyageur';

  const st0 = String(b.status || '').toLowerCase();
  const st =
    st0 === 'refunded'
      ? 'cancelled'
      : st0 === 'pending'
        ? 'pending'
        : st0 === 'confirmed'
          ? 'confirmed'
          : st0 === 'completed'
            ? 'completed'
            : st0 === 'cancelled'
              ? 'cancelled'
              : st0;
  const pay = String(b.paymentStatus || '').toLowerCase();

  return {
    id: String(b._id),
    itemTitle: title,
    clientName: guestName,
    clientEmail: guest?.email || '',
    clientPhone: guest?.phone || '',
    date: b.checkIn,
    guests: b.guests,
    totalPrice: b.totalPrice,
    status: st,
    paymentStatus: pay === 'completed' ? 'paid' : 'pending',
    createdAt: b.createdAt,
    specialRequests: b.specialRequests || '',
    raw: b,
  };
}
