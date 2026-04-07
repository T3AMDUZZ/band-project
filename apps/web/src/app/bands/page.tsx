'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';

const BAND_COLORS = ['#F97316', '#06B6D4', '#A855F7', '#EC4899', '#22C55E', '#EAB308', '#EF4444', '#6366F1'];

const statusLabel: Record<string, string> = { ACTIVE: '활동중', HIATUS: '휴식중', DISBANDED: '해체' };
const statusDot: Record<string, string> = { ACTIVE: 'bg-green-400', HIATUS: 'bg-yellow-400', DISBANDED: 'bg-stone-500' };

export default function BandsPage() {
  const supabase = createClient();
  const { isAuthenticated, user } = useAuth();

  const [allBands, setAllBands] = useState<any[]>([]);
  const [myBandIds, setMyBandIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');

  useEffect(() => {
    // 전체 밴드 로드
    supabase
      .from('bands')
      .select('id, name, genre, description, status, cover_image, organization:organizations(name), members:band_members(count)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setAllBands(data ?? []));
  }, [supabase]);

  useEffect(() => {
    // 로그인 시 내 밴드 ID 로드
    if (!user) {
      setMyBandIds(new Set());
      return;
    }
    supabase
      .from('band_members')
      .select('band_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setMyBandIds(new Set((data ?? []).map((d) => d.band_id)));
      });
  }, [user, supabase]);

  const filtered = useMemo(() => {
    let list = allBands;

    // 탭 필터
    if (activeTab === 'mine') {
      list = list.filter((b) => myBandIds.has(b.id));
    }

    // 검색 필터
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.genre?.some((g: string) => g.toLowerCase().includes(q)) ||
          b.organization?.name?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allBands, activeTab, myBandIds, search]);

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[18px] tracking-[3px] text-muted">BANDS</h1>
            <span className="flex-1 h-px bg-white/[0.07] min-w-[40px]" />
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Link href="/bands/join" className="px-4 py-2 border border-white/[0.1] text-subtle text-sm rounded-lg hover:border-white/[0.2] transition-colors">
                초대코드 가입
              </Link>
            )}
            {isAuthenticated && (
              <Link href="/bands/new" className="px-6 py-2.5 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors text-sm">
                밴드 생성
              </Link>
            )}
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-white/[0.04] rounded-[10px] p-[3px]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-accent text-surface' : 'text-muted hover:text-stone-50'}`}
            >
              전체 밴드
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'mine' ? 'bg-accent text-surface' : 'text-muted hover:text-stone-50'}`}
            >
              내 밴드 {myBandIds.size > 0 && <span className="ml-1 text-xs opacity-70">({myBandIds.size})</span>}
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="밴드명, 장르, 소속 조직으로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-card border border-white/[0.07] rounded-xl text-sm text-stone-50 placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            {activeTab === 'mine' && !isAuthenticated ? (
              <>
                <p className="text-muted mb-4">로그인하면 내 밴드를 확인할 수 있습니다.</p>
                <Link href="/login" className="px-6 py-2.5 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors text-sm">
                  로그인
                </Link>
              </>
            ) : activeTab === 'mine' && myBandIds.size === 0 ? (
              <>
                <p className="text-muted mb-4">소속된 밴드가 없습니다.</p>
                <div className="flex justify-center gap-3">
                  <Link href="/bands/new" className="px-6 py-2.5 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors text-sm">
                    밴드 만들기
                  </Link>
                  <Link href="/bands/join" className="px-6 py-2.5 border border-white/[0.1] text-subtle rounded-lg hover:border-white/[0.2] transition-colors text-sm">
                    초대코드로 가입
                  </Link>
                </div>
              </>
            ) : search ? (
              <p className="text-muted">&ldquo;{search}&rdquo; 검색 결과가 없습니다.</p>
            ) : (
              <p className="text-muted">등록된 밴드가 없습니다.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((band, i) => {
              const isMine = myBandIds.has(band.id);
              return (
                <Link
                  key={band.id}
                  href={`/bands/${band.id}`}
                  className={`bg-surface-card border rounded-[14px] hover:border-white/[0.15] transition-all p-5 group ${isMine ? 'border-accent/20' : 'border-white/[0.07]'}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-[11px] flex items-center justify-center flex-shrink-0 font-display text-xl text-surface"
                      style={{ background: BAND_COLORS[i % BAND_COLORS.length] }}
                    >
                      {band.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-stone-50 group-hover:text-accent transition-colors truncate">
                          {band.name}
                        </h3>
                        {isMine && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 text-[9px] font-mono-space font-bold bg-accent/15 text-accent border border-accent/20 rounded">
                            MY
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted truncate">{band.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {band.genre?.map((g: string) => (
                        <span key={g} className="inline-block px-2 py-0.5 text-[10px] font-mono-space tracking-wider bg-white/[0.04] text-muted rounded">
                          {g}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[band.status] || 'bg-stone-500'}`} />
                      <span className="text-[10px] font-mono-space text-muted">
                        {statusLabel[band.status] || band.status}
                      </span>
                    </div>
                  </div>

                  {band.organization?.name && (
                    <p className="mt-2 text-xs text-muted">소속: {band.organization.name}</p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
