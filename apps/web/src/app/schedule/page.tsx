'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockRehearsals, mockPerformances } from '@/lib/mock-data';

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function SchedulePage() {
  const [tab, setTab] = useState<'rehearsal' | 'performance'>('rehearsal');
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const cells = getCalendarDays(year, month);

  const rehearsalDates = new Set(mockRehearsals.map((r) => r.date));
  const performanceDates = new Set(mockPerformances.map((p) => p.date.split('T')[0]));
  const eventDates = tab === 'rehearsal' ? rehearsalDates : performanceDates;

  const items = tab === 'rehearsal'
    ? mockRehearsals.map((r) => ({
        id: r.id,
        title: r.title,
        date: r.date,
        sub: `${r.startTime}-${r.endTime}  ${r.location}`,
        band: r.bandName,
        href: `/schedule/rehearsal/${r.id}`,
      }))
    : mockPerformances.map((p) => ({
        id: p.id,
        title: p.title,
        date: p.date.split('T')[0],
        sub: `${p.venue.name}  ${p.venue.address}`,
        band: p.bands.map((b) => b.name).join(', '),
        href: `/performances/${p.id}`,
      }));

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">일정</h1>
            <p className="mt-1 text-sm text-gray-500">합주와 공연 일정을 관리하세요</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/schedule/rehearsal/vote"
              className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
            >
              시간 조율
            </Link>
            <Link
              href="/schedule/rehearsal/new"
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              일정 등록
            </Link>
          </div>
        </div>

        {/* 탭 + 뷰 전환 */}
        <div className="flex gap-2 mb-6">
          {(['rehearsal', 'performance'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t === 'rehearsal' ? '합주' : '공연'}
            </button>
          ))}
          <div className="ml-auto flex gap-1">
            {(['calendar', 'list'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2 rounded-lg text-sm ${view === v ? 'bg-gray-200 font-medium' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {v === 'calendar' ? '캘린더' : '리스트'}
              </button>
            ))}
          </div>
        </div>

        {/* 캘린더 뷰 */}
        {view === 'calendar' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {year}년 {month + 1}월
            </h2>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayLabels.map((l) => (
                <div key={l} className="p-2 text-center text-xs font-medium text-gray-500">{l}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, idx) => {
                const dateStr = day ? `${year}-${pad(month + 1)}-${pad(day)}` : '';
                const hasEvent = day ? eventDates.has(dateStr) : false;
                return (
                  <div
                    key={idx}
                    className={`p-2 text-center rounded text-sm min-h-[40px] ${
                      day === null
                        ? ''
                        : hasEvent
                          ? 'bg-indigo-100 text-indigo-700 font-semibold'
                          : 'text-gray-700'
                    }`}
                  >
                    {day ?? ''}
                    {hasEvent && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mx-auto mt-0.5" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 리스트 */}
        <div className="space-y-3">
          {items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 mb-4">등록된 일정이 없습니다.</p>
              <Link
                href="/schedule/rehearsal/new"
                className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
              >
                첫 일정을 등록해 보세요
              </Link>
            </div>
          )}
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
              <p className="text-sm text-gray-500">{item.sub}</p>
              <p className="text-xs text-gray-400 mt-1">{item.band}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
