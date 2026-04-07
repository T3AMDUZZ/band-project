'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function VenuesPage() {
  const supabase = createClient();
  const [venues, setVenues] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('venues')
      .select('id, name, address, capacity, phone, amenities')
      .order('created_at', { ascending: false })
      .then(({ data }) => setVenues(data ?? []));
  }, [supabase]);

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-[18px] tracking-[3px] text-muted">VENUES</h1>
              <span className="flex-1 h-px bg-white/[0.07] min-w-[40px]" />
            </div>
            <p className="text-sm text-muted">대전 지역 공연장을 찾아보세요</p>
          </div>
          <Link href="/venues/new" className="px-6 py-2.5 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors">
            공연장 등록
          </Link>
        </div>
        {venues.length === 0 ? (
          <p className="text-center text-muted py-20">등록된 공연장이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <Link key={venue.id} href={`/venues/${venue.id}`} className="bg-surface-card border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all p-5 group">
                <h3 className="text-lg font-bold text-stone-50 group-hover:text-accent transition-colors">{venue.name}</h3>
                <div className="mt-3 space-y-2 text-sm text-subtle">
                  <p className="flex items-center gap-2"><span>📍</span><span>{venue.address}</span></p>
                  {venue.capacity && <p className="flex items-center gap-2"><span>👥</span><span className="font-mono-space text-xs">수용 인원 {venue.capacity}명</span></p>}
                  {venue.phone && <p className="flex items-center gap-2"><span>📞</span><span className="font-mono-space text-xs">{venue.phone}</span></p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
