'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockVenues, mockPerformances } from '@/lib/mock-data';
import { formatDate, formatPrice } from '@/lib/utils';

type CalendarStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | null;

function generateCalendarData(): { day: number; status: CalendarStatus }[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const statuses: CalendarStatus[] = ['AVAILABLE', 'BOOKED', 'BLOCKED', null];
  const cells: { day: number; status: CalendarStatus }[] = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: 0, status: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const rand = (d * 7 + 3) % 4;
    cells.push({ day: d, status: statuses[rand] });
  }
  return cells;
}

const statusStyles: Record<string, string> = {
  AVAILABLE: 'bg-green-500/10 text-green-500 cursor-pointer border border-green-500/20',
  BOOKED: 'bg-red-500/10 text-red-500 border border-red-500/20',
  BLOCKED: 'bg-white/[0.04] text-muted border border-white/[0.07]',
};

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

export default function VenueDetailPage() {
  const params = useParams();
  const venue = mockVenues.find((v) => v.id === params.id);

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">공연장을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const relatedPerformances = mockPerformances.filter((p) => p.venue.name === venue.name);
  const calendar = generateCalendarData();
  const now = new Date();
  const monthLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl sm:text-4xl tracking-[2px] text-stone-50">{venue.name}</h1>
          <Link href={`/venues/${venue.id}/edit`} className="px-5 py-2 border border-accent/30 text-accent font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm">
            수정
          </Link>
        </div>

        {/* Info */}
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-[16px] tracking-[2px] text-muted">INFO</h2>
            <span className="flex-1 h-px bg-white/[0.07]" />
          </div>
          <div className="space-y-3 text-sm text-subtle">
            <p className="flex items-center gap-2">📍 <span>{venue.address}</span></p>
            <p className="flex items-center gap-2">👥 <span className="font-mono-space text-xs">수용 인원 {venue.capacity}명</span></p>
            <p className="flex items-center gap-2">🕐 <span className="text-muted">정보 없음</span></p>
            <p className="flex items-center gap-2">💰 <span className="font-mono-space text-xs">{venue.rentalFee}</span></p>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-[16px] tracking-[2px] text-muted">CALENDAR — {monthLabel}</h2>
            <span className="flex-1 h-px bg-white/[0.07]" />
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayLabels.map((label) => (
              <div key={label} className="p-2 text-center text-xs font-mono-space font-bold text-muted">{label}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendar.map((cell, idx) => (
              <div key={idx} className={`p-2 text-center rounded text-sm font-mono-space ${
                cell.day === 0 ? '' : cell.status ? statusStyles[cell.status] : 'text-muted'
              }`}>
                {cell.day > 0 ? cell.day : ''}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30 inline-block" /> 예약 가능</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30 inline-block" /> 예약됨</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white/[0.04] border border-white/[0.07] inline-block" /> 차단됨</span>
          </div>
        </div>

        {/* Reservation Button */}
        <div className="mb-8">
          <button onClick={() => alert('예약 요청이 전송되었습니다.')} className="w-full px-8 py-3 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors">
            예약 요청
          </button>
        </div>

        {/* Related Performances */}
        {relatedPerformances.length > 0 && (
          <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-display text-[16px] tracking-[2px] text-muted">PERFORMANCES</h2>
              <span className="flex-1 h-px bg-white/[0.07]" />
            </div>
            <div className="space-y-4">
              {relatedPerformances.map((perf) => (
                <Link key={perf.id} href={`/performances/${perf.id}`} className="block p-4 border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all">
                  <p className="text-sm text-accent font-mono-space font-medium">{formatDate(perf.date)}</p>
                  <h3 className="mt-1 font-bold text-stone-50">{perf.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {perf.bands.map((band) => (
                      <span key={band.id} className="inline-block px-2 py-0.5 text-[10px] font-mono-space tracking-wider bg-accent/10 text-accent rounded">{band.name}</span>
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-bold text-accent">{formatPrice(perf.ticketPrice)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
