'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification de votre adresse email...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Le lien de vérification est incomplet.');
      return;
    }

    authService.verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Votre adresse email a été vérifiée avec succès.');
      })
      .catch((error: Error) => {
        setStatus('error');
        setMessage(error.message || 'Ce lien est invalide ou a expiré.');
      });
  }, [token]);

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <section className="mx-auto max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mb-5 text-4xl" aria-hidden="true">
          {status === 'loading' ? '...' : status === 'success' ? '✓' : '!'}
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          {status === 'success' ? 'Email vérifié' : status === 'error' ? 'Vérification impossible' : 'Vérification en cours'}
        </h1>
        <p className="mt-3 text-muted-foreground">{message}</p>
        {status !== 'loading' && (
          <Link
            href={status === 'success' ? '/login' : '/signup'}
            className="mt-7 inline-flex rounded-lg bg-rose-600 px-5 py-3 font-medium text-white transition hover:bg-rose-700"
          >
            {status === 'success' ? 'Se connecter' : 'Créer un compte'}
          </Link>
        )}
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
