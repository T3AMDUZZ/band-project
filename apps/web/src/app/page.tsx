import Link from 'next/link';
import { mockPerformances, mockBands, mockVenues } from '@/lib/mock-data';
import { formatDate, formatPrice } from '@/lib/utils';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              대전의 밴드 씬을 한눈에
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto">
              밴드 · 동아리 · 공연장을 연결하는 통합 플랫폼
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/performances"
                className="w-full sm:w-auto px-8 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors text-center"
              >
                공연 둘러보기
              </Link>
              <Link
                href="/bands/new"
                className="w-full sm:w-auto px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-center"
              >
                밴드 등록하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Performances */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">다가오는 공연</h2>
            <Link
              href="/performances"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              더 보기 &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPerformances.map((performance) => (
              <Link
                key={performance.id}
                href={`/performances/${performance.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                {/* Poster Placeholder */}
                <div className="h-40 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div className="p-5">
                  <p className="text-sm text-indigo-600 font-medium">
                    {formatDate(performance.date)}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {performance.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {performance.venue.name} · {performance.venue.address}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {performance.bands.map((band) => (
                      <span
                        key={band.id}
                        className="inline-block px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full"
                      >
                        {band.name}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-900">
                    {formatPrice(performance.ticketPrice)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Active Bands */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">활동 중인 밴드</h2>
            <Link
              href="/bands"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              더 보기 &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockBands.map((band) => (
              <Link
                key={band.id}
                href={`/bands/${band.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 group"
              >
                <div className="flex items-center gap-4">
                  {/* Profile Placeholder */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-white">
                      {band.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                      {band.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{band.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {band.genre.map((g) => (
                      <span
                        key={g}
                        className="inline-block px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">
                    멤버 {band.memberCount}명
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Venues */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">공연장</h2>
            <Link
              href="/venues"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              더 보기 &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVenues.map((venue) => (
              <Link
                key={venue.id}
                href={`/venues/${venue.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {venue.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">{venue.address}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    수용 {venue.capacity}명
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {venue.rentalFee}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold">
              우리 동아리도 함께하고 싶다면?
            </h2>
            <p className="mt-3 text-indigo-100 max-w-xl mx-auto">
              조직을 등록하고 밴드와 공연을 관리해보세요.
            </p>
            <Link
              href="/organizations/new"
              className="mt-6 inline-block px-8 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
            >
              조직 등록하기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
