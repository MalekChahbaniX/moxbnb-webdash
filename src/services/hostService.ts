import { api, getMediaBaseUrl } from '@/lib/api';

const PLACEHOLDER = 'https://placehold.co/400x280/f1f5f9/64748b?text=MoxBnB';

export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return PLACEHOLDER;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const origin = getMediaBaseUrl();
  return url.startsWith('/') ? `${origin}${url}` : `${origin}/${url}`;
}

export type UiListingStatus = 'active' | 'inactive' | 'pending';

export function mapListingStatusToUi(status: string): UiListingStatus {
  if (status === 'PUBLISHED') return 'active';
  if (status === 'DRAFT' || status === 'SUSPENDED') return 'pending';
  return 'inactive';
}

export function mapUiStatusToApiFilter(ui: string): string {
  if (ui === 'active') return 'active';
  if (ui === 'inactive') return 'inactive';
  if (ui === 'pending') return 'pending';
  return 'all';
}

export async function fetchHostDashboard() {
  const { data } = await api.get('/provider/dashboard');
  if (!data.success) throw new Error((data as any).error || 'Dashboard error');
  return data.data;
}

export async function fetchMyListings(params?: { status?: string; search?: string; page?: number; limit?: number }) {
  const { data } = await api.get('/listings/my', { params });
  if (!data.success) throw new Error((data as any).error || 'Listings error');
  return { items: data.data, pagination: data.pagination };
}

export async function deleteListing(id: string) {
  const { data } = await api.delete(`/listings/${id}`);
  if (!data.success) throw new Error((data as any).error || 'Suppression impossible');
  return data;
}

export async function fetchListingById(id: string) {
  const { data } = await api.get(`/listings/${id}`);
  if (!data.success) throw new Error((data as any).error || 'Annonce introuvable');
  return (data as any).data?.listing ?? (data as any).data;
}

export async function updateListingApi(id: string, body: Record<string, unknown>) {
  const { data } = await api.put(`/listings/${id}`, body);
  if (!data.success) throw new Error((data as any).error || 'Mise à jour impossible');
  return data.data;
}

export async function fetchHostBookings(params?: { status?: string; page?: number; limit?: number }) {
  const { data } = await api.get('/provider/bookings', {
    params: { ...params, limit: params?.limit ?? 100 },
  });
  if (!data.success) throw new Error((data as any).error || 'Bookings error');
  return { items: data.data as any[], pagination: data.pagination };
}

const STATUS_MAP: Record<string, string> = {
  pending: 'PENDING',
  confirmed: 'CONFIRMED',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
};

export async function updateHostBookingStatus(bookingId: string, uiStatus: string) {
  const status = STATUS_MAP[uiStatus.toLowerCase()] || uiStatus.toUpperCase();
  const { data } = await api.put(`/provider/bookings/${bookingId}/status`, { status });
  if (!data.success) throw new Error((data as any).error || 'Mise à jour impossible');
  return data.data;
}

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
    propertyTitle: title,
    clientName: guestName,
    clientEmail: guest?.email || '',
    clientPhone: guest?.phone || '',
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    guests: b.guests,
    totalPrice: b.totalPrice,
    status: st,
    paymentStatus: pay === 'completed' ? 'paid' : 'pending',
    createdAt: b.createdAt,
    specialRequests: b.specialRequests || '',
    raw: b,
  };
}

export async function fetchHostEarnings(period: string = 'month') {
  const { data } = await api.get('/provider/earnings', { params: { period } });
  if (!data.success) throw new Error((data as any).error || 'Earnings error');
  return data.data;
}

export async function fetchHostClients() {
  const { data } = await api.get('/provider/clients');
  if (!data.success) throw new Error((data as any).error || 'Clients error');
  return data.data as any[];
}

export type ConversationSummary = {
  id: string;
  userName: string;
  userAvatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  listingTitle?: string;
};

export async function fetchConversations(): Promise<ConversationSummary[]> {
  const { data } = await api.get('/messages/conversations');
  if (!data.success) throw new Error((data as any).error || 'Messages error');
  const rows = data.data as any[];
  return rows.map((c) => ({
    id: c.userId || c.id,
    userName: c.userName || 'Utilisateur',
    userAvatar: c.userAvatar,
    lastMessage: c.lastMessage || '',
    lastMessageTime: c.lastMessageTime,
    unreadCount: c.unreadCount || 0,
    listingTitle: c.listingTitle,
  }));
}

export async function fetchMessageThread(otherUserId: string) {
  const { data } = await api.get(`/messages/thread/${otherUserId}`);
  if (!data.success) throw new Error((data as any).error || 'Thread error');
  return (data.data?.messages || []) as {
    id: string;
    content: string;
    createdAt: string;
    isMine: boolean;
  }[];
}

export async function sendHostMessage(receiverId: string, content: string, bookingId?: string) {
  const { data } = await api.post('/messages', { receiverId, content, type: 'TEXT', bookingId });
  if (!data.success) throw new Error((data as any).error || 'Envoi impossible');
  return data.data;
}

export async function markConversationRead(otherUserId: string) {
  await api.patch(`/messages/conversations/${otherUserId}/read`, {});
}

/**
 * Upload listing images to the server
 * @param files - Array of File objects to upload
 * @returns Array of image URLs
 */
export async function uploadListingImages(files: File[]): Promise<string[]> {
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

/**
 * Create a new listing with images
 * @param listing - Listing data with images as URLs
 * @returns Created listing
 */
export async function createListing(listing: {
  title: string;
  description: string;
  type: string;
  category: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests: number;
  address: string;
  city: string;
  country: string;
  images: string[];
  amenities?: string[];
  rules?: string[];
  status?: string;
  latitude?: number;
  longitude?: number;
}) {
  const { data } = await api.post('/listings', listing);
  if (!data.success) {
    throw new Error((data as any).error || 'Failed to create listing');
  }
  return data.data;
}
