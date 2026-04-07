'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/auth/require-auth';
import { useAuth } from '@/contexts/auth-context';
import { createClient } from '@/lib/supabase';

const BAND_COLORS = ['#F97316', '#06B6D4', '#A855F7', '#EC4899', '#22C55E'];

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
  return (
    <RequireAuth>
      <MyPageContent />
    </RequireAuth>
  );
}

function MyPageContent() {
  const { profile, logout } = useAuth();
  const supabase = createClient();
  const [myBands, setMyBands] = useState<any[]>([]);
  const [myOrgs, setMyOrgs] = useState<any[]>([]);
  const [myReservations, setMyReservations] = useState<any[]>([]);

  useEffect(() => {
    if (!profile) return;

    // 내 밴드 조회
    supabase
      .from('band_members')
      .select('role, band:bands(id, name, genre, description, status)')
      .eq('user_id', profile.id)
      .then(({ data }) => setMyBands(data ?? []));

    // 내 조직 조회
    supabase
      .from('organization_members')
      .select('role, organization:organizations(id, name, type, school)')
      .eq('user_id', profile.id)
      .then(({ data }) => setMyOrgs(data ?? []));

    // 내 예약 조회
    supabase
      .from('reservations')
      .select('id, date, start_time, end_time, status, event_type, venue:venues(name)')
      .eq('requested_by', profile.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setMyReservations(data ?? []));
  }, [profile, supabase]);

  if (!profile) return null;

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile */}
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6 mb-8 animate-fade-up">
          <div className="flex items-center gap-5">
            <div className="w-[76px] h-[76px] rounded-[14px] bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center flex-shrink-0 shadow-[0_8px_28px_rgba(245,158,11,0.25)]">
              {profile.profile_image ? (
                <img src={profile.profile_image} alt="" className="w-full h-full rounded-[14px] object-cover" />
              ) : (
                <span className="text-2xl font-display text-surface">
                  {profile.name?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-50">{profile.name}</h1>
              <p className="text-sm text-muted font-mono-space">@{profile.nickname}</p>
              <p className="text-sm text-muted">{profile.email}</p>
              {profile.bio && <p className="text-sm text-subtle mt-1">{profile.bio}</p>}
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => alert('프로필 수정 기능은 준비 중입니다.')}
              className="px-5 py-2 border border-accent/30 text-accent font-bold rounded-lg hover:bg-accent/10 transition-colors text-sm"
            >
              프로필 수정
            </button>
            <button
              onClick={() => logout()}
              className="px-5 py-2 border border-white/[0.1] text-muted rounded-lg hover:bg-white/[0.04] transition-colors text-sm"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* My Bands */}
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-[16px] tracking-[2px] text-muted">MY BANDS</h2>
            <span className="flex-1 h-px bg-white/[0.07]" />
            <Link href="/bands/new" className="text-xs text-accent hover:underline">+ 밴드 생성</Link>
          </div>
          {myBands.length === 0 ? (
            <p className="text-sm text-muted py-4">소속된 밴드가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myBands.map((item, i) => (
                <Link
                  key={item.band.id}
                  href={`/bands/${item.band.id}`}
                  className="p-4 border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-[11px] flex items-center justify-center flex-shrink-0 font-display text-surface"
                      style={{ background: BAND_COLORS[i % BAND_COLORS.length] }}
                    >
                      {item.band.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-50 group-hover:text-accent transition-colors">
                        {item.band.name}
                      </h3>
                      <p className="text-xs text-muted">{item.role === 'ADMIN' ? '관리자' : '멤버'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Organizations */}
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-[16px] tracking-[2px] text-muted">MY ORGANIZATIONS</h2>
            <span className="flex-1 h-px bg-white/[0.07]" />
          </div>
          {myOrgs.length === 0 ? (
            <p className="text-sm text-muted py-4">소속된 조직이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {myOrgs.map((item) => (
                <Link
                  key={item.organization.id}
                  href={`/organizations/${item.organization.id}`}
                  className="block p-4 border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all group"
                >
                  <h3 className="font-bold text-stone-50 group-hover:text-accent transition-colors">
                    {item.organization.name}
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    {item.role === 'ADMIN' ? '관리자' : '멤버'}
                    {item.organization.school && ` · ${item.organization.school}`}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Reservations */}
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-[16px] tracking-[2px] text-muted">MY RESERVATIONS</h2>
            <span className="flex-1 h-px bg-white/[0.07]" />
          </div>
          {myReservations.length === 0 ? (
            <p className="text-sm text-muted py-4">예약 내역이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {myReservations.map((r) => (
                <div key={r.id} className="p-4 border border-white/[0.07] rounded-[14px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-stone-50">{r.venue?.name}</h3>
                      <p className="text-sm text-muted font-mono-space">{r.date} {r.start_time}-{r.end_time}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-mono-space font-medium rounded-full ${statusBadge[r.status]}`}>
                      {statusLabel[r.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
