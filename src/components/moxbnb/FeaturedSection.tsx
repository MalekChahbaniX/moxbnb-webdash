'use client';

/**
 * One section of the home page: title + "see all" link + a few cards.
 * Place at: components/moxbnb/FeaturedSection.tsx
 * Properties / Experiences / Services sections are thin wrappers around it.
 */

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ListingCard, type ListingCardProps } from './listing-kit';

export const reviewsCount = (v: unknown): number =>
  Array.isArray(v) ? v.length : Number(v) || 0;

interface FeaturedSectionProps<T extends { _id: string }> {
  id: string;
  title: string;
  subtitle: string;
  endpoint: string;
  limit: number;
  /** list page; each card links to `${href}/${_id}` */
  href: string;
  seeAll: string;
  emptyText: string;
  toCard: (item: T) => Omit<ListingCardProps, 'href'>;
  cols?: 3 | 4;
  tone?: 'plain' | 'tint';
}

/** Scroll-snap row on phones, regular grid from `sm` up. */
function Track({ cols, children }: { cols: 3 | 4; children: ReactNode }) {
  return (
    <div
      className={`-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 sm:overflow-visible sm:px-0 sm:pb-0 ${
        cols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      }`}
    >
      {children}
    </div>
  );
}

const Slot = ({ children }: { children: ReactNode }) => (
  <div className="w-[78%] flex-shrink-0 snap-start sm:w-auto">{children}</div>
);

export default function FeaturedSection<T extends { _id: string }>({
  id,
  title,
  subtitle,
  endpoint,
  limit,
  href,
  seeAll,
  emptyText,
  toCard,
  cols = 3,
  tone = 'plain',
}: FeaturedSectionProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await api.get(endpoint);
        // Backend returns {success: true, data: [...]}
        const list = response.data?.data;
        if (!cancelled) setItems((Array.isArray(list) ? list : []).slice(0, limit));
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [endpoint, limit, reloadKey]);

  return (
    <section
      id={id}
      className={`py-16 md:py-20 ${tone === 'tint' ? 'border-y bg-sky-50/60' : 'bg-white'}`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-balance md:text-3xl">
              {title}
            </h2>
            <p className="mt-2 max-w-[52ch] text-slate-600">{subtitle}</p>
          </div>
          <Link
            href={href}
            className="inline-flex flex-shrink-0 items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
          >
            {seeAll}
          </Link>
        </div>

        {loading ? (
          <Track cols={cols}>
            {Array.from({ length: limit }).map((_, i) => (
              <Slot key={i}>
                <div className="animate-pulse">
                  <div className="aspect-[4/3] rounded-2xl bg-slate-200/70" />
                  <div className="mt-3 h-4 w-2/3 rounded bg-slate-200/70" />
                  <div className="mt-2 h-3 w-1/3 rounded bg-slate-200/70" />
                  <div className="mt-3 h-5 w-24 rounded bg-slate-200/70" />
                </div>
              </Slot>
            ))}
          </Track>
        ) : error ? (
          <div className="py-10 text-center">
            <p className="font-medium">Impossible de charger cette section</p>
            <p className="mt-1 text-sm text-slate-500">Vérifiez votre connexion puis réessayez.</p>
            <Button variant="outline" className="mt-4" onClick={() => setReloadKey((k) => k + 1)}>
              Réessayer
            </Button>
          </div>
        ) : items.length === 0 ? (
          <p className="py-10 text-center text-slate-500">{emptyText}</p>
        ) : (
          <Track cols={cols}>
            {items.map((item) => (
              <Slot key={item._id}>
                <ListingCard href={`${href}/${item._id}`} {...toCard(item)} />
              </Slot>
            ))}
          </Track>
        )}
      </div>
    </section>
  );
}