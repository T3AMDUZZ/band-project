'use client';

import Link from 'next/link';
import { mockOrganizations } from '@/lib/mock-data';

const mockUser = {
  name: '김민수',
  nickname: 'minsu_band',
  email: 'minsu@example.com',
  profileImage: null,
};

const myReservations = [
  { id: '1', venue: '인디카페 봄', date: '2026-03-21', status: 'APPROVED' as const },
  { id: '2', venue: '라이브홀 루트', date: '2026-04-10', status: 'PENDING' as const },
];

const statusBadge: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
  APPROVED: 'bg-green-500/10 text-green-500 border border-green-500/20',
  REJECTED: 'bg-red-500/10 text-red-500 border border-red-500/20',
  CANCELLED: 'bg-white/[0.04] text-muted border border-white/[0.07]',
};

const statusLabel: Record<string, string> = {
  PENDING: '대기중',
  APPROVED: '승인됨',
  REJECTED: '거절됨',
  CANCELLED: '취소됨',
};

export default function MyPage() {
  const myOrgs = mockOrganizations.slice(0, 1);

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile */}
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6 mb-8 animate-fade-up">
          <div className="flex items-center gap-5">
            <div className="w-[76px] h-[76px] rounded-[14px] bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center flex-shrink-0 shadow-[0_8px_28px_rgba(245,158,11,0.25)]">
              <span className="text-2xl font-display text-surface">
                {mockUser.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-50">{mockUser.name}</h1>
              <p className="text-sm text-muted font-mono-space">@{mockUser.nickname}</p>
              <p className="text-sm text-muted">{mockUser.email}</p>
            </div>
          </div>
          <div className="mt-5">
            <button
              onClick={() => alert('프로필 수정 페이지로 이동합니다.')}
              className="px-5 py-2 border border-accent/30 text-accent font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm"
            >
              프로필 수정
            </button>
          </div>
        </div>

        {/* My Bands — 통합 밴드 탭으로 안내 */}
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-[16px] tracking-[2px] text-muted">MY BANDS</h2>
            <span className="flex-1 h-px bg-white/[0.07]" />
          </div>
          <p className="text-sm text-muted mb-4">
            내 밴드는 <strong className="text-stone-50">밴드</strong> 메뉴 상단에서 다른 밴드와 함께 볼 수 있어요. 상세 대시보드는 마이 밴드 페이지로
            이동합니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/bands#my-band"
              className="px-5 py-2.5 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors text-sm"
            >
              밴드 보기 (내 밴드 + 다른 밴드)
            </Link>
            <Link
              href="/myband"
              className="px-5 py-2.5 border border-accent/40 text-accent font-semibold rounded-lg hover:bg-accent/10 transition-colors text-sm"
            >
              마이 밴드 대시보드
            </Link>
          </div>
        </div>

        {/* My Organizations */}
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-[16px] tracking-[2px] text-muted">MY ORGANIZATIONS</h2>
            <span className="flex-1 h-px bg-white/[0.07]" />
          </div>
          <div className="space-y-4">
            {myOrgs.map((org) => (
              <Link
                key={org.id}
                href={`/organizations/${org.id}`}
                className="block p-4 border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all group"
              >
                <h3 className="font-bold text-stone-50 group-hover:text-accent transition-colors">
                  {org.name}
                </h3>
                <div className="mt-2 flex gap-4 text-sm text-muted font-mono-space text-xs">
                  <span>밴드 {org.bandCount}개</span>
                  <span>멤버 {org.memberCount}명</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* My Reservations */}
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-[16px] tracking-[2px] text-muted">MY RESERVATIONS</h2>
            <span className="flex-1 h-px bg-white/[0.07]" />
          </div>
          <div className="space-y-4">
            {myReservations.map((r) => (
              <div key={r.id} className="p-4 border border-white/[0.07] rounded-[14px]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-stone-50">{r.venue}</h3>
                    <p className="text-sm text-muted font-mono-space">{r.date}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-mono-space font-medium rounded-full ${statusBadge[r.status]}`}>
                    {statusLabel[r.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
