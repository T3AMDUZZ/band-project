'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getVenueById, getVenueAvailability } from '@/lib/queries';
import { formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AvailabilityDot } from '@/components/ui/badge';
import type { AvailabilityStatus } from '@/lib/mock-data';

// amenity icons removed — text-only labels for clean design
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function Calendar({ venueId }: { venueId: string }) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3);

  const { data: availability } = useQuery({
    queryKey: ['venueAvailability', venueId],
    queryFn: () => getVenueAvailability(venueId),
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getStatus = (day: number): AvailabilityStatus => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const found = (availability || []).find((a: any) => a.date === dateStr);
    return (found?.status as AvailabilityStatus) ?? 'AVAILABLE';
  };

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); };

  return (
    <div className="bg-surface-card border border-white/[0.07] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 text-subtle hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
        <span className="font-medium text-sm">{year}년 {month + 1}월</span>
        <button onClick={nextMonth} className="p-1 text-subtle hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">{DAY_NAMES.map((d) => <div key={d} className="text-center text-[10px] text-muted py-1">{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const status = getStatus(day);
          return (
            <div key={day} className={cn('relative flex flex-col items-center justify-center py-2 rounded-lg text-xs', status === 'AVAILABLE' && 'hover:bg-surface-elevated cursor-pointer', status === 'BOOKED' && 'opacity-60', status === 'BLOCKED' && 'opacity-30')}>
              <span>{day}</span><AvailabilityDot status={status} />
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 text-[10px] text-muted">
        <span className="flex items-center gap-1"><AvailabilityDot status="AVAILABLE" /> 가능</span>
        <span className="flex items-center gap-1"><AvailabilityDot status="BOOKED" /> 예약됨</span>
        <span className="flex items-center gap-1"><AvailabilityDot status="BLOCKED" /> 불가</span>
      </div>
    </div>
  );
}

export default function VenueDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [photoIdx, setPhotoIdx] = useState(0);

  const { data: venue, isLoading } = useQuery({
    queryKey: ['venue', id],
    queryFn: () => getVenueById(id),
  });

  if (isLoading) return <div className="max-w-[1200px] mx-auto px-4 py-20 text-center text-muted">로딩 중...</div>;
  if (!venue) return (
    <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
      <p className="text-muted">공연장을 찾을 수 없습니다.</p>
      <Link href="/venues" className="text-accent text-sm mt-2 inline-block">목록으로 돌아가기</Link>
    </div>
  );

  const photos = venue.photos || [];
  const amenities = venue.amenities || [];
  const operatingHours = venue.operating_hours || venue.operatingHours || {};
  const rentalFee = venue.rental_fee || venue.rentalFee || {};

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">
      {/* Photo Gallery */}
      <section className="relative rounded-2xl overflow-hidden bg-surface-elevated aspect-[16/7] flex items-center justify-center">
        {photos.length > 0 ? (
          <>
            <img src={photos[photoIdx]} alt={`${venue.name} 사진 ${photoIdx + 1}`} className="w-full h-full object-cover" />
            {photos.length > 1 && (
              <>
                <button onClick={() => setPhotoIdx((p: number) => (p === 0 ? photos.length - 1 : p - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">◀</button>
                <button onClick={() => setPhotoIdx((p: number) => (p === photos.length - 1 ? 0 : p + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">▶</button>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted/40">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm">사진 없음</span>
          </div>
        )}
      </section>

      {/* Basic Info */}
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">{venue.name}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-subtle">
          <span>{venue.address}</span>
          {venue.phone && <span>{venue.phone}</span>}
          <span>수용 {venue.capacity}명</span>
        </div>
        {venue.description && <p className="text-sm text-subtle leading-relaxed">{venue.description}</p>}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {amenities.map((a: string) => (
              <span key={a} className="inline-flex items-center px-3 py-1.5 bg-surface-card border border-white/[0.07] rounded-lg text-xs text-subtle">{a}</span>
            ))}
          </div>
        )}
        {venue.manager && <div className="text-xs text-muted">관리자: {venue.manager.nickname || venue.manager.name}</div>}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Operating Hours */}
        {Object.keys(operatingHours).length > 0 && (
          <section className="bg-surface-card border border-white/[0.07] rounded-xl p-4">
            <h2 className="font-medium text-sm mb-3">운영시간</h2>
            <div className="space-y-1.5">
              {Object.entries(operatingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between text-sm">
                  <span className="text-subtle w-8">{day}</span>
                  <span className={cn('font-mono-space text-xs', hours === '휴무' ? 'text-muted' : 'text-white')}>{hours as string}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Rental Fee */}
        {Object.keys(rentalFee).length > 0 && (
          <section className="bg-surface-card border border-white/[0.07] rounded-xl p-4">
            <h2 className="font-medium text-sm mb-3">대관 요금</h2>
            <div className="space-y-2">
              {Object.entries(rentalFee).map(([label, fee]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-subtle">{label}</span>
                  <span className="font-mono-space text-accent text-sm">{formatPrice(fee as number)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Calendar */}
      <section>
        <h2 className="font-medium text-sm mb-3">가용 일정</h2>
        <Calendar venueId={venue.id} />
      </section>

      {/* Map */}
      {venue.latitude && venue.longitude && (
        <section className="bg-surface-card border border-white/[0.07] rounded-xl p-4">
          <h2 className="font-medium text-sm mb-3">위치</h2>
          <div className="w-full aspect-[16/7] bg-surface-elevated rounded-lg flex items-center justify-center text-muted text-sm">지도 영역 (위도: {venue.latitude}, 경도: {venue.longitude})</div>
        </section>
      )}

      {/* CTA */}
      <div className="sticky bottom-16 md:bottom-0 z-40 bg-surface/95 backdrop-blur-md py-3 -mx-4 px-4 border-t border-white/[0.07]">
        <Link href={`/reservations/new?venueId=${venue.id}`} className="block"><Button size="lg" className="w-full">예약 요청하기</Button></Link>
      </div>
    </div>
  );
}
