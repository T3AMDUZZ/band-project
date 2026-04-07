'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { formatDate, formatPrice } from '@/lib/utils';

const tabs = [
  { key: 'all', label: '전체' },
  { key: 'upcoming', label: '다가오는 공연' },
  { key: 'past', label: '지난 공연' },
] as const;

type TabKey = (typeof tabs)[number]['key'];

export default function PerformancesPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [performances, setPerformances] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('performances')
      .select('id, title, date, start_time, ticket_price, status, venue:venues(name, address)')
      .order('date', { ascending: false })
      .then(({ data }) => setPerformances(data ?? []));
  }, [supabase]);

  const filtered = performances.filter((p) => {
    if (activeTab === 'upcoming') return p.status === 'UPCOMING';
    if (activeTab === 'past') return p.status === 'COMPLETED';
    return true;
  });

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[18px] tracking-[3px] text-muted">PERFORMANCES</h1>
            <span className="flex-1 h-px bg-white/[0.07] min-w-[40px]" />
          </div>
          <Link href="/performances/new" className="px-6 py-2.5 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors">
            공연 등록
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.04] rounded-[10px] p-[3px] mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-accent text-surface' : 'text-muted hover:text-stone-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted py-20">공연이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <Link key={p.id} href={`/performances/${p.id}`} className="bg-surface-card border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all overflow-hidden group">
                <div className="h-32 bg-gradient-to-br from-surface-elevated to-surface-card flex items-center justify-center relative">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent via-accent-hover to-transparent" />
                  <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div className="p-5">
                  <p className="text-sm text-accent font-mono-space font-medium">{formatDate(p.date)}{p.start_time && ` ${p.start_time}`}</p>
                  <h3 className="mt-1 text-lg font-bold text-stone-50 group-hover:text-accent transition-colors">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted">{p.venue?.name}</p>
                  <p className="mt-3 text-sm font-bold text-accent">{formatPrice(p.ticket_price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
