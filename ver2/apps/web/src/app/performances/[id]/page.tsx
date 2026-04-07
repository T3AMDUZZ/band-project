'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getPerformanceById, getPerformanceBands } from '@/lib/queries';
import { formatPrice } from '@/lib/utils';
import { PerformanceStatusBadge } from '@/components/ui/badge';

export default function PerformanceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: show, isLoading } = useQuery({
    queryKey: ['performance', id],
    queryFn: () => getPerformanceById(id),
  });

  const { data: perfBands } = useQuery({
    queryKey: ['performanceBands', id],
    queryFn: () => getPerformanceBands(id),
    enabled: !!show,
  });

  if (isLoading) return <div className="max-w-[800px] mx-auto px-4 py-20 text-center text-muted">로딩 중...</div>;
  if (!show) return (
    <div className="max-w-[800px] mx-auto px-4 py-20 text-center">
      <p className="text-muted">공연을 찾을 수 없습니다.</p>
      <Link href="/performances" className="text-accent text-sm mt-2 inline-block">목록으로 돌아가기</Link>
    </div>
  );

  const posterImage = show.poster_image || show.posterImage;
  const startTime = show.start_time || show.startTime;
  const endTime = show.end_time || show.endTime;
  const ticketPrice = show.ticket_price ?? show.ticketPrice ?? 0;

  return (
    <div className="max-w-[800px] mx-auto px-4 py-6 space-y-6">
      {/* Poster */}
      <div className="w-full aspect-[3/4] max-h-[400px] bg-surface-elevated rounded-2xl overflow-hidden flex items-center justify-center">
        {posterImage ? (
          <img src={posterImage} alt={show.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted/40">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
            <span className="text-sm">포스터 없음</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{show.title}</h1>
          <PerformanceStatusBadge status={show.status} />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-subtle">
          <span>{show.date}</span>
          <span>{startTime} ~ {endTime}</span>
          <Link href={`/venues/${show.venue_id || show.venueId}`} className="text-accent hover:text-accent-hover transition-colors">{show.venue?.name}</Link>
          <span className="text-accent font-mono-space">{formatPrice(ticketPrice)}</span>
        </div>
        {show.description && <p className="text-sm text-subtle leading-relaxed">{show.description}</p>}
      </div>

      {/* Lineup */}
      {perfBands && perfBands.length > 0 && (
        <section>
          <h2 className="font-medium mb-3">출연 밴드</h2>
          <div className="space-y-3">
            {perfBands.map((pb: any) => (
              <div key={pb.band_id || pb.bandId} className="p-4 bg-surface-card border border-white/[0.07] rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/15 text-accent text-xs flex items-center justify-center font-mono-space">{pb.play_order ?? pb.playOrder}</span>
                  <Link href={`/bands/${pb.band_id || pb.bandId}`} className="font-medium text-sm hover:text-accent transition-colors">{pb.band?.name}</Link>
                </div>
                {(pb.setlist || []).length > 0 && (
                  <div className="mt-2 pl-9 space-y-1">
                    {(pb.setlist || []).map((song: any, i: number) => {
                      const songName = typeof song === 'string' ? song : song?.title || song?.name || JSON.stringify(song);
                      return <p key={i} className="text-xs text-muted"><span className="text-subtle font-mono-space mr-2">{i + 1}.</span>{songName}</p>;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
