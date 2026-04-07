'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RequireAuth from '@/components/auth/require-auth';

export default function BandJoinPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('초대 코드를 입력해 주세요.');
      return;
    }
    // API 연동 시 코드 검증
    alert('밴드에 가입되었습니다.');
    router.push('/bands');
  };

  return (
    <RequireAuth>
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">밴드 가입</h1>
        <p className="text-sm text-gray-500 mb-8">초대 코드를 입력하여 밴드에 참여하세요</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">초대 코드</label>
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(''); }}
              placeholder="예: BAND-2026"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 text-sm">
              가입
            </button>
            <Link href="/bands" className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 text-sm">
              취소
            </Link>
          </div>
        </form>
      </div>
    </section>
    </RequireAuth>
  );
}
