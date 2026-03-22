'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockRehearsals } from '@/lib/mock-data';

export default function RehearsalDetailPage() {
  const params = useParams();
  const rehearsal = mockRehearsals.find((r) => r.id === params.id);

  if (!rehearsal) {
    return (
      <section className="py-16 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gray-500">일정을 찾을 수 없습니다.</p>
          <Link href="/schedule" className="mt-4 inline-block text-indigo-600 font-medium text-sm">
            목록으로
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{rehearsal.title}</h1>
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">밴드</span>
            <span className="font-medium text-gray-900">{rehearsal.bandName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">날짜</span>
            <span className="font-medium text-gray-900">{rehearsal.date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">시간</span>
            <span className="font-medium text-gray-900">{rehearsal.startTime} - {rehearsal.endTime}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">장소</span>
            <span className="font-medium text-gray-900">{rehearsal.location}</span>
          </div>
          {rehearsal.memo && (
            <div className="pt-3 border-t">
              <p className="text-sm text-gray-500 mb-1">메모</p>
              <p className="text-sm text-gray-900">{rehearsal.memo}</p>
            </div>
          )}
        </div>
        <div className="mt-6">
          <Link href="/schedule" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            ← 목록으로
          </Link>
        </div>
      </div>
    </section>
  );
}
