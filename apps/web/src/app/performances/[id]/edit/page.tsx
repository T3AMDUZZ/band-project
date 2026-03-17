'use client';

import { use } from 'react';
import Link from 'next/link';
import { mockPerformances, mockVenues, mockBands } from '@/lib/mock-data';

const inputClass = "w-full p-3 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm placeholder-muted focus:ring-2 focus:ring-accent/50 focus:border-accent/30 outline-none transition-all";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditPerformancePage({ params }: Props) {
  const { id } = use(params);
  const performance = mockPerformances.find((p) => p.id === id);

  if (!performance) {
    return (
      <section className="py-20 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-stone-50">공연을 찾을 수 없습니다</h1>
          <p className="mt-2 text-muted">수정할 공연 정보가 존재하지 않습니다.</p>
          <Link href="/performances" className="mt-6 inline-block bg-accent text-surface px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors font-bold">
            목록으로
          </Link>
        </div>
      </section>
    );
  }

  const datetimeValue = performance.date.slice(0, 16);
  const matchedVenue = mockVenues.find((v) => v.name === performance.venue.name);
  const venueId = matchedVenue?.id ?? '';
  const performanceBandIds = performance.bands.map((b) => b.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('API 연동 후 사용 가능합니다');
  };

  return (
    <section className="py-12 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-display text-[22px] tracking-[3px] text-muted">EDIT PERFORMANCE</h1>
          <span className="flex-1 h-px bg-white/[0.07]" />
        </div>
        <p className="text-sm text-muted mb-8">공연 정보를 수정하세요</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-[11px] font-mono-space text-muted mb-2">공연 제목</label>
            <input type="text" id="title" defaultValue={performance.title} className={inputClass} />
          </div>

          <div>
            <label htmlFor="datetime" className="block text-[11px] font-mono-space text-muted mb-2">공연 날짜 / 시간</label>
            <input type="datetime-local" id="datetime" defaultValue={datetimeValue} className={inputClass} />
          </div>

          <div>
            <label htmlFor="venue" className="block text-[11px] font-mono-space text-muted mb-2">공연장</label>
            <select id="venue" defaultValue={venueId} className={inputClass}>
              <option value="" disabled>공연장을 선택하세요</option>
              {mockVenues.map((venue) => (
                <option key={venue.id} value={venue.id}>{venue.name} ({venue.address})</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-[11px] font-mono-space text-muted mb-2">입장료 (원)</label>
            <input type="number" id="price" min={0} defaultValue={performance.ticketPrice} className={inputClass} />
          </div>

          <div>
            <span className="block text-[11px] font-mono-space text-muted mb-2">출연 밴드</span>
            <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-4 space-y-2 max-h-48 overflow-y-auto">
              {mockBands.map((band) => (
                <label key={band.id} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" value={band.id} defaultChecked={performanceBandIds.includes(band.id)} className="w-4 h-4 accent-amber-500 bg-surface border-white/[0.07] rounded" />
                  <span className="text-sm text-stone-50">{band.name}</span>
                  <div className="flex gap-1">
                    {band.genre.map((g) => (
                      <span key={g} className="inline-block px-2 py-0.5 text-[10px] font-mono-space tracking-wider bg-accent/10 text-accent rounded">{g}</span>
                    ))}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-[11px] font-mono-space text-muted mb-2">공연 설명</label>
            <textarea id="description" rows={4} placeholder="공연에 대한 설명을 입력하세요" className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label htmlFor="poster" className="block text-[11px] font-mono-space text-muted mb-2">포스터 이미지</label>
            <input type="file" id="poster" accept="image/*" disabled className="w-full p-3 border border-white/[0.07] rounded-lg bg-surface-card text-muted cursor-not-allowed text-sm" />
            <p className="mt-1 text-xs text-muted">이미지 업로드는 추후 지원 예정입니다</p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Link href={`/performances/${id}`} className="text-sm font-medium text-muted hover:text-accent transition-colors">&larr; 취소</Link>
            <button type="submit" className="bg-accent text-surface px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors font-bold">수정하기</button>
          </div>
        </form>
      </div>
    </section>
  );
}
