import type { Metadata } from 'next';
import PaymentReturnPage from '@/components/moxbnb/PaymentReturnPage';

export const metadata: Metadata = {
  title: 'Vérification du paiement | Moxbnb',
  robots: { index: false, follow: false },
};

type PaymentSuccessPageProps = {
  searchParams?: {
    paymentIntentId?: string | string[];
    payment_id?: string | string[];
  };
};

export default function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const reference = searchParams?.paymentIntentId ?? searchParams?.payment_id;
  const paymentIntentId = Array.isArray(reference) ? reference[0] : reference;

  return <PaymentReturnPage result="success" paymentIntentId={paymentIntentId?.slice(0, 200)} />;
}
