'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockReservations, type ReservationStatus } from '@/lib/mock-data';
import { ReservationStatusBadge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getMyReservations } from '@/lib/queries';
import { useQueryWithFallback } from '@/lib/use-query-with-fallback';

const FILTERS: { label: string; value: ReservationStatus | 'ALL' }[] = [
  { label: '전체', value: 'ALL' },
  { label: '대기중', value: 'PENDING' },
  { label: '승인', value: 'APPROVED' },
  { label: '거절', value: 'REJECTED' },
  { label: '취소', value: 'CANCELLED' },
];

export default function ReservationsPage() {
  const [filter, setFilter] = useState<ReservationStatus | 'ALL'>('ALL');
  const { data: reservations } = useQueryWithFallback(['myReservations'], getMyReservations, mockReservations);

  const filtered = filter === 'ALL'
    ? (reservations ?? [])
    : (reservations ?? []).filter((r: any) => r.status === filter);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">내 예약 관리</h1>
        <Link href="/reservations/new" className="px-4 py-2 bg-accent text-black rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors">+ 예약하기</Link>
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)} className={cn('px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors', filter === f.value ? 'bg-accent text-black' : 'bg-surface-card text-subtle border border-white/[0.07] hover:text-white')}>{f.label}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-center text-muted py-12">해당하는 예약이 없습니다.</p>}
        {filtered.map((res: any) => (
          <div key={res.id} className="p-4 bg-surface-card border border-white/[0.07] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <ReservationStatusBadge status={res.status} />
              <span className="text-xs text-muted">{res.venue?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{res.band?.name}</p>
                <p className="text-xs text-muted mt-0.5">{res.date} {res.start_time ?? res.startTime}~{res.end_time ?? res.endTime}</p>
              </div>
              <span className="text-xs px-2 py-0.5 bg-surface-elevated rounded-full text-subtle">{res.event_type ?? res.eventType}</span>
            </div>
            {(res.expected_size ?? res.expectedSize) && <p className="text-xs text-muted">예상 {res.expected_size ?? res.expectedSize}명</p>}
            {res.message && <p className="text-xs text-subtle bg-surface-elevated/50 p-2 rounded-lg">{res.message}</p>}
            {(res.reply_message ?? res.replyMessage) && (
              <div className="border-t border-white/[0.07] pt-2">
                <p className="text-[10px] text-muted mb-0.5">공연장 답변</p>
                <p className="text-xs text-subtle">{res.reply_message ?? res.replyMessage}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
