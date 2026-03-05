'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockPerformances } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';

const tabs = [
  { key: 'all', label: '전체' },
  { key: 'upcoming', label: '다가오는 공연' },
  { key: 'past', label: '지난 공연' },
] as const;

type TabKey = (typeof tabs)[number]['key'];

export default function PerformancesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const filtered = mockPerformances.filter((p) => {
    if (activeTab === 'upcoming') return p.status === 'UPCOMING';
    if (activeTab === 'past') return p.status === 'COMPLETED';
    return true;
  });

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">공연</h1>
            <p className="mt-2 text-gray-500">대전 지역의 다가오는 공연을 확인하세요</p>
          </div>
          <Link
            href="/performances/new"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
          >
            공연 등록
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Performance List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12">해당하는 공연이 없습니다.</p>
          )}
          {filtered.map((performance) => {
            const date = new Date(performance.date);
            const month = date.toLocaleString('ko-KR', { month: 'short' });
            const day = date.getDate();
            const weekday = date.toLocaleString('ko-KR', { weekday: 'short' });

            return (
              <Link
                key={performance.id}
                href={`/performances/${performance.id}`}
                className="flex bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                {/* Date Column */}
                <div className="flex-shrink-0 w-24 sm:w-28 bg-indigo-50 flex flex-col items-center justify-center p-4">
                  <span className="text-sm text-indigo-600 font-medium">{month}</span>
                  <span className="text-3xl font-bold text-indigo-700">{day}</span>
                  <span className="text-sm text-indigo-500">{weekday}</span>
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {performance.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    📍 {performance.venue.name} · {performance.venue.address}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
