'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockOrganizations } from '@/lib/mock-data';

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

const filterTabs = [
  { key: 'ALL', label: '전체' },
  { key: 'UNIVERSITY_CLUB', label: '대학 동아리' },
  { key: 'BAND_UNION', label: '밴드 연합' },
  { key: 'INDIE_COLLECTIVE', label: '인디 연합' },
];

export default function OrganizationsPage() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filteredOrganizations =
    activeFilter === 'ALL'
      ? mockOrganizations
      : mockOrganizations.filter((org) => org.type === activeFilter);

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[18px] tracking-[3px] text-muted">ORGANIZATIONS</h1>
            <span className="flex-1 h-px bg-white/[0.07] min-w-[40px]" />
          </div>
          <Link
            href="/organizations/new"
            className="px-5 py-2.5 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors text-sm"
          >
            조직 등록
          </Link>
        </div>
        <p className="text-sm text-muted mb-8">대전의 밴드 동아리와 연합을 만나보세요</p>

        {/* Filter Tabs */}
        <div className="flex gap-4 border-b border-white/[0.07] mb-8">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeFilter === tab.key
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-muted hover:text-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Organization Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org, i) => (
            <Link
              key={org.id}
              href={`/organizations/${org.id}`}
              className="bg-surface-card border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all p-5 group"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-[11px] flex items-center justify-center flex-shrink-0 font-display text-lg text-surface"
                  style={{ background: BAND_COLORS[i % BAND_COLORS.length] }}
                >
                  {org.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-stone-50 group-hover:text-accent transition-colors truncate">
                    {org.name}
                  </h3>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-mono-space tracking-wider rounded-full ${typeBadgeStyles[org.type] || 'bg-white/[0.04] text-muted'}`}
                  >
                    {typeLabels[org.type] || org.type}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted font-mono-space">
                <span>🎸 {org.bandCount}개 밴드</span>
                <span>👤 {org.memberCount}명</span>
              </div>
            </Link>
          ))}
        </div>

        {filteredOrganizations.length === 0 && (
          <p className="text-center text-muted py-12">해당 유형의 조직이 없습니다.</p>
        )}
      </div>
    </section>
  );
}
