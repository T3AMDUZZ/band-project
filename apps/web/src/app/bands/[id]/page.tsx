'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { mockBands, mockPerformances, mockOrganizations, mockBandMembers, mockInviteCodes, mockFavorites } from '@/lib/mock-data';
import { formatDate, formatPrice } from '@/lib/utils';

const BAND_COLORS = ['#F97316', '#06B6D4', '#A855F7', '#EC4899', '#22C55E', '#EAB308', '#EF4444', '#6366F1'];

const mockMembers: Record<string, { name: string; part: string }[]> = {
  '1': [
    { name: '김민수', part: '보컬' },
    { name: '이지현', part: '기타' },
    { name: '박준호', part: '베이스' },
    { name: '최서연', part: '드럼' },
    { name: '정다은', part: '키보드' },
  ],
  '2': [
    { name: '한승우', part: '보컬/기타' },
    { name: '오예린', part: '기타' },
    { name: '임태현', part: '베이스' },
    { name: '송지민', part: '드럼' },
  ],
  '3': [
    { name: '강현우', part: '보컬' },
    { name: '윤서아', part: '기타' },
    { name: '배진혁', part: '베이스' },
    { name: '조하은', part: '드럼' },
    { name: '신동현', part: '키보드' },
  ],
  '4': [
    { name: '류지훈', part: '보컬/기타' },
    { name: '문채원', part: '기타' },
    { name: '김도윤', part: '카혼' },
  ],
  '5': [
    { name: '황민재', part: '기타' },
    { name: '전소미', part: '기타' },
    { name: '안재영', part: '베이스' },
    { name: '이하린', part: '드럼' },
  ],
};

const bandOrganizationMap: Record<string, string> = {
  '1': '1',
  '3': '2',
};

const PART_EMOJIS: Record<string, string> = {
  '보컬': '🎤', '기타': '🎸', '베이스': '🎵', '드럼': '🥁', '키보드': '🎹',
  '보컬/기타': '🎸', '카혼': '🥁',
};

export default function BandDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<'performances' | 'members' | 'photos'>('performances');
  const [showInvite, setShowInvite] = useState(false);
  const [isFavorite, setIsFavorite] = useState(mockFavorites.includes(id));

  const band = mockBands.find((b) => b.id === id);
  const bandIndex = mockBands.findIndex((b) => b.id === id);

  if (!band) {
    return (
      <section className="py-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-stone-50">밴드를 찾을 수 없습니다</h1>
          <Link href="/bands" className="mt-4 inline-block text-accent hover:text-accent-hover font-medium">
            목록으로 돌아가기
          </Link>
        </div>
      </section>
    );
  }

  const orgId = bandOrganizationMap[band.id];
  const org = orgId ? mockOrganizations.find((o) => o.id === orgId) : null;
  const bandPerformances = mockPerformances.filter((p) => p.bands.some((b) => b.id === band.id));
  const members = mockMembers[band.id] || [];
  const extMembers = mockBandMembers[band.id] || [];
  const inviteCode = mockInviteCodes[band.id] || '';
  const bandColor = BAND_COLORS[bandIndex % BAND_COLORS.length];

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="flex gap-5 mb-10 animate-fade-up">
          <div
            className="w-[76px] h-[76px] rounded-[14px] flex-shrink-0 flex items-center justify-center font-display text-3xl text-surface"
            style={{ background: bandColor, boxShadow: `0 8px 28px ${bandColor}40` }}
          >
            {band.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl tracking-[2px] text-stone-50">{band.name}</h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {band.genre.map((g) => (
                <span key={g} className="px-[10px] py-[3px] rounded text-[11px] font-mono-space font-bold tracking-wider uppercase bg-accent/10 text-accent border border-accent/20">
                  {g}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted">{band.description}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isFavorite
                    ? 'border-accent/30 bg-accent/10 text-accent'
                    : 'border-white/[0.07] text-muted hover:text-stone-50'
                }`}
              >
                {isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-4 text-center">
            <span className="text-2xl">👤</span>
            <p className="mt-1 text-xs text-muted font-mono-space">멤버</p>
            <p className="text-lg font-bold text-stone-50">{band.memberCount}명</p>
          </div>
          <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-4 text-center">
            <span className="text-2xl">🎵</span>
            <p className="mt-1 text-xs text-muted font-mono-space">장르</p>
            <p className="text-lg font-bold text-stone-50">{band.genre.join(', ')}</p>
          </div>
          {org && (
            <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-4 text-center col-span-2 sm:col-span-1">
              <span className="text-2xl">🏢</span>
              <p className="mt-1 text-xs text-muted font-mono-space">소속 조직</p>
              <Link href={`/organizations/${org.id}`} className="text-lg font-bold text-accent hover:text-accent-hover">
                {org.name}
              </Link>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-white/[0.07] mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('performances')}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === 'performances' ? 'border-b-2 border-accent text-accent' : 'text-muted hover:text-stone-50'
              }`}
            >
              공연 이력
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === 'members' ? 'border-b-2 border-accent text-accent' : 'text-muted hover:text-stone-50'
              }`}
            >
              멤버
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === 'photos' ? 'border-b-2 border-accent text-accent' : 'text-muted hover:text-stone-50'
              }`}
            >
              사진
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'performances' && (
          <div className="space-y-4">
            {bandPerformances.length === 0 ? (
              <p className="text-center py-8 text-muted">등록된 공연이 없습니다.</p>
            ) : (
              bandPerformances.map((performance) => (
                <Link
                  key={performance.id}
                  href={`/performances/${performance.id}`}
                  className="block bg-surface-card border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all p-5"
                >
                  <p className="text-sm text-accent font-mono-space font-medium">{formatDate(performance.date)}</p>
                  <h3 className="mt-1 text-lg font-bold text-stone-50">{performance.title}</h3>
                  <p className="mt-1 text-sm text-muted">{performance.venue.name} · {performance.venue.address}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {performance.bands.map((b) => (
                        <span key={b.id} className="inline-block px-2 py-0.5 text-[10px] font-mono-space tracking-wider bg-accent/10 text-accent rounded">
                          {b.name}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-accent">{formatPrice(performance.ticketPrice)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowInvite(!showInvite)}
                className="px-4 py-2 rounded-lg text-xs font-medium border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20"
              >
                멤버 초대
              </button>
            </div>

            {showInvite && (
              <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-4 mb-4">
                <p className="text-xs font-medium text-muted mb-2">초대 코드</p>
                {inviteCode ? (
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-2 bg-surface-elevated rounded text-sm font-mono text-stone-50 flex-1">{inviteCode}</code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(inviteCode); alert('복사되었습니다.'); }}
                      className="px-3 py-2 bg-white/[0.06] text-muted rounded text-sm hover:bg-white/[0.1]"
                    >
                      복사
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-muted">초대 코드가 없습니다.</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {members.length === 0 ? (
                <p className="text-center py-8 text-muted col-span-2">멤버 정보가 없습니다.</p>
              ) : (
                members.map((member, idx) => (
                  <div key={idx} className="bg-surface-card border border-white/[0.07] rounded-[14px] p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[11px] bg-surface-elevated flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">{PART_EMOJIS[member.part] || '🎵'}</span>
                    </div>
                    <div>
                      <p className="font-bold text-stone-50">{member.name}</p>
                      <p className="text-xs text-muted font-mono-space">{member.part}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="text-center py-12">
            <p className="text-muted mb-4">등록된 사진이 없습니다.</p>
            <button
              onClick={() => alert('사진 업로드 기능은 준비 중입니다.')}
              className="px-5 py-2 rounded-lg text-xs font-medium border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20"
            >
              사진 업로드
            </button>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-10 text-center">
          <Link href="/bands" className="inline-block px-6 py-2.5 bg-white/[0.06] text-subtle font-medium rounded-lg hover:bg-white/[0.1] transition-colors">
            목록으로
          </Link>
        </div>
      </div>
    </section>
  );
}
