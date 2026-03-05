'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { mockBands, mockOrganizations } from '@/lib/mock-data';

const GENRE_OPTIONS = [
  '인디록',
  '얼터너티브',
  '팝록',
  '어쿠스틱',
  '포크',
  '포스트록',
  '개러지록',
  '기타',
];

// 밴드-조직 매핑
const bandOrganizationMap: Record<string, string> = {
  '1': '1',
  '3': '2',
};

export default function EditBandPage() {
  const params = useParams();
  const id = params.id as string;

  const band = mockBands.find((b) => b.id === id);

  const [name, setName] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [organizationId, setOrganizationId] = useState('');

  useEffect(() => {
    if (band) {
      setName(band.name);
      setGenres([...band.genre]);
      setDescription(band.description);
      setOrganizationId(bandOrganizationMap[band.id] || '');
    }
  }, [band]);

  if (!band) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">밴드를 찾을 수 없습니다</h1>
          <Link
            href="/bands"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </section>
    );
  }

  const handleGenreToggle = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('밴드 정보가 수정되었습니다. (목 동작)');
  };

  return (
    <section className="py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">밴드 수정</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 밴드명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              밴드명
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="밴드 이름을 입력하세요"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              required
            />
          </div>

          {/* 장르 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              장르
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    genres.includes(genre)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* 소개 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              소개
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="밴드를 소개해주세요"
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-none"
            />
          </div>

          {/* SNS 링크 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              SNS 링크
            </label>
            <div>
              <label className="block text-xs text-gray-500 mb-1">인스타그램</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">유튜브</label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* 소속 조직 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              소속 조직 <span className="text-gray-400 font-normal">(선택사항)</span>
            </label>
            <select
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white"
            >
              <option value="">선택 안 함</option>
              {mockOrganizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          {/* 프로필 이미지 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              프로필 이미지
            </label>
            <input
              type="file"
              accept="image/*"
              disabled
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-400">이미지 업로드는 추후 지원 예정입니다.</p>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              수정하기
            </button>
            <Link
              href={`/bands/${id}`}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
