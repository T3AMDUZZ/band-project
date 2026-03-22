'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockVenues, mockVenueTRTemplates } from '@/lib/mock-data';

type CalendarStatus = 'AVAILABLE' | 'BLOCKED';
type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

const statusBadge: Record<RequestStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};
const statusLabel: Record<RequestStatus, string> = {
  PENDING: '대기',
  APPROVED: '승인',
  REJECTED: '거절',
};

export default function BookingAdminPage() {
  const [tab, setTab] = useState<'requests' | 'calendar' | 'techrider' | 'notify'>('requests');
  const selectedVenue = mockVenues.length > 0 ? mockVenues[0] : null;

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

  const tr = selectedVenue ? mockVenueTRTemplates[selectedVenue.id] : null;

  if (!selectedVenue) {
    return (
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">공연장 관리</h1>
          <p className="text-gray-400">등록된 공연장이 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/booking" className="text-sm text-indigo-600 hover:text-indigo-700">← 대관</Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">공연장 관리</h1>
            <p className="text-sm text-gray-500">{selectedVenue.name}</p>
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
                tab === t.key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 예약 요청 — 빈 상태 */}
        {tab === 'requests' && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center py-16">
            <p className="text-gray-400">아직 받은 예약 요청이 없습니다.</p>
          </div>
        )}

        {/* 일정 캘린더 (슬롯 관리) */}
        {tab === 'calendar' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{year}년 {month + 1}월</h2>
            <p className="text-xs text-gray-400 mb-4">날짜를 클릭하여 차단/해제할 수 있습니다</p>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayLabels.map((l) => (
                <div key={l} className="p-2 text-center text-xs font-medium text-gray-500">{l}</div>
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
                        ? 'bg-green-100 text-green-700 hover:ring-1 hover:ring-green-400'
                        : 'bg-gray-200 text-gray-400 hover:ring-1 hover:ring-gray-400'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 inline-block" /> 가능</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 inline-block" /> 차단</span>
            </div>
          </div>
        )}

        {/* TR 관리 */}
        {tab === 'techrider' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">공연장 테크라이더 템플릿</h2>
            {tr ? (
              <>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">채널</p>
                      <p className="font-medium">{tr.channels}ch</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">모니터</p>
                      <p className="font-medium">{tr.monitors}대</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">마이크</p>
                    <p className="font-medium">{tr.mics.join(', ')}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">앰프</p>
                    <p className="font-medium">{tr.amps.join(', ')}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">드럼</p>
                    <p className="font-medium">{tr.drums}</p>
                  </div>
                  {tr.memo && (
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">비고</p>
                      <p className="font-medium">{tr.memo}</p>
                    </div>
                  )}
                </div>
                <button onClick={() => alert('TR 수정')} className="mt-4 px-5 py-2 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 text-sm">
                  수정
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">등록된 테크라이더 템플릿이 없습니다.</p>
                <button onClick={() => alert('TR 등록')} className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 text-sm">
                  템플릿 등록
                </button>
              </div>
            )}
          </div>
        )}

        {/* 알림 발송 */}
        {tab === 'notify' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">알림 발송</h2>
            <div className="space-y-3">
              {[
                { type: '예약 승인/거절', desc: '예약 상태 변경 시 밴드에 알림', auto: true },
                { type: '리허설 시간', desc: '공연 전 리허설 시간 안내', auto: false },
                { type: 'D-day 알림', desc: '공연 당일 알림 일괄 발송', auto: false },
              ].map((n) => (
                <div key={n.type} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{n.type}</p>
                    <p className="text-xs text-gray-500">{n.desc}</p>
                  </div>
                  {n.auto ? (
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">자동</span>
                  ) : (
                    <button
                      onClick={() => alert(`${n.type} 알림을 발송했습니다.`)}
                      className="px-4 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
  );
}
