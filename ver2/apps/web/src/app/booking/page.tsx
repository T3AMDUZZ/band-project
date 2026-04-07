'use client';

import Link from 'next/link';
import { mockVenues } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default function BookingPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">대관</h1>
          <p className="text-sm text-muted mt-1">공연장을 선택해 예약 요청을 보내세요</p>
        </div>
        <Link
          href="/reservations"
          className="px-4 py-2 bg-surface-elevated text-subtle border border-white/[0.07] rounded-lg text-sm hover:text-white transition-colors"
        >
          내 예약 보기
        </Link>
      </div>

      {/* Venue selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockVenues.map((venue) => (
          <Card key={venue.id} hoverable={false} className="p-0">
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{venue.name}</h3>
                  <p className="text-xs text-muted mt-0.5">{venue.address}</p>
                </div>
                <span className="text-xs text-subtle bg-surface-elevated px-2 py-0.5 rounded-full">
                  {venue.capacity}명
                </span>
              </div>

              {/* Quick info */}
              <div className="flex flex-wrap gap-1">
                {venue.amenities.slice(0, 4).map((a) => (
                  <span key={a} className="text-[10px] px-2 py-0.5 bg-surface-elevated rounded-full text-muted">
                    {a}
                  </span>
                ))}
              </div>

              {/* Fee */}
              <div className="flex gap-3 text-xs">
                {Object.entries(venue.rentalFee).map(([label, fee]) => (
                  <span key={label} className="text-subtle">
                    {label}: <span className="text-accent font-mono-space">{formatPrice(fee)}</span>
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Link
                  href={`/venues/${venue.id}`}
                  className="flex-1 text-center py-2 bg-surface-elevated text-subtle text-xs rounded-lg border border-white/[0.07] hover:text-white transition-colors"
                >
                  상세 정보
                </Link>
                <Link
                  href={`/reservations/new?venueId=${venue.id}`}
                  className="flex-1 text-center py-2 bg-accent text-black text-xs rounded-lg font-medium hover:bg-accent-hover transition-colors"
                >
                  예약 요청
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
