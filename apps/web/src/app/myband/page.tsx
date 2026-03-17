'use client';

import Link from 'next/link';
import { myBand, myNextShow, myHistory } from '@/lib/mock-data';

const fmt = (d: string) => {
  const x = new Date(d);
  return `${x.getFullYear()}.${String(x.getMonth() + 1).padStart(2, '0')}.${String(x.getDate()).padStart(2, '0')}`;
};

const fmtShort = (d: string) => {
  const x = new Date(d);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${x.getMonth() + 1}/${x.getDate()} (${days[x.getDay()]})`;
};

const dday = (d: string) => {
  const diff = Math.ceil((new Date(d).getTime() - new Date().getTime()) / 864e5);
  return diff === 0 ? 'D-DAY' : diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
};

export default function MyBandPage() {
  return (
    <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-7">
      {/* ── PROFILE HEADER ── */}
      <div className="flex gap-5 mb-8 animate-fade-up">
        <div className="w-[76px] h-[76px] rounded-[14px] flex-shrink-0 bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-surface font-display text-4xl shadow-[0_8px_28px_rgba(245,158,11,0.25)]">
          {myBand.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-[38px] tracking-[2px] leading-none mb-2">
            {myBand.name}
          </h1>
          <div className="flex gap-1.5 mb-3">
            {myBand.genre.map((g) => (
              <span
                key={g}
                className="px-[10px] py-[3px] rounded text-[11px] font-mono-space font-bold tracking-wider uppercase bg-accent/10 text-accent border border-accent/20"
              >
                {g}
              </span>
            ))}
          </div>
          <div className="flex gap-2.5 flex-wrap">
            {myBand.members.map((m) => (
              <div
                key={m.name}
                className="flex items-center gap-1.5 px-3 py-[5px] bg-surface-card border border-white/[0.07] rounded-lg text-[13px]"
              >
                <span>{m.emoji}</span>
                <span>{m.name}</span>
                <span className="text-muted text-[11px] font-mono-space">{m.part}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── NEXT SHOW ── */}
      {myNextShow ? (
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] overflow-hidden mb-7 relative">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent via-accent-hover to-transparent" />
          <div className="p-6">
            <div className="font-display text-[13px] tracking-[3px] text-accent mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              NEXT SHOW
            </div>
            <div className="flex gap-6 items-center flex-wrap">
              {/* Poster placeholder */}
              <div className="w-[150px] h-[190px] rounded-[10px] flex-shrink-0 bg-gradient-to-br from-surface-elevated via-surface-card to-accent/[0.06] border border-dashed border-white/[0.12] flex flex-col items-center justify-center text-muted text-xs gap-1.5">
                <span className="text-[28px] opacity-35">🎤</span>
                <span>포스터 영역</span>
                <span className="text-[10px] opacity-50">추후 업로드</span>
              </div>
              {/* Details */}
              <div className="flex-1 min-w-[200px]">
                <div className="text-[26px] font-black tracking-tight mb-2.5">
                  {myNextShow.venue}
                </div>
                <div className="flex flex-col gap-1.5 text-sm text-subtle">
                  <span>📅 {fmt(myNextShow.date)} ({['일','월','화','수','목','금','토'][new Date(myNextShow.date).getDay()]})</span>
                  <span>🕐 {myNextShow.time}</span>
                  <span>📍 {myNextShow.venueAddress}</span>
                  {myNextShow.coAct && <span>🎵 w/ {myNextShow.coAct}</span>}
                </div>
                <div className="inline-flex items-center gap-1.5 mt-3.5 px-3.5 py-1.5 rounded-lg bg-accent/10 border border-accent/20 font-mono-space text-[13px] font-bold text-accent">
                  ⚡ {dday(myNextShow.date)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-card border border-dashed border-white/[0.12] rounded-[14px] p-11 text-center mb-7">
          <p className="text-muted text-[15px] mb-4">예정된 공연이 없습니다</p>
          <Link
            href="/bands"
            className="px-[26px] py-2.5 rounded-lg bg-accent text-surface font-bold text-sm hover:bg-accent-hover transition-colors"
          >
            공연 예약하기 →
          </Link>
        </div>
      )}

      {/* ── HISTORY ── */}
      <div>
        <div className="font-display text-[18px] tracking-[3px] text-muted mb-3.5 flex items-center gap-2.5">
          HISTORY
          <span className="flex-1 h-px bg-white/[0.07]" />
        </div>
        {myHistory.map((h, i) => (
          <div
            key={i}
            className="flex items-center gap-4 py-[11px] border-b border-white/[0.05]"
          >
            <span className="font-mono-space text-xs text-muted w-[88px] flex-shrink-0">
              {fmt(h.date).slice(2)}
            </span>
            <span className="text-sm font-medium flex-1">{h.venue}</span>
            {h.note && (
              <span className="text-xs text-muted italic">{h.note}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
