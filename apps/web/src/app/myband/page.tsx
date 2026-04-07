'use client';

import Link from 'next/link';
import RequireAuth from '@/components/auth/require-auth';

export default function MyBandPage() {
  return (
    <RequireAuth>
      <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-7">
        {/* ── EMPTY STATE ── */}
        <div className="bg-surface-card border border-dashed border-white/[0.12] rounded-[14px] p-11 text-center mb-7">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-stone-50 mb-2">내 밴드가 없습니다</h2>
          <p className="text-sm text-muted mb-6">밴드를 만들거나 초대 코드로 가입해보세요.</p>
          <div className="flex justify-center gap-3">
            <Link
              href="/bands/new"
              className="px-[26px] py-2.5 rounded-lg bg-accent text-surface font-bold text-sm hover:bg-accent-hover transition-colors"
            >
              밴드 만들기
            </Link>
            <Link
              href="/bands/join"
              className="px-[26px] py-2.5 rounded-lg border border-white/[0.1] text-subtle text-sm hover:border-white/[0.2] transition-colors"
            >
              초대 코드로 가입
            </Link>
          </div>
        </div>

        {/* ── NEXT SHOW ── */}
        <div className="bg-surface-card border border-dashed border-white/[0.12] rounded-[14px] p-11 text-center mb-7">
          <p className="text-muted text-[15px] mb-4">예정된 공연이 없습니다</p>
          <Link
            href="/bands"
            className="px-[26px] py-2.5 rounded-lg bg-accent text-surface font-bold text-sm hover:bg-accent-hover transition-colors"
          >
            공연 예약하기 →
          </Link>
        </div>

        {/* ── HISTORY ── */}
        <div>
          <div className="font-display text-[18px] tracking-[3px] text-muted mb-3.5 flex items-center gap-2.5">
            HISTORY
            <span className="flex-1 h-px bg-white/[0.07]" />
          </div>
          <div className="text-center py-8">
            <p className="text-muted text-sm">데이터가 없습니다</p>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
