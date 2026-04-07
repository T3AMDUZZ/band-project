'use client';

import { mockPerformances } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';
import { Card, CardCover } from '@/components/ui/card';
import { PerformanceStatusBadge } from '@/components/ui/badge';
import { getPerformances } from '@/lib/queries';
import { useQueryWithFallback } from '@/lib/use-query-with-fallback';

export default function PerformancesPage() {
  const { data: performances } = useQueryWithFallback(['performances'], getPerformances, mockPerformances);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">공연</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(performances ?? []).map((show: any) => (
          <Card key={show.id} href={`/performances/${show.id}`}>
            <CardCover src={show.poster_image ?? show.posterImage} alt={show.title} />
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <PerformanceStatusBadge status={show.status} />
                <span className="text-xs text-accent font-mono-space">{formatPrice(show.ticket_price ?? show.ticketPrice ?? 0)}</span>
              </div>
              <h3 className="font-medium text-sm">{show.title}</h3>
              <p className="text-xs text-muted">{show.date} {show.start_time ?? show.startTime}~{show.end_time ?? show.endTime} · {show.venue?.name}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
