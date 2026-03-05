'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockBands, mockOrganizations } from '@/lib/mock-data';

const GENRE_FILTERS = ['전체', '인디록', '얼터너티브', '팝록', '어쿠스틱', '포스트록'];

// 밴드-조직 매핑 (목 데이터 기반)
const bandOrganizationMap: Record<string, string> = {
  '1': '1', // 블루밍사운드 -> 충남대 록앤롤 동아리
  '3': '2', // 미드나잇 크루 -> 한밭대 밴드 연합
};

export default function BandsPage() {
  const [selectedGenre, setSelectedGenre] = useState('전체');

  const filteredBands =
    selectedGenre === '전체'
      ? mockBands
      : mockBands.filter((band) => band.genre.includes(selectedGenre));

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">밴드</h1>
            <p className="mt-2 text-gray-500">대전 지역에서 활동하는 밴드를 만나보세요</p>
          </div>
          <Link
            href="/bands/new"
            className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            밴드 등록
          </Link>
        </div>

        {/* Genre Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {GENRE_FILTERS.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedGenre === genre
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Band Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBands.map((band) => {
            const orgId = bandOrganizationMap[band.id];
            const org = orgId
              ? mockOrganizations.find((o) => o.id === orgId)
              : null;

            return (
              <Link
                key={band.id}
                href={`/bands/${band.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group"
              >
                {/* Avatar */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      {band.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {band.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                    {band.genre.map((g) => (
                      <span
                        key={g}
                        className="inline-block bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-gray-500">{band.description}</p>
                  <p className="mt-3 text-sm text-gray-400">
                    👤 {band.memberCount}명
                  </p>
                  {org && (
                    <p className="mt-2 text-xs text-gray-400">
                      🏢 {org.name}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {filteredBands.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            해당 장르의 밴드가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
