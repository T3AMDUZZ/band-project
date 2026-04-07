'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createPerformance, assignBandToPerformance } from '@/lib/api/performances';
import { getVenues } from '@/lib/api/venues';
import { getBands } from '@/lib/api/bands';
import RequireAuth from '@/components/auth/require-auth';

const inputClass = "w-full p-3 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm placeholder-muted focus:ring-2 focus:ring-accent/50 focus:border-accent/30 outline-none transition-all";

export default function NewPerformancePage() {
  const router = useRouter();
  const [venues, setVenues] = useState<any[]>([]);
  const [bands, setBands] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');
  const [venueId, setVenueId] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBands, setSelectedBands] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getVenues().then(setVenues).catch(() => {});
    getBands().then(setBands).catch(() => {});
  }, []);

  const toggleBand = (id: string) => {
    setSelectedBands((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const perf = await createPerformance({
        title,
        date: datetime,
        venueId: venueId || undefined,
        ticketPrice: price ? parseInt(price) : undefined,
        description: description || undefined,
      });
      // 출연 밴드 배정
      for (let i = 0; i < selectedBands.length; i++) {
        await assignBandToPerformance(perf.id, { bandId: selectedBands[i], playOrder: i + 1 });
      }
      router.push('/performances');
    } catch (err: any) {
      setError(err.response?.data?.message || '공연 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth>
    <section className="py-12 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-display text-[22px] tracking-[3px] text-muted">NEW PERFORMANCE</h1>
          <span className="flex-1 h-px bg-white/[0.07]" />
        </div>
        <p className="text-sm text-muted mb-8">새로운 공연 정보를 입력하세요</p>
        {error && <div className="mb-4 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">공연 제목</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="공연 제목을 입력하세요" className={inputClass} required />
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">공연 날짜 / 시간</label>
            <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">공연장</label>
            <select value={venueId} onChange={(e) => setVenueId(e.target.value)} className={inputClass}>
              <option value="">공연장을 선택하세요</option>
              {venues.map((v: any) => (<option key={v.id} value={v.id}>{v.name} ({v.address})</option>))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">입장료 (원)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min={0} placeholder="0" className={inputClass} />
          </div>
          <div>
            <span className="block text-[11px] font-mono-space text-muted mb-2">출연 밴드</span>
            <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-4 space-y-2 max-h-48 overflow-y-auto">
              {bands.length === 0 && <p className="text-xs text-muted">등록된 밴드가 없습니다</p>}
              {bands.map((band: any) => (
                <label key={band.id} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={selectedBands.includes(band.id)} onChange={() => toggleBand(band.id)} className="w-4 h-4 accent-amber-500" />
                  <span className="text-sm text-stone-50">{band.name}</span>
                  <div className="flex gap-1">
                    {(band.genre || []).map((g: string) => (
                      <span key={g} className="px-2 py-0.5 text-[10px] font-mono-space tracking-wider bg-accent/10 text-accent rounded">{g}</span>
                    ))}
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">공연 설명</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="공연에 대한 설명을 입력하세요" className={`${inputClass} resize-none`} />
          </div>
          <div className="flex items-center justify-between pt-4">
            <Link href="/performances" className="text-sm font-medium text-muted hover:text-accent transition-colors">&larr; 취소</Link>
            <button type="submit" disabled={loading} className="bg-accent text-surface px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors font-bold disabled:opacity-50">
              {loading ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </section>
    </RequireAuth>
  );
}
