import type { Metadata } from 'next';
import PaymentReturnPage from '@/components/moxbnb/PaymentReturnPage';

export const metadata: Metadata = {
  title: 'Paiement interrompu | Moxbnb',
  robots: { index: false, follow: false },
};

export default function PaymentCancelPage() {
  return <PaymentReturnPage result="cancel" />;
}
