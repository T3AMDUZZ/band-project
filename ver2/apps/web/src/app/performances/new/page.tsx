'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockVenues, mockBands } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';

interface LineupEntry {
  bandId: string;
  setlist: string;
}

export default function NewPerformancePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    venueId: '',
    ticketPrice: '',
  });
  const [lineup, setLineup] = useState<LineupEntry[]>([{ bandId: '', setlist: '' }]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addLineup = () => {
    setLineup((prev) => [...prev, { bandId: '', setlist: '' }]);
  };

  const updateLineup = (idx: number, field: keyof LineupEntry, value: string) => {
    setLineup((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const removeLineup = (idx: number) => {
    if (lineup.length <= 1) return;
    setLineup((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('공연이 등록되었습니다! (mock)');
    router.push('/performances');
  };

  return (
    <div className="max-w-[600px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">공연 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm text-subtle">공연명</label>
          <input
            type="text"
            placeholder="예: 봄맞이 인디 페스티벌"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-subtle">설명</label>
          <textarea
            placeholder="공연에 대해 설명해주세요"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-subtle">날짜</label>
          <DatePicker value={form.date} onChange={(v) => handleChange('date', v)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm text-subtle">시작</label>
            <TimePicker value={form.startTime} onChange={(v) => handleChange('startTime', v)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-subtle">종료</label>
            <TimePicker value={form.endTime} onChange={(v) => handleChange('endTime', v)} required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-subtle">공연장</label>
          <select
            value={form.venueId}
            onChange={(e) => handleChange('venueId', e.target.value)}
            required
            className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent"
          >
            <option value="">공연장을 선택하세요</option>
            {mockVenues.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-subtle">입장료 (0 = 무료)</label>
          <input
            type="number"
            placeholder="0"
            value={form.ticketPrice}
            onChange={(e) => handleChange('ticketPrice', e.target.value)}
            min={0}
            className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent"
          />
        </div>

        {/* Lineup */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-subtle">출연 밴드</label>
            <button
              type="button"
              onClick={addLineup}
              className="text-xs text-accent hover:text-accent-hover transition-colors"
            >
              + 밴드 추가
            </button>
          </div>
          {lineup.map((entry, idx) => (
            <div key={idx} className="p-3 bg-surface-card border border-white/[0.07] rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/15 text-accent text-xs flex items-center justify-center font-mono-space flex-shrink-0">
                  {idx + 1}
                </span>
                <select
                  value={entry.bandId}
                  onChange={(e) => updateLineup(idx, 'bandId', e.target.value)}
                  className="flex-1 px-3 py-2 bg-surface-elevated border border-white/[0.07] rounded-lg text-xs focus:outline-none focus:border-accent"
                >
                  <option value="">밴드 선택</option>
                  {mockBands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                {lineup.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLineup(idx)}
                    className="text-xs text-error hover:text-error/80"
                  >
                    삭제
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="셋리스트 (쉼표로 구분: 곡1, 곡2, 곡3)"
                value={entry.setlist}
                onChange={(e) => updateLineup(idx, 'setlist', e.target.value)}
                className="w-full px-3 py-2 bg-surface-elevated border border-white/[0.07] rounded-lg text-xs focus:outline-none focus:border-accent"
              />
            </div>
          ))}
        </div>

        <Button type="submit" size="lg" className="w-full">
          공연 등록하기
        </Button>
      </form>
    </div>
  );
}
