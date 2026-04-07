'use client';

import { useState } from 'react';
import { mockReservations, mockVenueAvailability, type ReservationStatus, type AvailabilityStatus } from '@/lib/mock-data';
import { ReservationStatusBadge, AvailabilityDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export default function BookingAdminPage() {
  const [tab, setTab] = useState<'requests' | 'calendar'>('requests');
  const [year] = useState(2026);
  const [month] = useState(3); // April

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // All reservations as venue-side view
  const pendingReservations = mockReservations.filter((r) => r.status === 'PENDING');
  const otherReservations = mockReservations.filter((r) => r.status !== 'PENDING');

  const getAvailStatus = (day: number): AvailabilityStatus => {
    const dateStr = `2026-04-${String(day).padStart(2, '0')}`;
    return mockVenueAvailability.find((a) => a.date === dateStr)?.status ?? 'AVAILABLE';
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">공연장 관리</h1>
        <p className="text-sm text-muted mt-1">예약 요청 관리 및 일정 차단</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.07]">
        {[
          { key: 'requests' as const, label: `예약 요청 (${pendingReservations.length})` },
          { key: 'calendar' as const, label: '일정 관리' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'px-4 py-2.5 text-sm transition-colors relative',
              tab === t.key ? 'text-white' : 'text-muted hover:text-subtle'
            )}
          >
            {t.label}
            {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
          </button>
        ))}
      </div>

      {/* Requests Tab */}
      {tab === 'requests' && (
        <div className="space-y-6">
          {/* Pending */}
          {pendingReservations.length > 0 && (
            <section>
              <h2 className="font-medium text-sm text-warning mb-3">대기중인 요청</h2>
              <div className="space-y-3">
                {pendingReservations.map((res) => (
                  <div key={res.id} className="p-4 bg-surface-card border border-warning/20 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <ReservationStatusBadge status={res.status} />
                      <span className="text-xs text-muted">{res.venue?.name}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{res.band?.name}이(가) 예약 요청</p>
                      <p className="text-xs text-muted mt-0.5">
                        {res.date} {res.startTime}~{res.endTime} · {res.eventType}
                      </p>
                    </div>
                    {res.requestedBy && (
                      <p className="text-xs text-muted">신청자: {res.requestedBy}</p>
                    )}
                    {res.expectedSize && (
                      <p className="text-xs text-muted">{res.expectedSize}명 예상</p>
                    )}
                    {res.message && (
                      <p className="text-xs text-subtle bg-surface-elevated/50 p-2 rounded-lg">{res.message}</p>
                    )}
                    {/* Reply + actions */}
                    <div className="space-y-2 pt-1 border-t border-white/[0.07]">
                      <textarea
                        placeholder="답변을 입력하세요 (선택)"
                        rows={2}
                        className="w-full px-3 py-2 bg-surface-elevated border border-white/[0.07] rounded-lg text-xs resize-none focus:outline-none focus:border-accent"
                      />
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm" className="flex-1">승인</Button>
                        <Button variant="danger" size="sm" className="flex-1">거절</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Other reservations */}
          <section>
            <h2 className="font-medium text-sm text-subtle mb-3">처리 완료</h2>
            <div className="space-y-3">
              {otherReservations.map((res) => (
                <div key={res.id} className="p-4 bg-surface-card border border-white/[0.07] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <ReservationStatusBadge status={res.status} />
                    <span className="text-xs text-muted">{res.date} {res.startTime}~{res.endTime}</span>
                  </div>
                  <p className="text-sm">{res.band?.name} · {res.eventType}</p>
                  {res.replyMessage && (
                    <p className="text-xs text-subtle bg-surface-elevated/50 p-2 rounded-lg">답변: {res.replyMessage}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Calendar Tab */}
      {tab === 'calendar' && (
        <div className="bg-surface-card border border-white/[0.07] rounded-xl p-4">
          <p className="text-sm text-muted mb-4">날짜를 클릭하여 슬롯을 차단/해제할 수 있습니다.</p>

          <div className="text-center font-medium mb-4">{year}년 {month + 1}월</div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-[10px] text-muted py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const status = getAvailStatus(day);
              return (
                <button
                  key={day}
                  className={cn(
                    'flex flex-col items-center justify-center py-3 rounded-lg text-xs transition-colors',
                    status === 'AVAILABLE' && 'hover:bg-success/10 hover:text-success',
                    status === 'BOOKED' && 'bg-error/5',
                    status === 'BLOCKED' && 'bg-muted/10 opacity-50',
                  )}
                >
                  <span>{day}</span>
                  <AvailabilityDot status={status} />
                  <span className="text-[8px] text-muted mt-0.5">
                    {status === 'AVAILABLE' ? '가능' : status === 'BOOKED' ? '예약됨' : '차단'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 mt-4 text-[10px] text-muted">
            <span className="flex items-center gap-1"><AvailabilityDot status="AVAILABLE" /> 가능</span>
            <span className="flex items-center gap-1"><AvailabilityDot status="BOOKED" /> 예약됨</span>
            <span className="flex items-center gap-1"><AvailabilityDot status="BLOCKED" /> 차단</span>
          </div>
        </div>
      )}
    </div>
  );
}
