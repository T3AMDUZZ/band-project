'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockVenues, mockVenueTRTemplates } from '@/lib/mock-data';

type CalendarStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED';

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

const statusStyle: Record<CalendarStatus, string> = {
  AVAILABLE: 'bg-green-100 text-green-700',
  BOOKED: 'bg-red-100 text-red-700',
  BLOCKED: 'bg-gray-100 text-gray-400',
};

export default function BookingPage() {
  const [selectedVenue, setSelectedVenue] = useState(mockVenues.length > 0 ? mockVenues[0] : null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'form' | 'done'>('select');
  const [form, setForm] = useState({ bandName: '', members: '', genre: '', message: '' });

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const tr = selectedVenue ? mockVenueTRTemplates[selectedVenue.id] : null;

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('done');
  };

  if (mockVenues.length === 0) {
    return (
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">대관</h1>
          <p className="text-gray-400 mb-4">등록된 공연장이 없습니다.</p>
          <Link href="/venues/new" className="text-sm text-indigo-600 font-medium">
            공연장 등록하기
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">대관</h1>
            <p className="mt-1 text-sm text-gray-500">공연장/합주실을 선택하고 예약하세요</p>
          </div>
          <Link
            href="/booking/admin"
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
          >
            공연장 관리
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 공연장 선택 */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">공연장 선택</h2>
            {mockVenues.map((v) => (
              <button
                key={v.id}
                onClick={() => { setSelectedVenue(v); setSelectedDate(null); setStep('select'); }}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedVenue?.id === v.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white shadow-sm hover:bg-gray-50'
                }`}
              >
                <p className="font-semibold text-sm">{v.name}</p>
                <p className={`text-xs mt-1 ${selectedVenue?.id === v.id ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {v.address}
                </p>
                <p className={`text-xs mt-0.5 ${selectedVenue?.id === v.id ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {v.capacity}명 / {v.rentalFee}
                </p>
              </button>
            ))}
          </div>

          {/* 캘린더 + 폼 */}
          <div className="lg:col-span-2">
            {step === 'select' && selectedVenue && (
              <>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {year}년 {month + 1}월 - {selectedVenue.name}
                  </h2>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayLabels.map((l) => (
                      <div key={l} className="p-2 text-center text-xs font-medium text-gray-500">{l}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                      const isPast = new Date(dateStr) < new Date(now.toISOString().split('T')[0]);
                      return (
                        <button
                          key={day}
                          disabled={isPast}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`p-2 text-center rounded text-sm min-h-[40px] transition-colors ${
                            selectedDate === dateStr
                              ? 'ring-2 ring-indigo-600 bg-indigo-100 text-indigo-700 font-semibold'
                              : isPast
                                ? 'bg-gray-50 text-gray-300 cursor-default'
                                : 'bg-green-100 text-green-700 cursor-pointer hover:ring-1 hover:ring-indigo-400'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 inline-block" /> 예약 가능</span>
                  </div>
                </div>

                {selectedDate && (
                  <button
                    onClick={() => setStep('form')}
                    className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    {selectedDate} 예약 신청
                  </button>
                )}
              </>
            )}

            {step === 'form' && selectedVenue && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">예약 정보 입력</h2>
                <p className="text-sm text-gray-500 mb-6">{selectedVenue.name} / {selectedDate}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">밴드명</label>
                    <input type="text" value={form.bandName} onChange={(e) => update('bandName', e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">인원</label>
                      <input type="number" value={form.members} onChange={(e) => update('members', e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">장르</label>
                      <input type="text" value={form.genre} onChange={(e) => update('genre', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">메시지</label>
                    <textarea value={form.message} onChange={(e) => update('message', e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>

                  {tr && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">테크라이더 (자동 첨부)</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <p>채널: {tr.channels}ch</p>
                        <p>모니터: {tr.monitors}대</p>
                        <p>마이크: {tr.mics.join(', ')}</p>
                        <p>앰프: {tr.amps.join(', ')}</p>
                        <p>드럼: {tr.drums}</p>
                        {tr.memo && <p className="col-span-2">비고: {tr.memo}</p>}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 text-sm">
                      예약 신청
                    </button>
                    <button type="button" onClick={() => setStep('select')} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 text-sm">
                      이전
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 'done' && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">예약 신청 완료</h2>
                <p className="text-sm text-gray-500 mb-1">{selectedVenue?.name} / {selectedDate}</p>
                <p className="text-sm text-gray-400 mb-6">공연장 관리자 승인을 기다려 주세요.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => { setStep('select'); setSelectedDate(null); }} className="px-5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    확인
                  </button>
                  <Link href="/booking/admin" className="px-5 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    상태 확인
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
