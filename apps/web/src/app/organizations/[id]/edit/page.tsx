'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockOrganizations } from '@/lib/mock-data';

const typeLabels: Record<string, string> = {
  UNIVERSITY_CLUB: '대학 동아리',
  BAND_UNION: '밴드 연합',
  INDIE_COLLECTIVE: '인디 연합',
};

export default function EditOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const org = mockOrganizations.find((o) => o.id === id);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (org) {
      setName(org.name);
      setType(org.type);
      // mock data doesn't have description, use a placeholder
      setDescription(`${org.name}의 소개입니다.`);
    }
  }, [org]);

  if (!org) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">조직을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    alert('조직 정보가 수정되었습니다. (목 동작)');
    router.push(`/organizations/${id}`);
  };

  return (
    <section className="py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/organizations/${id}`}
          className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          &larr; 조직 상세로
        </Link>

        <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900">조직 수정</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* 조직명 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              조직명
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="조직 이름을 입력하세요"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
            />
          </div>

          {/* 유형 */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              유형
            </label>
            <select
              id="type"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
            >
              <option value="">유형을 선택하세요</option>
              <option value="UNIVERSITY_CLUB">대학 동아리</option>
              <option value="BAND_UNION">밴드 연합</option>
              <option value="INDIE_COLLECTIVE">인디 연합</option>
              <option value="PRODUCTION">기획팀</option>
              <option value="OTHER">기타</option>
            </select>
          </div>

          {/* 소개 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              소개
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="조직을 소개해주세요"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
            />
          </div>

          {/* 프로필 이미지 */}
          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
              프로필 이미지
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              disabled
              className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-400 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-400">이미지 업로드는 추후 지원 예정입니다.</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            수정하기
          </button>
        </form>
      </div>
    </section>
  );
}
