'use client';

import Link from 'next/link';
import { mockBands, mockOrganizations } from '@/lib/mock-data';

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
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

const statusLabel: Record<string, string> = {
  PENDING: '대기중',
  APPROVED: '승인됨',
  REJECTED: '거절됨',
  CANCELLED: '취소됨',
};

export default function MyPage() {
  const myBands = mockBands.slice(0, 2);
  const myOrgs = mockOrganizations.slice(0, 1);

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">
                {mockUser.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{mockUser.name}</h1>
              <p className="text-sm text-gray-500">@{mockUser.nickname}</p>
              <p className="text-sm text-gray-500">{mockUser.email}</p>
            </div>
          </div>
          <div className="mt-5">
            <button
              onClick={() => alert('프로필 수정 페이지로 이동합니다.')}
              className="px-5 py-2 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
            >
              프로필 수정
            </button>
          </div>
        </div>

        {/* My Bands */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">내 밴드</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myBands.map((band) => (
              <Link
                key={band.id}
                href={`/bands/${band.id}`}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">{band.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {band.name}
                    </h3>
                    <p className="text-xs text-gray-500">{band.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {band.genre.map((g) => (
                    <span
                      key={g}
                      className="inline-block px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* My Organizations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">내 조직</h2>
          <div className="space-y-4">
            {myOrgs.map((org) => (
              <Link
                key={org.id}
                href={`/organizations/${org.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {org.name}
                </h3>
                <div className="mt-2 flex gap-4 text-sm text-gray-500">
                  <span>밴드 {org.bandCount}개</span>
                  <span>멤버 {org.memberCount}명</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* My Reservations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">내 예약</h2>
          <div className="space-y-4">
            {myReservations.map((r) => (
              <div key={r.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{r.venue}</h3>
                    <p className="text-sm text-gray-500">{r.date}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusBadge[r.status]}`}>
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
