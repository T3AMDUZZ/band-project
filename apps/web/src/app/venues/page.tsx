import Link from 'next/link';
import { mockVenues } from '@/lib/mock-data';

export default function VenuesPage() {
  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">공연장</h1>
            <p className="mt-1 text-gray-500">대전 지역 공연장을 찾아보세요</p>
          </div>
          <Link
            href="/venues/new"
            className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            공연장 등록
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVenues.map((venue) => (
            <Link
              key={venue.id}
              href={`/venues/${venue.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 group"
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {venue.name}
              </h3>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{venue.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>👥</span>
                  <span>수용 인원 {venue.capacity}명</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>💰</span>
                  <span>{venue.rentalFee}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
