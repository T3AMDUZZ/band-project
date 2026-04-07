'use client';

import { useState, useMemo } from 'react';
import { mockBands } from '@/lib/mock-data';
import { Card, CardCover } from '@/components/ui/card';
import { BandStatusBadge, GenreTag } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getBands } from '@/lib/queries';
import { useQueryWithFallback } from '@/lib/use-query-with-fallback';

export default function BandsPage() {
  const { data: bands } = useQueryWithFallback(['bands'], getBands, mockBands);

  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const allGenres = useMemo(
    () => Array.from(new Set((bands ?? []).flatMap((b: any) => b.genre || []))),
    [bands]
  );

  const filtered = useMemo(() => {
    return (bands ?? []).filter((b: any) => {
      if (genreFilter && !(b.genre || []).includes(genreFilter)) return false;
      if (statusFilter && b.status !== statusFilter) return false;
      return true;
    });
  }, [bands, genreFilter, statusFilter]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">밴드 탐색</h1>

      <div className="space-y-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setGenreFilter(null)} className={cn('px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors', !genreFilter ? 'bg-accent text-black' : 'bg-surface-card text-subtle border border-white/[0.07] hover:text-white')}>전체</button>
          {allGenres.map((g: any) => (
            <button key={g} onClick={() => setGenreFilter(g === genreFilter ? null : g)} className={cn('px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors', genreFilter === g ? 'bg-accent text-black' : 'bg-surface-card text-subtle border border-white/[0.07] hover:text-white')}>{g}</button>
          ))}
        </div>
        <div className="flex gap-2">
          {[{ label: '전체', value: null }, { label: '활동중', value: 'ACTIVE' }, { label: '휴식중', value: 'HIATUS' }, { label: '해체', value: 'DISBANDED' }].map((f) => (
            <button key={f.label} onClick={() => setStatusFilter(f.value)} className={cn('px-3 py-1.5 rounded-lg text-xs transition-colors', statusFilter === f.value ? 'bg-surface-elevated text-white border border-white/20' : 'text-muted hover:text-subtle')}>{f.label}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((band: any) => (
          <Card key={band.id} href={`/bands/${band.id}`}>
            <CardCover src={band.cover_image ?? band.coverImage} alt={band.name} />
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{band.name}</h3>
                <BandStatusBadge status={band.status} />
              </div>
              <div className="flex gap-1 flex-wrap">
                {(band.genre || []).map((g: string) => <GenreTag key={g} genre={g} />)}
              </div>
              {band.organization && <p className="text-xs text-muted">소속: {band.organization.name}</p>}
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted py-12">조건에 맞는 밴드가 없습니다.</p>}
    </div>
  );
}
