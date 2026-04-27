'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { fetchListingById, updateListingApi } from '@/services/hostService';

export default function HostListingEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || '');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listing, setListing] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [status, setStatus] = useState<string>('DRAFT');

  useEffect(() => {
    if (!id) return;
    let c = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchListingById(id);
        if (c) return;
        setListing(data);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setPrice(String(data.price ?? ''));
        setCity(data.city || '');
        setAddress(data.address || '');
        setMaxGuests(String(data.maxGuests ?? ''));
        setStatus(data.status || 'DRAFT');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    try {
      setSaving(true);
      await updateListingApi(id, {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        city: city.trim(),
        address: address.trim(),
        maxGuests: Number(maxGuests),
        status,
      });
      router.push(`/host/listings/${id}`);
    } catch (err: any) {
      alert(err?.message || 'Enregistrement impossible');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  if (error || !listing) {
    return <p className="text-red-600">{error || 'Introuvable'}</p>;
  }

  if (!isOwner) {
    return <p className="text-gray-800">Accès refusé.</p>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/host/listings/${id}`}>
          <Button variant="outline" size="sm" type="button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Modifier l&apos;annonce</CardTitle>
            <CardDescription>Les champs doivent respecter les règles du serveur (titre ≥ 10 car., description ≥ 50 car.).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required minLength={10} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                minLength={50}
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix / nuit</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxGuests">Voyageurs max</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  min={1}
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Brouillon</SelectItem>
                  <SelectItem value="PUBLISHED">Publiée</SelectItem>
                  <SelectItem value="SUSPENDED">Suspendue</SelectItem>
                  <SelectItem value="ARCHIVED">Archivée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="bg-rose-600 hover:bg-rose-700" disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
