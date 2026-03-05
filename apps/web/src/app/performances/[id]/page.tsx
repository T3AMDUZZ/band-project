import Link from 'next/link';
import { mockPerformances } from '@/lib/mock-data';
import { formatDate, formatPrice } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PerformanceDetailPage({ params }: Props) {
  const { id } = await params;
  const performance = mockPerformances.find((p) => p.id === id);

  if (!performance) {
    return (
      <section className="py-20 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">공연을 찾을 수 없습니다</h1>
          <p className="mt-2 text-gray-500">요청하신 공연 정보가 존재하지 않습니다.</p>
          <Link
            href="/performances"
            className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            목록으로
          </Link>
        </div>
      </section>
    );
  }

  const statusLabel = performance.status === 'UPCOMING' ? '예정' : '종료';

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{performance.title}</h1>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">📅</span>
            <div>
              <p className="text-sm text-gray-500">날짜 / 시간</p>
              <p className="font-medium text-gray-900">{formatDate(performance.date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">📍</span>
            <div>
              <p className="text-sm text-gray-500">장소</p>
              <p className="font-medium text-gray-900">{performance.venue.name}</p>
              <p className="text-sm text-gray-500">{performance.venue.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">💰</span>
            <div>
              <p className="text-sm text-gray-500">입장료</p>
              <p className="font-medium text-gray-900">{formatPrice(performance.ticketPrice)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">🎸</span>
            <div>
              <p className="text-sm text-gray-500">상태</p>
              <span
                className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                  performance.status === 'UPCOMING'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Performing Bands */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">출연 밴드</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {performance.bands.map((band) => (
              <Link
                key={band.id}
                href={`/bands/${band.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 group flex items-center gap-4"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-white">{band.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                    {band.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {band.genre.map((g) => (
                      <span
                        key={g}
                        className="inline-block px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-10">
          <Link
            href="/performances"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            &larr; 목록으로
          </Link>
        </div>
      </div>
    </section>
  );
}
