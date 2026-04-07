'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { mockVenues, mockBands } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { getVenues, getMyBands, createReservation } from '@/lib/queries';
import { useQueryWithFallback } from '@/lib/use-query-with-fallback';

const EVENT_TYPES = ['공연', '합주', '녹음', '기타'];

export default function NewReservationPage() {
  return (
    <Suspense fallback={<div className="max-w-[600px] mx-auto px-4 py-6 text-muted">로딩 중...</div>}>
      <NewReservationForm />
    </Suspense>
  );
}

function NewReservationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const venueIdParam = searchParams.get('venueId');

  const { data: venues } = useQueryWithFallback<any[]>(['venues'], getVenues, mockVenues);
  const { data: myBandsData } = useQueryWithFallback<any[]>(
    ['myBands'],
    getMyBands,
    mockBands.slice(0, 1).map((b) => ({ band: b }))
  );

  const [form, setForm] = useState({
    venueId: venueIdParam || '',
    bandId: '',
    date: '',
    startTime: '',
    endTime: '',
    eventType: '',
    expectedSize: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedVenue = (venues ?? []).find((v: any) => v.id === form.venueId);
  const myBands = (myBandsData ?? []).map((item: any) => item.band || item);

  const handleChange = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createReservation({
        venue_id: form.venueId,
        band_id: form.bandId,
        date: form.date,
        start_time: form.startTime,
        end_time: form.endTime,
        event_type: form.eventType,
        expected_size: form.expectedSize ? parseInt(form.expectedSize) : null,
        message: form.message,
      });
      router.push('/reservations');
    } catch (err: any) {
      setError(err?.message || '예약 요청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">예약 요청</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm text-subtle">공연장</label>
          {venueIdParam && selectedVenue ? (
            <div className="px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm">
              {selectedVenue.name}<span className="text-muted ml-2 text-xs">{selectedVenue.address}</span>
            </div>
          ) : (
            <select value={form.venueId} onChange={(e) => handleChange('venueId', e.target.value)} required className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent">
              <option value="">공연장을 선택하세요</option>
              {(venues ?? []).map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-subtle">밴드</label>
          <select value={form.bandId} onChange={(e) => handleChange('bandId', e.target.value)} required className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent">
            <option value="">밴드를 선택하세요</option>
            {myBands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
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
          <label className="text-sm text-subtle">유형</label>
          <div className="flex gap-2">
            {EVENT_TYPES.map((type) => (
              <button key={type} type="button" onClick={() => handleChange('eventType', type)} className={`px-4 py-2 rounded-lg text-sm border transition-colors ${form.eventType === type ? 'bg-accent text-black border-accent' : 'bg-surface-card border-white/[0.07] text-subtle hover:text-white hover:border-white/20'}`}>{type}</button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-subtle">예상 인원</label>
          <input type="number" placeholder="명" value={form.expectedSize} onChange={(e) => handleChange('expectedSize', e.target.value)} min={1} className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-subtle">메시지</label>
          <textarea placeholder="공연장에 전달할 메시지를 입력하세요" value={form.message} onChange={(e) => handleChange('message', e.target.value)} rows={4} className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent resize-none" />
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? '전송 중...' : '예약 요청 보내기'}</Button>
      </form>
    </div>
  );
}
