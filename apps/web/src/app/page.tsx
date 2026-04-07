'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { formatDate, formatPrice } from '@/lib/utils';

const BAND_COLORS = ['#F97316', '#06B6D4', '#A855F7', '#EC4899', '#22C55E', '#EAB308', '#EF4444', '#6366F1'];

export default function Home() {
  const supabase = createClient();
  const [performances, setPerformances] = useState<any[]>([]);
  const [bands, setBands] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('performances')
      .select('id, title, date, start_time, ticket_price, status, venue:venues(name, address), bands:performance_bands(band:bands(id, name))')
      .eq('status', 'UPCOMING')
      .order('date', { ascending: true })
      .limit(6)
      .then(({ data }) => setPerformances(data ?? []));

    supabase
      .from('bands')
      .select('id, name, genre, description, status, members:band_members(count)')
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setBands(data ?? []));

    supabase
      .from('venues')
      .select('id, name, address, capacity')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setVenues(data ?? []));
  }, [supabase]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="text-center animate-fade-up">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-[4px] text-stone-50">
              대전의 밴드 씬을 한눈에
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-subtle max-w-2xl mx-auto">
              밴드 · 동아리 · 공연장을 연결하는 통합 플랫폼
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/performances" className="w-full sm:w-auto px-8 py-3 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors text-center">
                공연 둘러보기
              </Link>
              <Link href="/bands" className="w-full sm:w-auto px-8 py-3 border border-accent/40 text-accent font-semibold rounded-lg hover:bg-accent/10 transition-colors text-center">
                밴드 탐색
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Performances */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-[18px] tracking-[3px] text-muted">UPCOMING</h2>
              <span className="flex-1 h-px bg-white/[0.07] min-w-[40px]" />
            </div>
            <Link href="/performances" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
              더 보기 &rarr;
            </Link>
          </div>
          {performances.length === 0 ? (
            <p className="text-center text-muted py-12">등록된 공연이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {performances.map((p) => (
                <Link key={p.id} href={`/performances/${p.id}`} className="bg-surface-card border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all overflow-hidden group">
                  <div className="h-40 bg-gradient-to-br from-surface-elevated to-surface-card flex items-center justify-center relative">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent via-accent-hover to-transparent" />
                    <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-accent font-mono-space font-medium">{formatDate(p.date)}{p.start_time && ` ${p.start_time}`}</p>
                    <h3 className="mt-1 text-lg font-bold text-stone-50 group-hover:text-accent transition-colors">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted">{p.venue?.name}</p>
                    {p.bands?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.bands.map((pb: any, j: number) => (
                          <span key={pb.band?.id || j} className="inline-block px-2 py-0.5 text-[10px] font-mono-space font-medium tracking-wider uppercase rounded" style={{ background: BAND_COLORS[j % BAND_COLORS.length] + '18', color: BAND_COLORS[j % BAND_COLORS.length] }}>
                            {pb.band?.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="mt-3 text-sm font-bold text-accent">{formatPrice(p.ticket_price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Active Bands */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-[18px] tracking-[3px] text-muted">BANDS</h2>
              <span className="flex-1 h-px bg-white/[0.07] min-w-[40px]" />
            </div>
            <Link href="/bands" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">더 보기 &rarr;</Link>
          </div>
          {bands.length === 0 ? (
            <p className="text-center text-muted py-12">등록된 밴드가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bands.map((band, i) => (
                <Link key={band.id} href={`/bands/${band.id}`} className="bg-surface-card border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all p-5 group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[11px] flex items-center justify-center flex-shrink-0 font-display text-xl text-surface" style={{ background: BAND_COLORS[i % BAND_COLORS.length] }}>
                      {band.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-stone-50 group-hover:text-accent transition-colors truncate">{band.name}</h3>
                      <p className="text-sm text-muted truncate">{band.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {band.genre?.map((g: string) => (
                      <span key={g} className="inline-block px-2 py-0.5 text-[10px] font-mono-space tracking-wider bg-white/[0.04] text-muted rounded">{g}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Venues */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-[18px] tracking-[3px] text-muted">VENUES</h2>
              <span className="flex-1 h-px bg-white/[0.07] min-w-[40px]" />
            </div>
            <Link href="/venues" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">더 보기 &rarr;</Link>
          </div>
          {venues.length === 0 ? (
            <p className="text-center text-muted py-12">등록된 공연장이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <Link key={venue.id} href={`/venues/${venue.id}`} className="bg-surface-card border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all p-5 group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-stone-50 group-hover:text-accent transition-colors">{venue.name}</h3>
                      <p className="text-sm text-muted mt-0.5">{venue.address}</p>
                    </div>
                  </div>
                  {venue.capacity && (
                    <div className="mt-4 text-sm text-subtle">
                      <span className="font-mono-space text-xs">👥 수용 {venue.capacity}명</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-card border border-white/[0.07] rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent" />
            <h2 className="font-display text-3xl sm:text-4xl tracking-[3px] text-stone-50">우리 동아리도 함께하고 싶다면?</h2>
            <p className="mt-3 text-subtle max-w-xl mx-auto">조직을 등록하고 밴드와 공연을 관리해보세요.</p>
            <Link href="/organizations/new" className="mt-6 inline-block px-8 py-3 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors">
              조직 등록하기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
