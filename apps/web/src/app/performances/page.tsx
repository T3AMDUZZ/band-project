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
    <section className="py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-[22px] tracking-[3px] text-muted">PERFORMANCES</h1>
              <span className="flex-1 h-px bg-white/[0.07] min-w-[40px]" />
            </div>
            <p className="text-sm text-muted">대전 지역의 다가오는 공연을 확인하세요</p>
          </div>
          <Link
            href="/performances/new"
            className="bg-accent text-surface px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors font-bold text-sm"
          >
            공연 등록
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-white/[0.04] rounded-[10px] p-[3px] w-fit mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-[18px] py-[7px] rounded-lg text-[13px] font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-accent text-surface font-bold'
                  : 'text-muted hover:text-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Performance List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <p className="text-center text-muted py-12">해당하는 공연이 없습니다.</p>
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
                className="flex bg-surface-card border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all overflow-hidden group"
              >
                {/* Date Column */}
                <div className="flex-shrink-0 w-24 sm:w-28 bg-accent/10 border-r border-accent/20 flex flex-col items-center justify-center p-4">
                  <span className="text-sm text-accent font-mono-space font-medium">{month}</span>
                  <span className="text-3xl font-display text-accent">{day}</span>
                  <span className="text-sm text-accent/70 font-mono-space">{weekday}</span>
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                  <h3 className="text-lg font-bold text-stone-50 group-hover:text-accent transition-colors">
                    {performance.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    📍 {performance.venue.name} · {performance.venue.address}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {performance.bands.map((band) => (
                      <span
                        key={band.id}
                        className="inline-block px-2 py-0.5 text-[10px] font-mono-space tracking-wider bg-accent/10 text-accent border border-accent/20 rounded"
                      >
                        {band.name}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm font-bold text-accent">
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
