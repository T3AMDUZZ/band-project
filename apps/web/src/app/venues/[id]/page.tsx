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
  AVAILABLE: 'bg-green-100 text-green-700 cursor-pointer',
  BOOKED: 'bg-red-100 text-red-700',
  BLOCKED: 'bg-gray-100 text-gray-400',
};

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

export default function VenueDetailPage() {
  const params = useParams();
  const venue = mockVenues.find((v) => v.id === params.id);

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">공연장을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const relatedPerformances = mockPerformances.filter(
    (p) => p.venue.name === venue.name
  );

  const calendar = generateCalendarData();
  const now = new Date();
  const monthLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{venue.name}</h1>
          <Link
            href={`/venues/${venue.id}/edit`}
            className="px-5 py-2 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
          >
            수정
          </Link>
        </div>

        {/* Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">공연장 정보</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span>📍</span>
              <span>{venue.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <span>👥</span>
              <span>수용 인원 {venue.capacity}명</span>
            </p>
            <p className="flex items-center gap-2">
              <span>🕐</span>
              <span>정보 없음</span>
            </p>
            <p className="flex items-center gap-2">
              <span>💰</span>
              <span>{venue.rentalFee}</span>
            </p>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">가용 일정 - {monthLabel}</h2>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayLabels.map((label) => (
              <div key={label} className="p-2 text-center text-xs font-medium text-gray-500">
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendar.map((cell, idx) => (
              <div
                key={idx}
                className={`p-2 text-center rounded text-sm ${
                  cell.day === 0
                    ? ''
                    : cell.status
                      ? statusStyles[cell.status]
                      : 'text-gray-700'
                }`}
              >
                {cell.day > 0 ? cell.day : ''}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-100 inline-block" /> 예약 가능
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-100 inline-block" /> 예약됨
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-gray-100 inline-block" /> 차단됨
            </span>
          </div>
        </div>

        {/* Reservation Button */}
        <div className="mb-8">
          <button
            onClick={() => alert('예약 요청이 전송되었습니다.')}
            className="w-full px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            예약 요청
          </button>
        </div>

        {/* Related Performances */}
        {relatedPerformances.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">이 공연장에서 열린 공연</h2>
            <div className="space-y-4">
              {relatedPerformances.map((perf) => (
                <Link
                  key={perf.id}
                  href={`/performances/${perf.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm text-indigo-600 font-medium">{formatDate(perf.date)}</p>
                  <h3 className="mt-1 font-semibold text-gray-900">{perf.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {perf.bands.map((band) => (
                      <span
                        key={band.id}
                        className="inline-block px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full"
                      >
                        {band.name}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{formatPrice(perf.ticketPrice)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
