'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { mockBands, mockOrganizations, mockReservations } from '@/lib/mock-data';
import { getMyBands, getMyOrganizations, getMyReservations } from '@/lib/queries';
import { useQueryWithFallback } from '@/lib/use-query-with-fallback';
import { BandStatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function MyPage() {
  const { user, isAuthenticated, logout } = useAuth();

  const { data: myBands } = useQueryWithFallback<any[]>(
    ['myBands'],
    getMyBands,
    mockBands.slice(0, 1).map((b) => ({ role: 'ADMIN', band: b }))
  );

  const { data: myOrgs } = useQueryWithFallback<any[]>(
    ['myOrgs'],
    getMyOrganizations,
    mockOrganizations.slice(0, 1).map((o) => ({ role: 'ADMIN', organization: o }))
  );

  const { data: myReservations } = useQueryWithFallback<any[]>(
    ['myReservations'],
    getMyReservations,
    mockReservations
  );

  const displayName = user?.name || '게스트';
  const displayNickname = user?.nickname || 'guest';
  const displayBio = user?.bio || null;
  const displayEmail = user?.email || '';

  const reservationCounts = {
    pending: (myReservations ?? []).filter((r: any) => r.status === 'PENDING').length,
    approved: (myReservations ?? []).filter((r: any) => r.status === 'APPROVED').length,
    total: (myReservations ?? []).length,
  };

  return (
    <div className="max-w-[600px] mx-auto px-4 py-6 space-y-6">
      {/* Profile */}
      <section className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-surface-elevated border border-white/[0.07] flex items-center justify-center overflow-hidden flex-shrink-0">
          <span className="text-2xl font-display text-muted">{displayNickname[0]}</span>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{displayName}</h1>
          <p className="text-sm text-subtle">@{displayNickname}</p>
          {displayBio && <p className="text-xs text-muted mt-1">{displayBio}</p>}
          <p className="text-xs text-muted mt-0.5">{displayEmail}</p>
        </div>
        <Link href="/mypage/edit"><Button variant="secondary" size="sm">프로필 편집</Button></Link>
      </section>

      {/* My Bands */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">내 밴드</h2>
          <Link href="/bands/new" className="text-xs text-accent hover:text-accent-hover transition-colors">+ 밴드 생성</Link>
        </div>
        <div className="space-y-2">
          {(myBands ?? []).map((item: any, i: number) => {
            const band = item.band || item;
            return (
              <Link key={band.id || i} href={`/bands/${band.id}`} className="flex items-center gap-3 p-3 bg-surface-card border border-white/[0.07] rounded-xl hover:bg-surface-elevated transition-colors">
                <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center text-sm text-muted">{band.name?.[0] || '?'}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{band.name}</p>
                  <p className="text-xs text-muted">{(band.genre || []).join(', ')}</p>
                </div>
                {band.status && <BandStatusBadge status={band.status} />}
              </Link>
            );
          })}
          <Link href="/bands/join" className="flex items-center justify-center gap-2 p-3 border border-dashed border-white/[0.07] rounded-xl text-xs text-muted hover:text-subtle hover:border-white/20 transition-colors">
            초대코드로 밴드 참여 →
          </Link>
        </div>
      </section>

      {/* My Orgs */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">내 조직</h2>
          <Link href="/organizations/new" className="text-xs text-accent hover:text-accent-hover transition-colors">+ 조직 생성</Link>
        </div>
        <div className="space-y-2">
          {(myOrgs ?? []).map((item: any, i: number) => {
            const org = item.organization || item;
            return (
              <Link key={org.id || i} href={`/organizations/${org.id}`} className="flex items-center gap-3 p-3 bg-surface-card border border-white/[0.07] rounded-xl hover:bg-surface-elevated transition-colors">
                <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center text-sm text-muted">{org.name?.[0] || '?'}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{org.name}</p>
                  <p className="text-xs text-muted">{org.school || org.region}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Reservation Summary */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">예약 현황</h2>
          <Link href="/reservations" className="text-xs text-accent hover:text-accent-hover transition-colors">전체 보기 →</Link>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 p-3 bg-surface-card border border-white/[0.07] rounded-xl text-center">
            <p className="text-lg font-bold text-warning">{reservationCounts.pending}</p>
            <p className="text-[10px] text-muted">대기</p>
          </div>
          <div className="flex-1 p-3 bg-surface-card border border-white/[0.07] rounded-xl text-center">
            <p className="text-lg font-bold text-success">{reservationCounts.approved}</p>
            <p className="text-[10px] text-muted">승인</p>
          </div>
          <div className="flex-1 p-3 bg-surface-card border border-white/[0.07] rounded-xl text-center">
            <p className="text-lg font-bold text-subtle">{reservationCounts.total}</p>
            <p className="text-[10px] text-muted">전체</p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="space-y-2 pt-2">
        <button onClick={() => logout()} className="w-full text-left p-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm text-error hover:bg-error/5 transition-colors">
          로그아웃
        </button>
      </section>
    </div>
  );
}
