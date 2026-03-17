'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { mockOrganizations, mockBands } from '@/lib/mock-data';

const BAND_COLORS = ['#F97316', '#06B6D4', '#A855F7', '#EC4899', '#22C55E', '#EAB308', '#EF4444', '#6366F1'];

const typeLabels: Record<string, string> = {
  UNIVERSITY_CLUB: '대학 동아리',
  BAND_UNION: '밴드 연합',
  INDIE_COLLECTIVE: '인디 연합',
};

const typeBadgeStyles: Record<string, string> = {
  UNIVERSITY_CLUB: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  BAND_UNION: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  INDIE_COLLECTIVE: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
};

const mockNotices = [
  { id: '1', title: '2026년 1학기 정기공연 안내', content: '3월 28일 정기공연이 예정되어 있습니다...', createdAt: '2026-03-01' },
  { id: '2', title: '신입 부원 모집 안내', content: '2026년 1학기 신입 부원을 모집합니다...', createdAt: '2026-02-15' },
  { id: '3', title: 'MT 일정 공지', content: '3월 첫째주 주말 MT가 예정되어 있습니다...', createdAt: '2026-02-10' },
];

const mockMembers = [
  { name: '김동현', role: 'ADMIN', joinedAt: '2024-03-01' },
  { name: '이서연', role: 'ADMIN', joinedAt: '2024-03-01' },
  { name: '박지훈', role: 'MEMBER', joinedAt: '2024-09-01' },
  { name: '최유진', role: 'MEMBER', joinedAt: '2025-03-01' },
  { name: '정민호', role: 'MEMBER', joinedAt: '2025-03-01' },
];

const tabs = [
  { key: 'bands', label: '산하 밴드' },
  { key: 'notices', label: '공지사항' },
  { key: 'members', label: '멤버' },
];

export default function OrganizationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState('bands');

  const org = mockOrganizations.find((o) => o.id === id);

  if (!org) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">조직을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const relatedBands = mockBands.slice(0, org.bandCount > mockBands.length ? mockBands.length : org.bandCount);

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/organizations" className="text-sm text-accent hover:text-accent-hover transition-colors">
          &larr; 조직 목록으로
        </Link>

        {/* Profile Header */}
        <div className="mt-6 flex items-center gap-6 animate-fade-up">
          <div className="w-20 h-20 rounded-[14px] bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center flex-shrink-0 shadow-[0_8px_28px_rgba(245,158,11,0.25)]">
            <span className="text-2xl font-display text-surface">{org.name.charAt(0)}</span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl sm:text-3xl tracking-[2px] text-stone-50">{org.name}</h1>
              <Link href={`/organizations/${org.id}/edit`} className="px-3 py-1 text-xs font-medium border border-white/[0.07] rounded-lg text-muted hover:text-accent hover:border-accent/30 transition-colors">
                수정
              </Link>
            </div>
            <span className={`inline-block mt-2 px-2.5 py-0.5 text-[10px] font-mono-space tracking-wider rounded-full ${typeBadgeStyles[org.type] || 'bg-white/[0.04] text-muted'}`}>
              {typeLabels[org.type] || org.type}
            </span>
            <p className="mt-2 text-sm text-muted font-mono-space">
              산하 밴드 {org.bandCount}개 · 멤버 {org.memberCount}명
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex gap-6 border-b border-white/[0.07]">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.key ? 'border-b-2 border-accent text-accent' : 'text-muted hover:text-stone-50'
              }`}
            >{tab.label}</button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'bands' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedBands.map((band, i) => (
                <Link key={band.id} href={`/bands/${band.id}`}
                  className="bg-surface-card border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all p-5 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[11px] flex items-center justify-center flex-shrink-0 font-display text-surface"
                      style={{ background: BAND_COLORS[i % BAND_COLORS.length] }}
                    >{band.name.charAt(0)}</div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-stone-50 group-hover:text-accent transition-colors truncate">{band.name}</h3>
                      <p className="text-sm text-muted truncate">{band.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {band.genre.map((g) => (
                        <span key={g} className="inline-block px-2 py-0.5 text-[10px] font-mono-space tracking-wider bg-accent/10 text-accent rounded">{g}</span>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono-space text-muted">멤버 {band.memberCount}명</span>
                  </div>
                </Link>
              ))}
              {relatedBands.length === 0 && <p className="text-muted col-span-2">등록된 산하 밴드가 없습니다.</p>}
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-1">
              {mockNotices.map((notice) => (
                <div key={notice.id} className="p-4 rounded-[14px] hover:bg-white/[0.03] transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-50">{notice.title}</h3>
                    <span className="text-xs text-muted font-mono-space flex-shrink-0 ml-4">{notice.createdAt}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted line-clamp-1">{notice.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-2">
              {mockMembers.map((member) => (
                <div key={member.name} className="flex items-center justify-between p-4 bg-surface-card border border-white/[0.07] rounded-[14px]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[11px] bg-surface-elevated flex items-center justify-center">
                      <span className="text-sm font-medium text-subtle">{member.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-50">{member.name}</p>
                      <p className="text-xs text-muted font-mono-space">{member.joinedAt} 가입</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-mono-space font-medium rounded-full ${
                    member.role === 'ADMIN'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-white/[0.04] text-muted border border-white/[0.07]'
                  }`}>
                    {member.role === 'ADMIN' ? '관리자' : '멤버'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
