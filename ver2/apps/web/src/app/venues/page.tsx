'use client';

import { mockVenues } from '@/lib/mock-data';
import { Card, CardCover } from '@/components/ui/card';
import { getVenues } from '@/lib/queries';
import { useQueryWithFallback } from '@/lib/use-query-with-fallback';

export default function VenuesPage() {
  const { data: venues } = useQueryWithFallback(['venues'], getVenues, mockVenues);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">공연장</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(venues ?? []).map((venue: any) => (
          <Card key={venue.id} href={`/venues/${venue.id}`}>
            <CardCover src={(venue.photos || [])[0] || null} alt={venue.name} />
            <div className="p-4 space-y-2">
              <h3 className="font-medium">{venue.name}</h3>
              <p className="text-xs text-muted">{venue.address}</p>
              <div className="flex items-center gap-3 text-xs text-subtle">
                <span>{venue.capacity}명</span>
                <span>{venue.phone || '-'}</span>
              </div>
              {(venue.amenities || []).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(venue.amenities || []).slice(0, 3).map((a: string) => (
                    <span key={a} className="text-[10px] px-2 py-0.5 bg-surface-elevated rounded-full text-subtle">{a}</span>
                  ))}
                  {(venue.amenities || []).length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 bg-surface-elevated rounded-full text-muted">+{venue.amenities.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
