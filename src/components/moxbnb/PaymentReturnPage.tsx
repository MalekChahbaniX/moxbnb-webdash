'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, CircleAlert, CreditCard, Home, LoaderCircle, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';

type PaymentReturnPageProps = {
  result: 'success' | 'cancel';
  paymentIntentId?: string;
};

type VerificationState = 'idle' | 'verified' | 'failed';

const copy = {
  fr: {
    home: 'Accueil',
    successEyebrow: 'Retour de paiement',
    successTitle: 'Vérifions votre paiement',
    successDescription: 'Le retour du site de paiement ne suffit pas à confirmer une transaction. Vérifiez son statut auprès de notre serveur sécurisé.',
    successNoReference: 'Aucune référence de paiement n’a été transmise. Consultez vos réservations ou contactez notre équipe pour vérifier le statut.',
    verifiedTitle: 'Paiement confirmé',
    verifiedDescription: 'Notre serveur a confirmé le paiement. Vous pouvez consulter les détails de votre réservation.',
    verify: 'Vérifier mon paiement',
    verifying: 'Vérification en cours…',
    verifyAgain: 'Réessayer la vérification',
    verificationFailed: 'Nous n’avons pas pu confirmer le paiement pour le moment. Cela ne signifie pas nécessairement qu’il a échoué. Vérifiez vos réservations avant de réessayer.',
    signInRequired: 'Connectez-vous au compte utilisé pour cette réservation afin de vérifier le paiement.',
    signIn: 'Se connecter',
    cancelEyebrow: 'Paiement interrompu',
    cancelTitle: 'Le paiement n’a pas été finalisé',
    cancelDescription: 'Aucun paiement ne peut être considéré comme confirmé depuis cette page. Votre réservation peut rester en attente ; consultez son statut avant de recommencer.',
    bookings: 'Voir mes réservations',
    browse: 'Retour à l’accueil',
    helpTitle: 'Besoin d’aide ?',
    helpDescription: 'Si votre compte bancaire indique un débit, ne payez pas une deuxième fois avant vérification.',
    contact: 'Contacter le support',
    securityTitle: 'Vérification sécurisée',
    securityDescription: 'Le statut affiché comme confirmé provient de la vérification côté serveur, jamais des seuls paramètres de cette page.',
    reference: 'Référence de paiement',
    unknownError: 'Une erreur est survenue pendant la vérification. Réessayez ou contactez le support.',
    language: 'Langue',
  },
  en: {
    home: 'Home',
    successEyebrow: 'Payment return',
    successTitle: 'Let’s verify your payment',
    successDescription: 'Returning from the payment site does not confirm a transaction. Check its status with our secure server.',
    successNoReference: 'No payment reference was provided. Check your bookings or contact our team to verify the status.',
    verifiedTitle: 'Payment confirmed',
    verifiedDescription: 'Our server confirmed the payment. You can view your booking details.',
    verify: 'Verify my payment',
    verifying: 'Verifying…',
    verifyAgain: 'Try verification again',
    verificationFailed: 'We could not confirm the payment right now. This does not necessarily mean it failed. Check your bookings before trying again.',
    signInRequired: 'Sign in to the account used for this booking to verify the payment.',
    signIn: 'Sign in',
    cancelEyebrow: 'Payment interrupted',
    cancelTitle: 'Payment was not completed',
    cancelDescription: 'A payment cannot be considered confirmed from this page. Your booking may remain pending; check its status before trying again.',
    bookings: 'View my bookings',
    browse: 'Back to home',
    helpTitle: 'Need help?',
    helpDescription: 'If your bank account shows a charge, do not pay a second time before it has been checked.',
    contact: 'Contact support',
    securityTitle: 'Secure verification',
    securityDescription: 'A confirmed status comes from server-side verification, never from this page’s URL parameters alone.',
    reference: 'Payment reference',
    unknownError: 'Something went wrong while verifying. Try again or contact support.',
    language: 'Language',
  },
  ar: {
    home: 'الرئيسية',
    successEyebrow: 'العودة من الدفع',
    successTitle: 'لنتحقق من عملية الدفع',
    successDescription: 'العودة من موقع الدفع لا تؤكد نجاح العملية. تحقق من حالتها عبر خادمنا الآمن.',
    successNoReference: 'لم يتم إرسال مرجع للدفع. راجع حجوزاتك أو تواصل مع فريق الدعم للتحقق من الحالة.',
    verifiedTitle: 'تم تأكيد الدفع',
    verifiedDescription: 'أكد خادمنا عملية الدفع. يمكنك الآن الاطلاع على تفاصيل الحجز.',
    verify: 'تحقق من الدفع',
    verifying: 'جارٍ التحقق…',
    verifyAgain: 'أعد التحقق',
    verificationFailed: 'تعذر تأكيد الدفع الآن. لا يعني ذلك بالضرورة فشل العملية. راجع حجوزاتك قبل المحاولة مرة أخرى.',
    signInRequired: 'سجل الدخول إلى الحساب المستخدم في هذا الحجز للتحقق من الدفع.',
    signIn: 'تسجيل الدخول',
    cancelEyebrow: 'تم إيقاف الدفع',
    cancelTitle: 'لم تكتمل عملية الدفع',
    cancelDescription: 'لا يمكن اعتبار الدفع مؤكداً من هذه الصفحة. قد يبقى الحجز قيد الانتظار؛ تحقق من حالته قبل إعادة المحاولة.',
    bookings: 'عرض حجوزاتي',
    browse: 'العودة إلى الرئيسية',
    helpTitle: 'هل تحتاج إلى مساعدة؟',
    helpDescription: 'إذا ظهر خصم في حسابك البنكي، فلا تدفع مرة أخرى قبل التحقق.',
    contact: 'تواصل مع الدعم',
    securityTitle: 'تحقق آمن',
    securityDescription: 'يتم تأكيد الحالة من خلال التحقق على الخادم، وليس من خلال معطيات الرابط وحدها.',
    reference: 'مرجع الدفع',
    unknownError: 'حدث خطأ أثناء التحقق. أعد المحاولة أو تواصل مع الدعم.',
    language: 'اللغة',
  },
} as const;

export default function PaymentReturnPage({ result, paymentIntentId }: PaymentReturnPageProps) {
  const { language, setLanguage } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [verificationState, setVerificationState] = useState<VerificationState>('idle');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const text = copy[language];
  const isSuccessReturn = result === 'success';
  const isVerified = verificationState === 'verified';
  const title = isVerified ? text.verifiedTitle : isSuccessReturn ? text.successTitle : text.cancelTitle;
  const description = isVerified ? text.verifiedDescription : isSuccessReturn ? text.successDescription : text.cancelDescription;
  const supportMail = `mailto:contact@moxbnb.com?subject=${encodeURIComponent('Aide concernant un paiement Moxbnb')}`;

  const verifyPayment = async () => {
    if (!paymentIntentId || !isAuthenticated || isVerifying) return;

    setIsVerifying(true);
    setVerificationMessage('');
    try {
      const response = await api.post('/payments/confirm', {
        paymentIntentId,
        provider: 'CLICKTOPAY',
      });

      if (!response.data?.success) {
        setVerificationState('failed');
        setVerificationMessage(text.verificationFailed);
        return;
      }

      setVerificationState('verified');
    } catch (error) {
      console.error('Unable to verify Click to Pay return:', error);
      setVerificationState('failed');
      setVerificationMessage(text.unknownError);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50 px-4 py-8 text-slate-900 sm:py-12"
    >
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Moxbnb" className="text-2xl font-bold tracking-tight text-sky-950">
            Moxbnb
          </Link>
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1" aria-label={text.language}>
            {(['fr', 'en', 'ar'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                aria-pressed={language === lang}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${
                  language === lang ? 'bg-sky-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        <section className="my-auto py-10" aria-live="polite">
          <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <div className={`h-2 ${isVerified ? 'bg-emerald-500' : isSuccessReturn ? 'bg-sky-800' : 'bg-amber-500'}`} />
            <div className="p-6 sm:p-10">
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${
                isVerified ? 'bg-emerald-50 text-emerald-700' : isSuccessReturn ? 'bg-sky-50 text-sky-900' : 'bg-amber-50 text-amber-700'
              }`}>
                {isVerified ? <CheckCircle2 className="h-8 w-8" aria-hidden /> :
                  isSuccessReturn ? <ShieldCheck className="h-8 w-8" aria-hidden /> :
                    <CircleAlert className="h-8 w-8" aria-hidden />}
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                {isVerified ? text.successEyebrow : isSuccessReturn ? text.successEyebrow : text.cancelEyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
              <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>

              {paymentIntentId && (
                <p className="mt-5 break-all rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">{text.reference} : </span>
                  <span dir="ltr">{paymentIntentId}</span>
                </p>
              )}

              {isSuccessReturn && !isVerified && (
                <div className="mt-6">
                  {!paymentIntentId ? (
                    <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                      {text.successNoReference}
                    </p>
                  ) : authLoading ? (
                    <p className="text-sm text-slate-600">{text.verifying}</p>
                  ) : isAuthenticated ? (
                    <>
                      <button
                        type="button"
                        onClick={verifyPayment}
                        disabled={isVerifying}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                      >
                        {isVerifying ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <CreditCard className="h-5 w-5" aria-hidden />}
                        {isVerifying ? text.verifying : verificationState === 'failed' ? text.verifyAgain : text.verify}
                      </button>
                      {verificationMessage && (
                        <p role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                          {verificationMessage}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm leading-6 text-slate-700">{text.signInRequired}</p>
                      <Link
                        href="/login"
                        className="mt-3 inline-flex items-center gap-2 font-semibold text-sky-900 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
                      >
                        {text.signIn}<ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {isVerified && (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                  {text.verifiedDescription}
                </div>
              )}

              {!isSuccessReturn && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <h2 className="font-semibold text-amber-950">{text.helpTitle}</h2>
                  <p className="mt-1 text-sm leading-6 text-amber-900">{text.helpDescription}</p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/bookings"
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-sky-900 px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
                >
                  {text.bookings}<ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/"
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
                >
                  <Home className="h-4 w-4" aria-hidden />{text.browse}
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-5 flex max-w-xl flex-col justify-between gap-3 px-1 text-sm text-slate-500 sm:flex-row sm:items-center">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 text-emerald-700" aria-hidden />
              {text.securityTitle}
            </span>
            <a href={supportMail} className="inline-flex items-center gap-2 font-medium text-sky-900 underline-offset-4 hover:underline">
              <Mail className="h-4 w-4" aria-hidden />{text.contact}
            </a>
          </div>
          <p className="mx-auto mt-2 max-w-xl px-1 text-xs leading-5 text-slate-500">{text.securityDescription}</p>
        </section>

        <footer className="pt-4 text-center text-xs text-slate-400">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-slate-600">
            <Home className="h-3.5 w-3.5" aria-hidden />{text.home}
          </Link>
        </footer>
      </div>
    </main>
  );
}
