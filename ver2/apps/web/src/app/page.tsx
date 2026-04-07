'use client';

import Link from 'next/link';
import { mockPerformances, mockBands } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';
import { Card, CardCover } from '@/components/ui/card';
import { PerformanceStatusBadge } from '@/components/ui/badge';
import { getPerformances, getBands } from '@/lib/queries';
import { useQueryWithFallback } from '@/lib/use-query-with-fallback';

export default function HomePage() {
  const { data: performances } = useQueryWithFallback(['performances'], getPerformances, mockPerformances);
  const { data: bands } = useQueryWithFallback(['bands'], getBands, mockBands);

  const upcomingShows = (performances ?? []).filter((p: any) => p.status === 'UPCOMING');
  const activeBands = (bands ?? []).filter((b: any) => b.status === 'ACTIVE');
  const allShows = performances ?? [];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-14">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden p-8 md:p-14 min-h-[280px] flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-card via-surface-elevated/50 to-surface" />
        <div className="absolute top-[-50%] right-[-20%] w-[500px] h-[500px] bg-accent/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[300px] h-[300px] bg-accent/[0.04] rounded-full blur-[80px]" />
        <div className="absolute inset-0 border border-white/[0.04] rounded-3xl" />

        <div className="relative z-10 animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] text-accent/80 mb-3 font-medium">Daejeon Band Platform</p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-[0.9] tracking-tight">
            WE ARE<br />
            <span className="text-accent">LIVE</span>
          </h1>
          <p className="mt-4 text-subtle text-sm md:text-base max-w-sm leading-relaxed font-light">
            대전 밴드 생태계를 하나로 연결합니다.<br className="hidden sm:block" />
            공연, 밴드, 공연장 정보를 한곳에서.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/performances" className="px-5 py-2.5 bg-accent text-black rounded-xl text-sm font-medium hover:bg-accent-hover transition-all hover:shadow-lg hover:shadow-accent/20">
              공연 둘러보기
            </Link>
            <Link href="/bands" className="px-5 py-2.5 text-white/80 rounded-xl text-sm border border-white/[0.08] hover:border-white/[0.15] hover:text-white transition-all">
              밴드 탐색
            </Link>
          </div>
        </div>
      </section>

      {/* 다가오는 공연 */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">다가오는 공연</h2>
          <Link href="/performances" className="section-link">전체 보기</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4">
          {upcomingShows.map((show: any) => (
            <Card key={show.id} href={`/performances/${show.id}`} className="min-w-[240px] md:min-w-[280px] flex-shrink-0">
              <CardCover src={show.poster_image ?? show.posterImage} alt={show.title} />
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <PerformanceStatusBadge status={show.status} />
                  <span className="text-xs text-accent font-mono-space">{formatPrice(show.ticket_price ?? show.ticketPrice ?? 0)}</span>
                </div>
                <h3 className="font-medium text-[13px] line-clamp-1">{show.title}</h3>
                <p className="text-xs text-muted leading-relaxed">
                  {show.date} · {show.start_time ?? show.startTime}<br />
                  {show.venue?.name}
                </p>
              </div>
            </Card>
          ))}
          {upcomingShows.length === 0 && (
            <p className="text-sm text-muted py-8 w-full text-center">예정된 공연이 없습니다.</p>
          )}
        </div>
      </section>

      {/* 밴드 */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">활동 중인 밴드</h2>
          <Link href="/bands" className="section-link">전체 보기</Link>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-3 -mx-4 px-4">
          {activeBands.map((band: any) => (
            <Link key={band.id} href={`/bands/${band.id}`} className="flex flex-col items-center gap-2.5 min-w-[72px] group">
              <div className="w-14 h-14 rounded-full bg-surface-elevated border border-white/[0.06] group-hover:border-accent/40 transition-all duration-300 flex items-center justify-center overflow-hidden">
                {(band.profile_image ?? band.profileImage) ? (
                  <img src={band.profile_image ?? band.profileImage} alt={band.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-display text-muted/60">{band.name[0]}</span>
                )}
              </div>
              <span className="text-[11px] text-muted group-hover:text-white transition-colors text-center line-clamp-1 max-w-[72px]">
                {band.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 전체 공연 */}
      <section>
        <h2 className="section-title mb-5">전체 공연</h2>
        <div className="space-y-2">
          {allShows.map((show: any) => (
            <Link
              key={show.id}
              href={`/performances/${show.id}`}
              className="flex items-center gap-4 p-3.5 rounded-xl border border-transparent hover:bg-surface-card/60 hover:border-white/[0.04] transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-elevated/60 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {(show.poster_image ?? show.posterImage) ? (
                  <img src={show.poster_image ?? show.posterImage} alt={show.title} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-5 h-5 text-white/[0.08]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-medium group-hover:text-white transition-colors line-clamp-1">{show.title}</h3>
                <p className="text-xs text-muted mt-0.5">{show.date} · {show.start_time ?? show.startTime} · {show.venue?.name}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <PerformanceStatusBadge status={show.status} />
                <span className="text-xs text-accent font-mono-space hidden sm:block">{formatPrice(show.ticket_price ?? show.ticketPrice ?? 0)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
