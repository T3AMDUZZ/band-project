'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { mockBands, mockPerformances, mockOrganizations } from '@/lib/mock-data';
import { formatDate, formatPrice } from '@/lib/utils';

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

// 밴드-조직 매핑
const bandOrganizationMap: Record<string, string> = {
  '1': '1',
  '3': '2',
};

export default function BandDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<'performances' | 'members'>('performances');

  const band = mockBands.find((b) => b.id === id);

  if (!band) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">밴드를 찾을 수 없습니다</h1>
          <Link
            href="/bands"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </section>
    );
  }

  const orgId = bandOrganizationMap[band.id];
  const org = orgId ? mockOrganizations.find((o) => o.id === orgId) : null;

  const bandPerformances = mockPerformances.filter((p) =>
    p.bands.some((b) => b.id === band.id)
  );

  const members = mockMembers[band.id] || [];

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-indigo-600">
              {band.name.charAt(0)}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{band.name}</h1>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {band.genre.map((g) => (
              <span
                key={g}
                className="inline-block bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs"
              >
                {g}
              </span>
            ))}
          </div>
          <p className="mt-3 text-gray-500">{band.description}</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <span className="text-2xl">👤</span>
            <p className="mt-1 text-sm text-gray-500">멤버</p>
            <p className="text-lg font-semibold text-gray-900">{band.memberCount}명</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <span className="text-2xl">🎵</span>
            <p className="mt-1 text-sm text-gray-500">장르</p>
            <p className="text-lg font-semibold text-gray-900">{band.genre.join(', ')}</p>
          </div>
          {org && (
            <div className="bg-white rounded-lg shadow-sm p-4 text-center col-span-2 sm:col-span-1">
              <span className="text-2xl">🏢</span>
              <p className="mt-1 text-sm text-gray-500">소속 조직</p>
              <Link
                href={`/organizations/${org.id}`}
                className="text-lg font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {org.name}
              </Link>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('performances')}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === 'performances'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              공연 이력
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === 'members'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              멤버
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'performances' && (
          <div className="space-y-4">
            {bandPerformances.length === 0 ? (
              <p className="text-center py-8 text-gray-400">등록된 공연이 없습니다.</p>
            ) : (
              bandPerformances.map((performance) => (
                <Link
                  key={performance.id}
                  href={`/performances/${performance.id}`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5"
                >
                  <p className="text-sm text-indigo-600 font-medium">
                    {formatDate(performance.date)}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-gray-900">
                    {performance.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {performance.venue.name} · {performance.venue.address}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {performance.bands.map((b) => (
                        <span
                          key={b.id}
                          className="inline-block px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full"
                        >
                          {b.name}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(performance.ticketPrice)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {members.length === 0 ? (
              <p className="text-center py-8 text-gray-400 col-span-2">
                멤버 정보가 없습니다.
              </p>
            ) : (
              members.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-indigo-600">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.part}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-10 text-center">
          <Link
            href="/bands"
            className="inline-block px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            목록으로
          </Link>
        </div>
      </div>
    </section>
  );
}
