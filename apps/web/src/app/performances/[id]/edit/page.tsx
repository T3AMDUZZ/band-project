'use client';

import { use } from 'react';
import Link from 'next/link';
import { mockPerformances, mockVenues, mockBands } from '@/lib/mock-data';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditPerformancePage({ params }: Props) {
  const { id } = use(params);
  const performance = mockPerformances.find((p) => p.id === id);

  if (!performance) {
    return (
      <section className="py-20 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">공연을 찾을 수 없습니다</h1>
          <p className="mt-2 text-gray-500">수정할 공연 정보가 존재하지 않습니다.</p>
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

  const datetimeValue = performance.date.slice(0, 16);
  const matchedVenue = mockVenues.find((v) => v.name === performance.venue.name);
  const venueId = matchedVenue?.id ?? '';
  const performanceBandIds = performance.bands.map((b) => b.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('API 연동 후 사용 가능합니다');
  };

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">공연 수정</h1>
        <p className="mt-2 text-gray-500">공연 정보를 수정하세요</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* 공연 제목 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              공연 제목
            </label>
            <input
              type="text"
              id="title"
              defaultValue={performance.title}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* 날짜/시간 */}
          <div>
            <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1">
              공연 날짜 / 시간
            </label>
            <input
              type="datetime-local"
              id="datetime"
              defaultValue={datetimeValue}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* 공연장 선택 */}
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
              공연장
            </label>
            <select
              id="venue"
              defaultValue={venueId}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
            >
              <option value="" disabled>
                공연장을 선택하세요
              </option>
              {mockVenues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name} ({venue.address})
                </option>
              ))}
            </select>
          </div>

          {/* 입장료 */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              입장료 (원)
            </label>
            <input
              type="number"
              id="price"
              min={0}
              defaultValue={performance.ticketPrice}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* 출연 밴드 */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">출연 밴드</span>
            <div className="bg-white border border-gray-300 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
              {mockBands.map((band) => (
                <label key={band.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={band.id}
                    defaultChecked={performanceBandIds.includes(band.id)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-900">{band.name}</span>
                  <div className="flex gap-1">
                    {band.genre.map((g) => (
                      <span
                        key={g}
                        className="inline-block px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 공연 설명 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              공연 설명
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="공연에 대한 설명을 입력하세요"
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
            />
          </div>

          {/* 포스터 이미지 */}
          <div>
            <label htmlFor="poster" className="block text-sm font-medium text-gray-700 mb-1">
              포스터 이미지
            </label>
            <input
              type="file"
              id="poster"
              accept="image/*"
              disabled
              className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 text-gray-400 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-400">이미지 업로드는 추후 지원 예정입니다</p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Link
              href={`/performances/${id}`}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              &larr; 취소
            </Link>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              수정하기
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
