'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, Users, Star, CheckCircle, AlertCircle, ArrowLeft, CreditCard, Shield, Smartphone, Wallet } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import Header from '@/components/moxbnb/Header';
import Footer from '@/components/moxbnb/Footer';
import { useAuth } from '@/contexts/AuthContext';

function BookingConfirmContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const [checkIn, setCheckIn] = useState<Date | undefined>(() => {
    const checkInParam = searchParams.get('checkIn');
    if (!checkInParam) return undefined;
    const date = new Date(checkInParam);
    return isNaN(date.getTime()) ? undefined : date;
  });
  const [checkOut, setCheckOut] = useState<Date | undefined>(() => {
    const checkOutParam = searchParams.get('checkOut');
    if (!checkOutParam) return undefined;
    const date = new Date(checkOutParam);
    return isNaN(date.getTime()) ? undefined : date;
  });
  const [guests, setGuests] = useState(parseInt(searchParams.get('guests') || '2'));
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'mobile'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [couponQuote, setCouponQuote] = useState<{ code: string; percent: number; discountAmount: number; totalPrice: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/listings/${propertyId}`);
        const propertyData = response.data?.data?.listing || response.data?.data || response.data;
        console.log('Booking confirm property data:', propertyData);
        setProperty(propertyData);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setCouponQuote(null);
    setCouponError('');
  }, [checkIn, checkOut]);

  const applyPromoCode = async () => {
    if (!promoCodeInput.trim() || !propertyId || !checkIn || !checkOut) {
      setCouponError('Saisissez un code et sélectionnez vos dates avant de l’appliquer.');
      return;
    }

    setIsCheckingCoupon(true);
    setCouponError('');
    try {
      const response = await api.post('/promotions/validate', {
        type: 'PROPERTY',
        itemId: propertyId,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        code: promoCodeInput.trim(),
      });
      setCouponQuote(response.data.data);
    } catch (couponValidationError: any) {
      setCouponQuote(null);
      setCouponError(couponValidationError?.response?.data?.error || 'Ce code promo ne peut pas être utilisé.');
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (paymentMethod === 'card' && (!cardNumber || !expiryDate || !cvv || !cardName)) {
      alert('Veuillez remplir tous les champs de paiement');
      return;
    }

    setIsProcessing(true);

    try {
      const bookingData = {
        type: 'PROPERTY',
        listingId: propertyId,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        guests,
        totalPrice: grandTotal,
        currency: 'TND',
        promoCode: couponQuote?.code,
        paymentStatus: paymentMethod === 'cash' ? 'PENDING' : 'PROCESSING',
        paymentProvider: paymentMethod === 'card' ? 'STRIPE' : undefined
      };

      const response = await api.post('/bookings', bookingData);

      if (response.data?.success) {
        router.push('/bookings?success=true');
      } else {
        throw new Error('Booking creation failed');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Erreur lors de la création de la réservation. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Property not found'}</p>
          <Button onClick={() => router.back()}>Retour</Button>
        </div>
      </div>
    );
  }

  const checkInDate = checkIn ? new Date(checkIn) : new Date();
  const checkOutDate = checkOut ? new Date(checkOut) : new Date();
  const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
  const price = property.price || 0;
  const totalPrice = price * nights;
  const now = Date.now();
  const offerIsActive = property.promotionStatus !== 'SUSPENDED' &&
    Number(property.promotionPercent) > 0 &&
    new Date(property.promotionStartDate).getTime() <= now &&
    new Date(property.promotionEndDate).getTime() > now;
  const offerDiscount = offerIsActive
    ? Math.round(totalPrice * Number(property.promotionPercent)) / 100
    : 0;
  const grandTotal = couponQuote?.totalPrice ?? totalPrice - offerDiscount;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold">Confirmer et payer</h1>
            <p className="text-gray-600 mt-2">Complétez votre réservation pour {property.title}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trip Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Votre voyage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={property.images?.[0] || '/api/placeholder/100/100'}
                      alt={property.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{property.title}</h3>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {property.rating} ({property.reviews} avis)
                      </p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Dates</Label>
                      <p className="font-medium mt-1">
                        {format(checkInDate, 'dd MMM yyyy', { locale: fr })} - {format(checkOutDate, 'dd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Voyageurs</Label>
                      <p className="font-medium mt-1">{guests} voyageur{(guests || 1) > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Mode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      className={paymentMethod === 'card' ? 'bg-rose-600 hover:bg-rose-700' : ''}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Carte
                    </Button>
                    <Button
                      type="button"
                      variant={paymentMethod === 'mobile' ? 'default' : 'outline'}
                      className={paymentMethod === 'mobile' ? 'bg-rose-600 hover:bg-rose-700' : ''}
                      onClick={() => setPaymentMethod('mobile')}
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile
                    </Button>
                    <Button
                      type="button"
                      variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                      className={paymentMethod === 'cash' ? 'bg-rose-600 hover:bg-rose-700' : ''}
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Espèces
                    </Button>
                  </div>

                  {/* Card Payment Form */}
                  {paymentMethod === 'card' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nom sur la carte</Label>
                        <Input
                          id="cardName"
                          placeholder="JEAN DUPONT"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          maxLength={19}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Date d'expiration</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/AA"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Mobile Payment Info */}
                  {paymentMethod === 'mobile' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        Vous serez redirigé vers l'application de paiement mobile (D17, Flouci, etc.) après confirmation.
                      </p>
                    </div>
                  )}

                  {/* Cash Payment Info */}
                  {paymentMethod === 'cash' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800">
                        Paiement en espèces à l'arrivée. Veuillez préparer le montant exact.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-4">
                    <Shield className="h-4 w-4" />
                    <span>Vos informations de paiement sont sécurisées et cryptées</span>
                  </div>
                </CardContent>
              </Card>

              {/* Cancellation Policy */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Politique d'annulation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        Annulation gratuite jusqu'à 48h avant l'arrivée
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        Remboursement complet si annulé dans les délais
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Price Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-xl">Détails du prix</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <Label htmlFor="promo-code">Code promotionnel</Label>
                    <div className="flex gap-2">
                      <Input
                        id="promo-code"
                        value={promoCodeInput}
                        onChange={(event) => {
                          setPromoCodeInput(event.target.value.toUpperCase());
                          setCouponQuote(null);
                        }}
                        placeholder="Ex. MOX10"
                        maxLength={32}
                        autoCapitalize="characters"
                      />
                      <Button type="button" variant="outline" onClick={applyPromoCode} disabled={isCheckingCoupon}>
                        {isCheckingCoupon ? 'Vérification…' : couponQuote ? 'Appliqué' : 'Appliquer'}
                      </Button>
                    </div>
                    {couponError && <p role="alert" className="text-sm text-red-700">{couponError}</p>}
                    {couponQuote && <p role="status" className="text-sm font-medium text-emerald-800">Code {couponQuote.code} appliqué : {couponQuote.percent}% de réduction. Non cumulable avec la promotion de l’offre.</p>}
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Votre hôte</p>
                    <p className="text-sm text-muted-foreground">{property.host?.name || 'Hôte'}</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-muted-foreground">Taux de réponse:</span>
                      <span className="font-medium">{property.host?.responseRate || 'N/A'}%</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-muted-foreground">Temps de réponse:</span>
                      <span className="font-medium">{property.host?.responseTime || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {price} DT x {nights} nuit{nights > 1 ? 's' : ''}
                    </span>
                    <span className="font-medium">{totalPrice} DT</span>
                  </div>

                  {couponQuote ? (
                    <div className="flex justify-between text-sm font-medium text-emerald-800">
                      <span>Réduction · {couponQuote.code}</span>
                      <span>−{couponQuote.discountAmount} DT</span>
                    </div>
                  ) : offerDiscount > 0 ? (
                    <div className="flex justify-between text-sm font-medium text-emerald-800">
                      <span>Promotion · {property.promotionPercent}%</span>
                      <span>−{offerDiscount} DT</span>
                    </div>
                  ) : null}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-rose-600">{grandTotal} DT</span>
                  </div>

                  <Button 
                    className="w-full bg-rose-600 hover:bg-rose-700 mt-4" 
                    size="lg"
                    onClick={handleConfirmBooking}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Traitement en cours...' : `Confirmer et payer ${grandTotal} DT`}
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-2">
                    En cliquant, vous acceptez les conditions générales
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function BookingConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    }>
      <BookingConfirmContent />
    </Suspense>
  );
}
