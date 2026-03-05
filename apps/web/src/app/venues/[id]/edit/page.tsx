'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { mockVenues } from '@/lib/mock-data';

export default function EditVenuePage() {
  const params = useParams();
  const venue = mockVenues.find((v) => v.id === params.id);

  const [form, setForm] = useState({
    name: venue?.name ?? '',
    address: venue?.address ?? '',
    capacity: venue?.capacity?.toString() ?? '',
    operatingHours: '',
    rentalFee: venue?.rentalFee ?? '',
    description: '',
  });

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">공연장을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('공연장 정보가 수정되었습니다.');
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">공연장 수정</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">공연장명</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">수용 인원</label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">운영 시간</label>
            <input
              type="text"
              name="operatingHours"
              value={form.operatingHours}
              onChange={handleChange}
              placeholder="예: 10:00 - 22:00"
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">대관료</label>
            <input
              type="text"
              name="rentalFee"
              value={form.rentalFee}
              onChange={handleChange}
              placeholder="예: 200,000원/일"
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">소개</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사진</label>
            <input
              type="file"
              disabled
              className="border rounded-lg p-3 w-full bg-gray-100 text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">사진 업로드는 추후 지원 예정입니다.</p>
          </div>
          <button
            type="submit"
            className="w-full px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            수정하기
          </button>
        </form>
      </div>
    </section>
  );
}
