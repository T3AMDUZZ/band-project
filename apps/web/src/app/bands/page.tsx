'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { otherBands, allBookings, mockVenues, myBand } from '@/lib/mock-data';

const BAND_COLORS = ['#F97316', '#06B6D4', '#A855F7', '#EC4899', '#22C55E', '#EAB308', '#EF4444', '#6366F1'];

const fmtShort = (d: string) => {
  const x = new Date(d);
  return `${x.getMonth() + 1}/${x.getDate()}`;
};

const todayStr = (() => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
})();

export default function BandsPage() {
  const [search, setSearch] = useState('');
  const [favs, setFavs] = useState<Set<string>>(new Set(['2']));
  const [favOnly, setFavOnly] = useState(false);
  const [expandedBand, setExpandedBand] = useState<string | null>(null);
  const [showAllShows, setShowAllShows] = useState(false);

  const toggleFav = (id: string) =>
    setFavs((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const filteredBands = useMemo(() => {
    const q = search.toLowerCase();
    return otherBands.filter((b) => {
      const match =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.bio.toLowerCase().includes(q) ||
        b.genre.some((g) => g.includes(q)) ||
        b.cover.toLowerCase().includes(q);
      return favOnly ? match && favs.has(b.id) : match;
    });
  }, [search, favOnly, favs]);

  const upcoming = useMemo(
    () =>
      allBookings
        .filter((b) => b.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date)),
    []
  );

  return (
    <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-7">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-[18px] tracking-[3px] text-muted">BANDS</h1>
          <span className="flex-1 h-px bg-white/[0.07] min-w-[40px]" />
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setFavOnly(!favOnly)}
            className={`px-3.5 py-[7px] rounded-lg text-[13px] cursor-pointer transition-all border ${
              favOnly
                ? 'border-accent/30 bg-accent/10 text-accent'
                : 'border-white/[0.07] bg-transparent text-subtle'
            }`}
          >
            ⭐ 친한 밴드만
          </button>
          <button
            onClick={() => setShowAllShows(!showAllShows)}
            className={`px-4 py-[7px] rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
              showAllShows
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-accent/40 bg-transparent text-accent'
            }`}
          >
            {showAllShows ? '✕ 닫기' : '📋 전체 공연 일정'}
          </button>
          <div className="flex items-center gap-2 bg-surface-card border border-white/[0.07] rounded-[10px] px-3 py-[7px] w-[240px]">
            <span className="text-[13px] opacity-40">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="밴드명, 장르 검색..."
              className="bg-transparent border-none text-stone-50 text-[13px] outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* ── 내 밴드 (상단 고정) ── */}
      <div id="my-band" className="scroll-mt-28 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="font-display text-[14px] tracking-[2px] text-accent">내 밴드</h2>
          <span className="flex-1 h-px bg-white/[0.07]" />
        </div>
        <Link
          href="/myband"
          className="flex items-center gap-4 p-4 bg-surface-card border border-accent/25 rounded-[14px] hover:border-accent/50 transition-all group"
        >
          <div
            className="w-14 h-14 rounded-[11px] flex-shrink-0 flex items-center justify-center font-display text-2xl text-surface"
            style={{ background: BAND_COLORS[0] }}
          >
            {myBand.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[15px] font-black text-stone-50 group-hover:text-accent transition-colors">
                {myBand.name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 font-mono-space font-bold">
                MY
              </span>
            </div>
            <p className="text-xs text-muted mt-1">{myBand.description}</p>
            <div className="flex gap-1.5 flex-wrap mt-2">
              {myBand.genre.map((g) => (
                <span
                  key={g}
                  className="text-[10px] px-[7px] py-[2px] rounded bg-white/[0.04] text-muted font-mono-space tracking-wider"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
          <span className="text-sm text-accent font-semibold flex-shrink-0">대시보드 →</span>
        </Link>
      </div>

      {/* ── 다른 밴드 ── */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-display text-[14px] tracking-[2px] text-muted">다른 밴드</h2>
        <span className="flex-1 h-px bg-white/[0.07]" />
      </div>

      {/* ── ALL SHOWS PANEL ── */}
      {showAllShows && (
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-[18px] mb-5">
          <h3 className="font-display text-[16px] tracking-[2px] text-accent mb-2.5">
            UPCOMING SHOWS — 대전
          </h3>
          {upcoming.slice(0, 15).map((b, i) => {
            const v = mockVenues.find((x) => x.id === b.venueId);
            const isMine = b.band === myBand.name;
            return (
              <div
                key={i}
                className="flex items-center gap-2.5 py-2 border-b border-white/[0.04] text-[13px]"
              >
                <span className="font-mono-space text-xs text-muted w-[70px]">
                  {fmtShort(b.date)}
                </span>
                <span
                  className="px-[7px] py-[2px] rounded text-[10px] font-semibold text-white"
                  style={{ background: v?.color || '#555' }}
                >
                  {v?.name}
                </span>
                <span
                  className={`flex-1 ${isMine ? 'font-bold text-accent' : 'text-stone-50'}`}
                >
                  {b.band}
                </span>
                <span className="font-mono-space text-[11px] text-muted">{b.time}</span>
              </div>
            );
          })}
          <div className="mt-3 flex gap-1.5 flex-wrap">
            {mockVenues.map((v) => (
              <span
                key={v.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-medium"
                style={{ color: v.color, background: v.color + '15', border: `1px solid ${v.color}30` }}
              >
                <span className="w-[6px] h-[6px] rounded-full" style={{ background: v.color }} />
                {v.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── BAND LIST ── */}
      <div className="flex flex-col gap-2">
        {filteredBands.map((b, i) => (
          <div key={b.id}>
            <div
              onClick={() => setExpandedBand(expandedBand === b.id ? null : b.id)}
              className={`flex items-center gap-4 p-4 bg-surface-card border border-white/[0.07] cursor-pointer transition-all hover:border-white/[0.15] ${
                expandedBand === b.id ? 'rounded-t-[14px]' : 'rounded-[14px]'
              }`}
            >
              <div
                className="w-12 h-12 rounded-[11px] flex-shrink-0 flex items-center justify-center font-display text-xl text-surface"
                style={{ background: BAND_COLORS[i % BAND_COLORS.length] }}
              >
                {b.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold mb-[2px]">{b.name}</div>
                <div className="text-xs text-muted mb-1.5">{b.bio}</div>
                <div className="flex gap-1.5 flex-wrap items-center">
                  {b.genre.map((g) => (
                    <span
                      key={g}
                      className="text-[10px] px-[7px] py-[2px] rounded bg-white/[0.04] text-muted font-mono-space tracking-wider"
                    >
                      {g}
                    </span>
                  ))}
                  <span className="text-[10px] px-[7px] py-[2px] rounded bg-white/[0.04] text-muted font-mono-space">
                    👤 {b.members}명
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFav(b.id);
                }}
                className="bg-transparent border-none text-xl cursor-pointer flex-shrink-0 leading-none transition-transform hover:scale-110"
              >
                {favs.has(b.id) ? '⭐' : '☆'}
              </button>
            </div>
            {expandedBand === b.id && (
              <div
                className="px-[18px] py-3 bg-surface-card rounded-b-[14px] border-x border-b border-white/[0.07]"
                style={{ borderLeft: `3px solid ${BAND_COLORS[i % BAND_COLORS.length]}` }}
              >
                <div className="pl-14 space-y-1">
                  <div className="text-xs text-subtle flex items-center gap-1.5">
                    🎵 커버곡: <strong className="text-stone-50">{b.cover}</strong>
                  </div>
                  <div className="text-xs text-muted">
                    멤버 {b.members}명 · {b.genre.join(' / ')}
                  </div>
                  {/* 이 밴드의 다가오는 공연 */}
                  {(() => {
                    const shows = upcoming.filter((s) => s.band === b.name).slice(0, 3);
                    if (shows.length === 0) return null;
                    return (
                      <div className="mt-2 pt-2 border-t border-white/[0.05]">
                        <div className="text-[10px] font-mono-space text-muted mb-1">다가오는 공연:</div>
                        {shows.map((s, j) => {
                          const v = mockVenues.find((x) => x.id === s.venueId);
                          return (
                            <div key={j} className="flex items-center gap-2 text-xs text-subtle py-0.5">
                              <span className="font-mono-space text-muted w-[50px]">{fmtShort(s.date)}</span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] text-white" style={{ background: v?.color || '#555' }}>
                                {v?.name}
                              </span>
                              <span className="font-mono-space text-muted">{s.time}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredBands.length === 0 && (
          <div className="text-center py-11 text-muted">검색 결과가 없습니다</div>
        )}
      </div>
    </div>
  );
}
