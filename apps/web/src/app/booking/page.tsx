'use client';

import { useState } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/auth/require-auth';

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

export default function BookingPage() {
  const [venues] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'form' | 'done'>('select');
  const [form, setForm] = useState({ bandName: '', members: '', genre: '', message: '' });

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('done');
  };

  return (
    <RequireAuth>
      {venues.length === 0 ? (
        <section className="py-12 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 text-center py-20">
            <h1 className="text-2xl font-bold text-stone-50 mb-4">대관</h1>
            <p className="text-muted mb-4">등록된 공연장이 없습니다.</p>
            <Link href="/venues/new" className="text-sm text-accent font-medium hover:text-accent-hover transition-colors">
              공연장 등록하기
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-12 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-50">대관</h1>
                <p className="mt-1 text-sm text-muted">공연장/합주실을 선택하고 예약하세요</p>
              </div>
              <Link
                href="/booking/admin"
                className="px-4 py-2 text-sm font-medium bg-surface-card border border-white/[0.07] rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                공연장 관리
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 공연장 선택 */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-muted mb-2">공연장 선택</h2>
                {venues.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVenue(v); setSelectedDate(null); setStep('select'); }}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedVenue?.id === v.id
                        ? 'bg-accent text-surface'
                        : 'bg-surface-card border border-white/[0.07] hover:border-white/[0.15]'
                    }`}
                  >
                    <p className="font-semibold text-sm">{v.name}</p>
                    <p className={`text-xs mt-1 ${selectedVenue?.id === v.id ? 'text-surface/70' : 'text-muted'}`}>
                      {v.address}
                    </p>
                    <p className={`text-xs mt-0.5 ${selectedVenue?.id === v.id ? 'text-surface/70' : 'text-muted'}`}>
                      {v.capacity}명 / {v.rentalFee}
                    </p>
                  </button>
                ))}
              </div>

              {/* 캘린더 + 폼 */}
              <div className="lg:col-span-2">
                {step === 'select' && selectedVenue && (
                  <>
                    <div className="bg-surface-card border border-white/[0.07] rounded-lg p-6 mb-6">
                      <h2 className="text-lg font-semibold text-stone-50 mb-4">
                        {year}년 {month + 1}월 - {selectedVenue.name}
                      </h2>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayLabels.map((l) => (
                          <div key={l} className="p-2 text-center text-xs font-medium text-muted">{l}</div>
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
                                  ? 'ring-2 ring-accent bg-accent/20 text-accent font-semibold'
                                  : isPast
                                    ? 'bg-white/[0.02] text-muted/50 cursor-default'
                                    : 'bg-green-500/10 text-green-500 cursor-pointer hover:ring-1 hover:ring-accent'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-4 flex gap-4 text-xs text-muted">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/10 inline-block" /> 예약 가능</span>
                      </div>
                    </div>

                    {selectedDate && (
                      <button
                        onClick={() => setStep('form')}
                        className="w-full px-6 py-3 bg-accent text-surface font-medium rounded-lg hover:bg-accent-hover text-sm transition-colors"
                      >
                        {selectedDate} 예약 신청
                      </button>
                    )}
                  </>
                )}

                {step === 'form' && selectedVenue && (
                  <div className="bg-surface-card border border-white/[0.07] rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-stone-50 mb-1">예약 정보 입력</h2>
                    <p className="text-sm text-muted mb-6">{selectedVenue.name} / {selectedDate}</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">밴드명</label>
                        <input type="text" value={form.bandName} onChange={(e) => update('bandName', e.target.value)} required className="w-full border border-white/[0.07] bg-surface rounded-lg px-3 py-2 text-sm text-stone-50" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">인원</label>
                          <input type="number" value={form.members} onChange={(e) => update('members', e.target.value)} required className="w-full border border-white/[0.07] bg-surface rounded-lg px-3 py-2 text-sm text-stone-50" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">장르</label>
                          <input type="text" value={form.genre} onChange={(e) => update('genre', e.target.value)} className="w-full border border-white/[0.07] bg-surface rounded-lg px-3 py-2 text-sm text-stone-50" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">메시지</label>
                        <textarea value={form.message} onChange={(e) => update('message', e.target.value)} rows={3} className="w-full border border-white/[0.07] bg-surface rounded-lg px-3 py-2 text-sm text-stone-50" />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button type="submit" className="px-6 py-2.5 bg-accent text-surface font-medium rounded-lg hover:bg-accent-hover text-sm transition-colors">
                          예약 신청
                        </button>
                        <button type="button" onClick={() => setStep('select')} className="px-6 py-2.5 bg-white/[0.06] text-subtle font-medium rounded-lg hover:bg-white/[0.1] text-sm transition-colors">
                          이전
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {step === 'done' && (
                  <div className="bg-surface-card border border-white/[0.07] rounded-lg p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-stone-50 mb-2">예약 신청 완료</h2>
                    <p className="text-sm text-muted mb-1">{selectedVenue?.name} / {selectedDate}</p>
                    <p className="text-sm text-muted mb-6">공연장 관리자 승인을 기다려 주세요.</p>
                    <div className="flex justify-center gap-3">
                      <button onClick={() => { setStep('select'); setSelectedDate(null); }} className="px-5 py-2 text-sm font-medium bg-accent text-surface rounded-lg hover:bg-accent-hover transition-colors">
                        확인
                      </button>
                      <Link href="/booking/admin" className="px-5 py-2 text-sm font-medium bg-white/[0.06] text-subtle rounded-lg hover:bg-white/[0.1] transition-colors">
                        상태 확인
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </RequireAuth>
  );
}
