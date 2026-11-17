'use client';

import { FormEvent, useEffect, useState } from 'react';
import { BadgePercent, CalendarClock, Check, LoaderCircle, Pencil, Pause, Play, Plus, Tag, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Offer = {
  id: string;
  type: 'PROPERTY' | 'EXPERIENCE' | 'SERVICE';
  title: string;
  image?: string;
  price: number;
  currency: string;
  city?: string;
  promotionPercent: number;
  promotionStartDate?: string;
  promotionEndDate?: string;
  promotionStatus: 'ACTIVE' | 'SUSPENDED';
  ownerName?: string;
};

type PromoCode = {
  _id: string;
  code: string;
  description?: string;
  percent: number;
  startsAt: string;
  endsAt: string;
  maxRedemptions?: number;
  redemptionCount: number;
  status: 'ACTIVE' | 'SUSPENDED';
};

const typeLabels: Record<Offer['type'], string> = {
  PROPERTY: 'Hébergement',
  EXPERIENCE: 'Expérience',
  SERVICE: 'Service',
};

const toLocalDateTime = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.';
}

export default function PromotionManager({ admin = false }: { admin?: boolean }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editingOffer, setEditingOffer] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [codeForm, setCodeForm] = useState({
    code: '',
    description: '',
    percent: '10',
    startsAt: '',
    endsAt: '',
    maxRedemptions: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [offersResponse, codesResponse] = await Promise.all([
        api.get('/promotions/mine'),
        admin ? api.get('/promotions/codes') : Promise.resolve(null),
      ]);
      setOffers(offersResponse.data?.data || []);
      if (admin) setCodes(codesResponse?.data?.data || []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    // Load once when the dashboard section opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  const saveOffer = async (event: FormEvent<HTMLFormElement>, offer: Offer) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setError('');
    try {
      await api.patch(`/promotions/offers/${offer.type}/${offer.id}`, {
        promotionPercent: Number(form.get('percent')),
        promotionStartDate: new Date(String(form.get('startsAt'))).toISOString(),
        promotionEndDate: new Date(String(form.get('endsAt'))).toISOString(),
      });
      setEditingOffer(null);
      setNotice('La promotion a été enregistrée.');
      await loadData();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  const updateOfferStatus = async (offer: Offer, promotionStatus?: Offer['promotionStatus'], remove = false) => {
    setSaving(true);
    setError('');
    try {
      await api.patch(`/promotions/offers/${offer.type}/${offer.id}`, remove
        ? { promotionPercent: null }
        : { promotionStatus });
      setNotice(remove ? 'La promotion a été supprimée.' : 'Le statut de la promotion a été mis à jour.');
      await loadData();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  const startCreateCode = () => {
    setEditingCode(null);
    setCodeForm({
      code: '',
      description: '',
      percent: '10',
      startsAt: '',
      endsAt: '',
      maxRedemptions: '',
    });
  };

  const startEditCode = (code: PromoCode) => {
    setEditingCode(code);
    setCodeForm({
      code: code.code,
      description: code.description || '',
      percent: String(code.percent),
      startsAt: toLocalDateTime(code.startsAt),
      endsAt: toLocalDateTime(code.endsAt),
      maxRedemptions: code.maxRedemptions == null ? '' : String(code.maxRedemptions),
    });
  };

  const saveCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        description: codeForm.description.trim(),
        percent: Number(codeForm.percent),
        startsAt: new Date(codeForm.startsAt).toISOString(),
        endsAt: new Date(codeForm.endsAt).toISOString(),
        maxRedemptions: codeForm.maxRedemptions ? Number(codeForm.maxRedemptions) : null,
      };
      if (editingCode) {
        await api.put(`/promotions/codes/${editingCode._id}`, payload);
        setNotice('Le code promo a été modifié.');
      } else {
        await api.post('/promotions/codes', { ...payload, code: codeForm.code.trim().toUpperCase() });
        setNotice('Le code promo a été créé.');
      }
      setEditingCode(null);
      startCreateCode();
      await loadData();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  const updateCodeStatus = async (code: PromoCode, status: PromoCode['status']) => {
    setSaving(true);
    setError('');
    try {
      await api.put(`/promotions/codes/${code._id}`, { status });
      setNotice('Le statut du code promo a été mis à jour.');
      await loadData();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  const deleteCode = async (code: PromoCode) => {
    if (!window.confirm(`Supprimer définitivement le code ${code.code} ?`)) return;
    setSaving(true);
    setError('');
    try {
      await api.delete(`/promotions/codes/${code._id}`);
      setNotice('Le code promo a été supprimé.');
      await loadData();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-sky-950 via-sky-900 to-indigo-900 px-6 py-8 text-white shadow-lg sm:px-9">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/10 p-3"><BadgePercent className="h-7 w-7" aria-hidden /></div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-200">Moxbnb · Marketing</p>
            <h1 className="mt-2 text-3xl font-bold">{admin ? 'Promotions et coupons' : 'Mes promotions'}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-100">
              {admin
                ? 'Supervisez les remises proposées par les hôtes et prestataires, et gérez les codes promotionnels globaux.'
                : 'Planifiez des remises sur vos offres. Elles apparaissent sur le site et dans l’application pendant leur période de validité.'}
            </p>
          </div>
        </div>
      </div>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</div>}

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{admin ? 'Promotions sur les offres' : 'Offres disponibles à promouvoir'}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {admin ? 'Vous pouvez suspendre ou retirer une remise, quelle que soit son origine.' : 'Chaque réduction est rattachée à une annonce, une expérience ou un service.'}
            </p>
          </div>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-900">{offers.length} offres</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><LoaderCircle className="h-7 w-7 animate-spin text-sky-800" /></div>
        ) : offers.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-sm text-slate-600">Aucune offre n’est disponible pour le moment.</CardContent></Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {offers.map((offer) => {
              const isEditing = editingOffer === `${offer.type}:${offer.id}`;
              const hasPromotion = offer.promotionPercent > 0;
              return (
                <Card key={`${offer.type}:${offer.id}`} className="overflow-hidden">
                  <div className="flex gap-4 p-5">
                    {offer.image ? (
                      <img src={offer.image} alt="" className="h-24 w-28 rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-24 w-28 items-center justify-center rounded-xl bg-slate-100 text-slate-400"><Tag className="h-7 w-7" /></div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{typeLabels[offer.type]}</span>
                        {hasPromotion && <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${offer.promotionStatus === 'SUSPENDED' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>{offer.promotionStatus === 'SUSPENDED' ? 'Suspendue' : `${offer.promotionPercent}% de remise`}</span>}
                      </div>
                      <h3 className="mt-2 truncate font-semibold text-slate-900">{offer.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{offer.price} {offer.currency}{offer.city ? ` · ${offer.city}` : ''}</p>
                      {admin && offer.ownerName && <p className="mt-1 text-xs text-slate-500">Propriétaire : {offer.ownerName}</p>}
                    </div>
                  </div>
                  {isEditing ? (
                    <form onSubmit={(event) => saveOffer(event, offer)} className="space-y-4 border-t bg-slate-50 p-5">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2"><Label htmlFor={`percent-${offer.id}`}>Remise (%)</Label><Input id={`percent-${offer.id}`} name="percent" type="number" min="1" max="90" defaultValue={offer.promotionPercent || 10} required /></div>
                        <div className="space-y-2"><Label htmlFor={`starts-${offer.id}`}>Début</Label><Input id={`starts-${offer.id}`} name="startsAt" type="datetime-local" defaultValue={toLocalDateTime(offer.promotionStartDate)} required /></div>
                        <div className="space-y-2"><Label htmlFor={`ends-${offer.id}`}>Fin</Label><Input id={`ends-${offer.id}`} name="endsAt" type="datetime-local" defaultValue={toLocalDateTime(offer.promotionEndDate)} required /></div>
                      </div>
                      <div className="flex gap-2"><Button type="submit" disabled={saving}><Check className="mr-2 h-4 w-4" />Enregistrer</Button><Button type="button" variant="outline" onClick={() => setEditingOffer(null)}><X className="mr-2 h-4 w-4" />Annuler</Button></div>
                    </form>
                  ) : (
                    <div className="flex flex-wrap gap-2 border-t bg-slate-50 p-4">
                      <Button size="sm" onClick={() => { setNotice(''); setEditingOffer(`${offer.type}:${offer.id}`); }}><Pencil className="mr-2 h-4 w-4" />{hasPromotion ? 'Modifier' : 'Créer une promotion'}</Button>
                      {hasPromotion && (
                        <>
                          <Button size="sm" variant="outline" disabled={saving} onClick={() => updateOfferStatus(offer, offer.promotionStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}>
                            {offer.promotionStatus === 'SUSPENDED' ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                            {offer.promotionStatus === 'SUSPENDED' ? 'Réactiver' : 'Suspendre'}
                          </Button>
                          <Button size="sm" variant="outline" disabled={saving} onClick={() => updateOfferStatus(offer, undefined, true)}><Trash2 className="mr-2 h-4 w-4" />Retirer</Button>
                        </>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {admin && (
        <section className="space-y-4 border-t border-slate-200 pt-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Codes promotionnels globaux</h2>
            <p className="mt-1 text-sm text-slate-600">Codes en pourcentage, non cumulables avec les remises affichées sur les offres, limités à une utilisation par client.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{editingCode ? `Modifier ${editingCode.code}` : 'Créer un code promo'}</CardTitle>
              <CardDescription>Définissez une période de validité. La limite totale est facultative ; chaque client ne peut utiliser un code qu’une fois.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveCode} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2"><Label htmlFor="promo-code">Code</Label><Input id="promo-code" value={codeForm.code} disabled={Boolean(editingCode)} onChange={(event) => setCodeForm({ ...codeForm, code: event.target.value.toUpperCase() })} minLength={3} maxLength={32} pattern="[A-Z0-9_-]{3,32}" required={!editingCode} /></div>
                <div className="space-y-2"><Label htmlFor="promo-percent">Remise (%)</Label><Input id="promo-percent" type="number" min="1" max="90" value={codeForm.percent} onChange={(event) => setCodeForm({ ...codeForm, percent: event.target.value })} required /></div>
                <div className="space-y-2"><Label htmlFor="promo-limit">Nombre total d’utilisations</Label><Input id="promo-limit" type="number" min="1" value={codeForm.maxRedemptions} onChange={(event) => setCodeForm({ ...codeForm, maxRedemptions: event.target.value })} placeholder="Sans limite" /></div>
                <div className="space-y-2"><Label htmlFor="promo-start">Début</Label><Input id="promo-start" type="datetime-local" value={codeForm.startsAt} onChange={(event) => setCodeForm({ ...codeForm, startsAt: event.target.value })} required /></div>
                <div className="space-y-2"><Label htmlFor="promo-end">Fin</Label><Input id="promo-end" type="datetime-local" value={codeForm.endsAt} onChange={(event) => setCodeForm({ ...codeForm, endsAt: event.target.value })} required /></div>
                <div className="space-y-2"><Label htmlFor="promo-description">Description (facultative)</Label><Input id="promo-description" value={codeForm.description} onChange={(event) => setCodeForm({ ...codeForm, description: event.target.value })} maxLength={300} /></div>
                <div className="flex gap-2 sm:col-span-2 lg:col-span-3"><Button type="submit" disabled={saving}><Plus className="mr-2 h-4 w-4" />{editingCode ? 'Enregistrer les modifications' : 'Créer le code'}</Button>{editingCode && <Button type="button" variant="outline" onClick={startCreateCode}>Annuler</Button>}</div>
              </form>
            </CardContent>
          </Card>

          {loading ? <div className="flex justify-center py-8"><LoaderCircle className="h-7 w-7 animate-spin text-sky-800" /></div> : codes.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-sm text-slate-600">Aucun code promotionnel créé.</CardContent></Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {codes.map((code) => (
                <Card key={code._id}>
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2"><span className="font-mono text-lg font-bold tracking-wider">{code.code}</span><span className={`rounded-full px-2 py-1 text-xs font-semibold ${code.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>{code.status === 'ACTIVE' ? 'Actif' : 'Suspendu'}</span></div>
                      <p className="mt-1 text-sm text-slate-600">{code.percent}% · {code.redemptionCount}{code.maxRedemptions ? ` / ${code.maxRedemptions}` : ''} utilisations</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><CalendarClock className="h-3.5 w-3.5" />{new Date(code.startsAt).toLocaleDateString('fr-FR')} – {new Date(code.endsAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEditCode(code)}><Pencil className="mr-1 h-4 w-4" />Modifier</Button>
                      <Button size="sm" variant="outline" onClick={() => updateCodeStatus(code, code.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}>{code.status === 'ACTIVE' ? <Pause className="mr-1 h-4 w-4" /> : <Play className="mr-1 h-4 w-4" />}{code.status === 'ACTIVE' ? 'Suspendre' : 'Activer'}</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteCode(code)}><Trash2 className="h-4 w-4" /><span className="sr-only">Supprimer {code.code}</span></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
