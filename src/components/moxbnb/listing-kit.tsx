'use client';

/**
 * Shared building blocks for the Moxbnb list pages
 * (logements, logements étudiants, expériences, services).
 * Place at: components/moxbnb/listing/ListingKit.tsx
 *
 * Uses logical Tailwind classes (ps-, pe-, start-, end-) so it works in RTL (Arabic).
 */

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Search, X, Heart, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import LoginRequiredDialog from './LoginRequiredDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const PAGE_SIZE = 9;

/* ---------- hooks ---------- */

export function useDebounced<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/* ---------- hero ---------- */

export function ListingHero({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b bg-sky-50/60">
      <div className="mx-auto max-w-6xl px-4 pb-6 pt-10">
        <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-[60ch] text-slate-600">{subtitle}</p>}
        {children && <div className="mt-6 flex flex-col gap-3 md:flex-row">{children}</div>}
      </div>
    </section>
  );
}

/* ---------- inputs ---------- */

export function FieldInput({
  value,
  onChange,
  placeholder,
  label,
  type = 'search',
  withIcon = true,
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
  type?: 'search' | 'text' | 'number';
  withIcon?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {withIcon && (
        <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      )}
      <input
        type={type}
        inputMode={type === 'number' ? 'numeric' : undefined}
        min={type === 'number' ? 0 : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className={`h-12 w-full rounded-2xl border border-slate-200 bg-white pe-10 text-sm shadow-sm placeholder:text-slate-400 focus:border-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-900/20 ${
          withIcon ? 'ps-12' : 'ps-4'
        }`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Effacer"
          className="absolute end-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder,
  label,
  className = 'md:w-52',
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  label: string;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className={`h-12 w-full rounded-2xl border-slate-200 bg-white shadow-sm ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ---------- sticky chip bar ---------- */

export interface ChipOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

export function ChipBar({
  options,
  value,
  onChange,
  label,
  trailing,
}: {
  options: ChipOption[];
  value: string;
  onChange: (v: string) => void;
  label: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="sticky top-16 z-30 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <div
          className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 py-1"
          role="group"
          aria-label={label}
        >
          {options.map(({ value: v, label: l, icon: Icon }) => {
            const active = value === v;
            return (
              <button
                key={v}
                onClick={() => onChange(v)}
                aria-pressed={active}
                className={`inline-flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${
                  active
                    ? 'border-sky-900 bg-sky-900 text-white'
                    : 'border-slate-200 text-slate-700 hover:border-slate-400'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {l}
              </button>
            );
          })}
        </div>
        {trailing}
      </div>
    </div>
  );
}

/* ---------- toolbar ---------- */

export function ResultsToolbar({
  countText,
  hasFilters,
  onReset,
  resetLabel = 'Réinitialiser',
  sort,
  onSort,
  sortOptions,
  sortLabel = 'Trier',
}: {
  countText: string;
  hasFilters: boolean;
  onReset: () => void;
  resetLabel?: string;
  sort?: string;
  onSort?: (v: string) => void;
  sortOptions?: { value: string; label: string }[];
  sortLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-600" aria-live="polite">
        {countText}
      </p>
      <div className="flex items-center gap-3">
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-sm font-medium text-sky-900 underline underline-offset-2"
          >
            {resetLabel}
          </button>
        )}
        {sortOptions && onSort && sort !== undefined && (
          <Select value={sort} onValueChange={onSort}>
            <SelectTrigger aria-label={sortLabel} className="h-9 w-44 rounded-full border-slate-200">
              <SelectValue placeholder={sortLabel} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}

/* ---------- grid + card ---------- */

export function CardGrid({ children, cols = 3 }: { children: ReactNode; cols?: 3 | 4 }) {
  return (
    <div
      className={`grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 ${
        cols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      }`}
    >
      {children}
    </div>
  );
}

const formatRating = (r: number) => String(Math.round(r * 100) / 100);

export interface ListingCardProps {
  href: string;
  image: string;
  title: string;
  badge?: string;
  subtitle?: string;
  meta?: { icon: LucideIcon; text: string }[];
  price: number;
  priceSuffix: string;
  altPrice?: string;
  rating?: number;
  reviews?: number;
  unavailable?: boolean;
  unavailableLabel?: string;
  newLabel?: string;
}

export function ListingCard({
  href,
  image,
  title,
  badge,
  subtitle,
  meta = [],
  price,
  priceSuffix,
  altPrice,
  rating = 0,
  reviews = 0,
  unavailable,
  unavailableLabel = 'Indisponible',
  newLabel = 'Nouveau',
}: ListingCardProps) {
  const [fav, setFav] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const toggleFavorite = () => {
    if (authLoading) return;
    if (!user) {
      setLoginPromptOpen(true);
      return;
    }
    setFav((current) => !current);
  };

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-2xl bg-slate-100">
        <Link
          href={href}
          aria-label={title}
          className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
        >
          <img
            src={image}
            alt={title}
            loading="lazy"
            className={`aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${
              unavailable ? 'grayscale-[60%]' : ''
            }`}
          />
        </Link>

        {badge && (
          <span className="pointer-events-none absolute start-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-sky-900 shadow-sm">
            {badge}
          </span>
        )}

        <button
          onClick={toggleFavorite}
          disabled={authLoading}
          aria-pressed={fav}
          aria-label={fav ? 'Retirer des favoris' : 'Enregistrer'}
          className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
        >
          <Heart className={`h-4 w-4 ${fav ? 'fill-rose-600 text-rose-600' : 'text-slate-700'}`} />
        </button>
        <LoginRequiredDialog open={loginPromptOpen} onOpenChange={setLoginPromptOpen} />

        {unavailable && (
          <span className="pointer-events-none absolute bottom-3 start-3 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-medium text-white">
            {unavailableLabel}
          </span>
        )}
      </div>

      <Link href={href} className="mt-3 block">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-semibold text-slate-900 underline-offset-2 group-hover:underline">
            {title}
          </h3>
          <span className="inline-flex flex-shrink-0 items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {rating > 0 ? formatRating(rating) : newLabel}
            {reviews > 0 && <span className="text-slate-500">({reviews})</span>}
          </span>
        </div>

        {subtitle && <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>}

        {meta.length > 0 && (
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            {meta.map(({ icon: Icon, text }, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <Icon className="h-3.5 w-3.5" />
                <span className="line-clamp-1">{text}</span>
              </span>
            ))}
          </p>
        )}

        <p className="mt-2 text-slate-900">
          <span className="text-lg font-semibold">{price} DT</span>
          <span className="text-sm text-slate-500"> {priceSuffix}</span>
          {altPrice && <span className="block text-sm text-slate-500">{altPrice}</span>}
        </p>
      </Link>
    </article>
  );
}

/* ---------- states ---------- */

export function CardSkeletonGrid({ count = 6, cols = 3 }: { count?: number; cols?: 3 | 4 }) {
  return (
    <CardGrid cols={cols}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/3] rounded-2xl bg-slate-100" />
          <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
          <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
          <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />
          <div className="mt-3 h-5 w-24 rounded bg-slate-100" />
        </div>
      ))}
    </CardGrid>
  );
}

export function StateMessage({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-sm py-20 text-center">
      <p className="font-medium">{title}</p>
      {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ---------- pagination ---------- */

export function LoadMore({
  shown,
  total,
  onClick,
  label,
}: {
  shown: number;
  total: number;
  onClick: () => void;
  label?: string;
}) {
  if (shown >= total) return null;
  const next = Math.min(PAGE_SIZE, total - shown);
  return (
    <div className="mt-12 text-center">
      <Button variant="outline" size="lg" className="rounded-full px-8" onClick={onClick}>
        {label ?? `Afficher ${next} de plus`}
      </Button>
      <p className="mt-2 text-xs text-slate-500">
        {shown} / {total}
      </p>
    </div>
  );
}

function pageList(page: number, total: number): (number | '…')[] {
  const set = new Set([1, total, page - 1, page, page + 1]);
  const nums = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  nums.forEach((p, i) => {
    if (i > 0 && p - nums[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

export function Pager({
  page,
  totalPages,
  onChange,
  prevLabel = 'Précédent',
  nextLabel = 'Suivant',
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  prevLabel?: string;
  nextLabel?: string;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        {prevLabel}
      </Button>
      {pageList(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-slate-400" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`h-10 min-w-10 rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${
              p === page ? 'bg-sky-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {p}
          </button>
        )
      )}
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        {nextLabel}
      </Button>
    </nav>
  );
}