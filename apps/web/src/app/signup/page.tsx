'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    alert('회원가입이 완료되었습니다.');
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto w-full px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">회원가입</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
              <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
              <input
                type="password"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              회원가입
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
