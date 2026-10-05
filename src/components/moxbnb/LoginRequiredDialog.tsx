'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoginRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginRequiredDialog({
  open,
  onOpenChange,
}: LoginRequiredDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 sm:mx-0">
            <Heart className="h-6 w-6" />
          </div>
          <DialogTitle>{t('auth.login.wishlistTitle')}</DialogTitle>
          <DialogDescription>{t('auth.login.wishlistDescription')}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Link
            href="/login"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-10 items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
          >
            {t('auth.login.signIn')}
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
