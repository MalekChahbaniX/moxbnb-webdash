'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { fetchListingById, mapListingStatusToUi, resolveMediaUrl } from '@/services/hostService';

export default function HostListingDetailPage() {
  const params = useParams();
  const id = String(params?.id || '');
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let c = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchListingById(id);
        if (c) return;
        setListing(data);
        setError(null);
      } catch (e: any) {
        if (!c) setError(e?.message || 'Erreur');
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, [id]);

  const hostId = listing?.hostId?._id ? String(listing.hostId._id) : listing?.hostId ? String(listing.hostId) : '';
  const isOwner = user?.id && hostId && user.id === hostId;

  if (loading) {
    return (
      <div className="flex justify-center py-24 gap-2 text-gray-600">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <Card className="max-w-lg border-red-200 bg-red-50">
        <CardContent className="pt-6 text-red-800">{error || 'Introuvable'}</CardContent>
      </Card>
    );
  }

  if (!isOwner) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-800">Vous n&apos;avez pas accès à cette annonce.</p>
          <Link href="/host/listings" className="mt-4 inline-block">
            <Button variant="outline">Retour à mes propriétés</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const ui = mapListingStatusToUi(listing.status);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/host/listings">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <Link href={`/host/listings/${id}/edit`}>
          <Button className="bg-rose-600 hover:bg-rose-700">Modifier</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle className="text-2xl">{listing.title}</CardTitle>
              <CardDescription>
                {listing.city}, {listing.country}
              </CardDescription>
            </div>
            <Badge variant={ui === 'active' ? 'default' : 'secondary'}>
              {ui === 'active' ? 'Publiée' : ui === 'pending' ? 'Brouillon' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {listing.images?.[0] && (
            <img
              src={resolveMediaUrl(listing.images[0])}
              alt=""
              className="w-full max-h-80 object-cover rounded-lg bg-gray-100"
            />
          )}
          <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Prix / nuit</span>
              <p className="font-semibold">
                {listing.price} {listing.currency || 'TND'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Voyageurs max</span>
              <p className="font-semibold">{listing.maxGuests}</p>
            </div>
            <div>
              <span className="text-gray-500">Chambres</span>
              <p className="font-semibold">{listing.bedrooms ?? '—'}</p>
            </div>
            <div>
              <span className="text-gray-500">Adresse</span>
              <p className="font-semibold">{listing.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
