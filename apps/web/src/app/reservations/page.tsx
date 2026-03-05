'use client';

import { useState } from 'react';

const sentReservations = [
  { id: '1', band: '블루밍사운드', venue: '인디카페 봄', date: '2026-03-21', status: 'APPROVED' as const, message: '봄맞이 합동 공연입니다' },
  { id: '2', band: '블루밍사운드', venue: '라이브홀 루트', date: '2026-04-10', status: 'PENDING' as const, message: '4월 단독 공연 예약 요청드립니다' },
];

const receivedReservations = [
  { id: '3', band: '미드나잇 크루', venue: '인디카페 봄', date: '2026-04-15', status: 'PENDING' as const, message: '4월 공연 가능할까요?' },
  { id: '4', band: '선셋드라이브', venue: '인디카페 봄', date: '2026-04-20', status: 'PENDING' as const, message: '단독 공연 예약 요청' },
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

export default function ReservationsPage() {
  const [tab, setTab] = useState<'sent' | 'received'>('sent');

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">예약 관리</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('sent')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${
              tab === 'sent'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            보낸 예약
          </button>
          <button
            onClick={() => setTab('received')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${
              tab === 'received'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            받은 예약
          </button>
        </div>

        {/* Sent Tab */}
        {tab === 'sent' && (
          <div className="space-y-4">
            {sentReservations.map((r) => (
              <div key={r.id} className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{r.venue}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusBadge[r.status]}`}>
                    {statusLabel[r.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{r.date}</p>
                <p className="text-sm text-gray-600">{r.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Received Tab */}
        {tab === 'received' && (
          <div className="space-y-4">
            {receivedReservations.map((r) => (
              <div key={r.id} className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{r.band}</h3>
                    <p className="text-sm text-gray-500">{r.venue}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusBadge[r.status]}`}>
                    {statusLabel[r.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{r.date}</p>
                <p className="text-sm text-gray-600 mb-3">{r.message}</p>
                {r.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`예약 #${r.id}을 승인했습니다.`)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => alert(`예약 #${r.id}을 거절했습니다.`)}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      거절
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
