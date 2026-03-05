'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockOrganizations } from '@/lib/mock-data';

const typeLabels: Record<string, string> = {
  UNIVERSITY_CLUB: '대학 동아리',
  BAND_UNION: '밴드 연합',
  INDIE_COLLECTIVE: '인디 연합',
};

const typeBadgeStyles: Record<string, string> = {
  UNIVERSITY_CLUB: 'bg-blue-100 text-blue-700',
  BAND_UNION: 'bg-purple-100 text-purple-700',
  INDIE_COLLECTIVE: 'bg-orange-100 text-orange-700',
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
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">조직</h1>
          <Link
            href="/organizations/new"
            className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            조직 등록
          </Link>
        </div>
        <p className="text-gray-500 mb-8">대전의 밴드 동아리와 연합을 만나보세요</p>

        {/* Filter Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-8">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeFilter === tab.key
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Organization Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <Link
              key={org.id}
              href={`/organizations/${org.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 group"
            >
              <div className="flex items-center gap-4">
                {/* Initial Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-white">
                    {org.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                    {org.name}
                  </h3>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${typeBadgeStyles[org.type] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {typeLabels[org.type] || org.type}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  🎸 {org.bandCount}개 밴드
                </span>
                <span className="flex items-center gap-1">
                  👤 {org.memberCount}명
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredOrganizations.length === 0 && (
          <p className="text-center text-gray-400 py-12">해당 유형의 조직이 없습니다.</p>
        )}
      </div>
    </section>
  );
}
