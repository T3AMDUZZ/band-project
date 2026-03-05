'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('로그인 되었습니다.');
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto w-full px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">로그인</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              로그인
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="text-indigo-600 font-medium hover:text-indigo-700">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
