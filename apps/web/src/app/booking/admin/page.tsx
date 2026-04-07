'use client';

import { useState } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/auth/require-auth';

type CalendarStatus = 'AVAILABLE' | 'BLOCKED';

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

export default function BookingAdminPage() {
  const [tab, setTab] = useState<'requests' | 'calendar' | 'techrider' | 'notify'>('requests');
  const [venues] = useState<any[]>([]);
  const selectedVenue = venues.length > 0 ? venues[0] : null;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const [slotOverrides, setSlotOverrides] = useState<Record<number, CalendarStatus>>({});

  const getSlotStatus = (day: number): CalendarStatus => {
    return slotOverrides[day] || 'AVAILABLE';
  };

  const toggleSlot = (day: number) => {
    const current = getSlotStatus(day);
    setSlotOverrides((prev) => ({
      ...prev,
      [day]: current === 'AVAILABLE' ? 'BLOCKED' : 'AVAILABLE',
    }));
  };

  return (
    <RequireAuth>
      {!selectedVenue ? (
        <section className="py-12 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 text-center py-20">
            <h1 className="text-2xl font-bold text-stone-50 mb-4">공연장 관리</h1>
            <p className="text-muted">등록된 공연장이 없습니다.</p>
            <Link href="/venues/new" className="mt-4 inline-block text-sm text-accent font-medium hover:text-accent-hover transition-colors">
              공연장 등록하기
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-12 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/booking" className="text-sm text-accent hover:text-accent-hover transition-colors">&larr; 대관</Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-50">공연장 관리</h1>
                <p className="text-sm text-muted">{selectedVenue.name}</p>
              </div>
            </div>

            {/* 탭 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {([
                { key: 'requests' as const, label: '예약 요청' },
                { key: 'calendar' as const, label: '일정 캘린더' },
                { key: 'techrider' as const, label: 'TR 관리' },
                { key: 'notify' as const, label: '알림 발송' },
              ]).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tab === t.key ? 'bg-accent text-surface' : 'bg-surface-card border border-white/[0.07] text-muted hover:text-stone-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* 예약 요청 */}
            {tab === 'requests' && (
              <div className="bg-surface-card border border-white/[0.07] rounded-lg p-6 text-center py-16">
                <p className="text-muted">데이터가 없습니다</p>
              </div>
            )}

            {/* 일정 캘린더 (슬롯 관리) */}
            {tab === 'calendar' && (
              <div className="bg-surface-card border border-white/[0.07] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-stone-50 mb-2">{year}년 {month + 1}월</h2>
                <p className="text-xs text-muted mb-4">날짜를 클릭하여 차단/해제할 수 있습니다</p>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayLabels.map((l) => (
                    <div key={l} className="p-2 text-center text-xs font-medium text-muted">{l}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const status = getSlotStatus(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleSlot(day)}
                        className={`p-2 text-center rounded text-sm min-h-[40px] transition-all ${
                          status === 'AVAILABLE'
                            ? 'bg-green-500/10 text-green-500 hover:ring-1 hover:ring-green-400'
                            : 'bg-white/[0.06] text-muted hover:ring-1 hover:ring-white/[0.2]'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/10 inline-block" /> 가능</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white/[0.06] inline-block" /> 차단</span>
                </div>
              </div>
            )}

            {/* TR 관리 */}
            {tab === 'techrider' && (
              <div className="bg-surface-card border border-white/[0.07] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-stone-50 mb-4">공연장 테크라이더 템플릿</h2>
                <div className="text-center py-8">
                  <p className="text-muted mb-4">등록된 테크라이더 템플릿이 없습니다.</p>
                  <button onClick={() => alert('TR 등록')} className="px-5 py-2 bg-accent text-surface font-medium rounded-lg hover:bg-accent-hover text-sm transition-colors">
                    템플릿 등록
                  </button>
                </div>
              </div>
            )}

            {/* 알림 발송 */}
            {tab === 'notify' && (
              <div className="bg-surface-card border border-white/[0.07] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-stone-50 mb-4">알림 발송</h2>
                <div className="space-y-3">
                  {[
                    { type: '예약 승인/거절', desc: '예약 상태 변경 시 밴드에 알림', auto: true },
                    { type: '리허설 시간', desc: '공연 전 리허설 시간 안내', auto: false },
                    { type: 'D-day 알림', desc: '공연 당일 알림 일괄 발송', auto: false },
                  ].map((n) => (
                    <div key={n.type} className="flex items-center justify-between p-4 border border-white/[0.07] rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-stone-50">{n.type}</p>
                        <p className="text-xs text-muted">{n.desc}</p>
                      </div>
                      {n.auto ? (
                        <span className="px-3 py-1 text-xs font-medium bg-green-500/10 text-green-500 rounded-full">자동</span>
                      ) : (
                        <button
                          onClick={() => alert(`${n.type} 알림을 발송했습니다.`)}
                          className="px-4 py-1.5 text-xs font-medium bg-accent text-surface rounded-lg hover:bg-accent-hover transition-colors"
                        >
                          발송
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </RequireAuth>
  );
}
