'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', nickname: '', email: '', password: '', passwordConfirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      await signup({ email: form.email, password: form.password, name: form.name, nickname: form.nickname });
      router.push('/myband');
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent/30 focus:outline-none transition-all";

  return (
    <section className="py-16 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto w-full px-4">
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-8">
          <h1 className="font-display text-3xl tracking-[3px] text-center text-accent mb-8">SIGN UP</h1>
          {error && (
            <div className="mb-4 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono-space text-muted mb-2">이름</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className="block text-[11px] font-mono-space text-muted mb-2">닉네임</label>
              <input type="text" name="nickname" value={form.nickname} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className="block text-[11px] font-mono-space text-muted mb-2">이메일</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className="block text-[11px] font-mono-space text-muted mb-2">비밀번호</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className="block text-[11px] font-mono-space text-muted mb-2">비밀번호 확인</label>
              <input type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange} className={inputClass} required />
            </div>
            <button type="submit" disabled={loading} className="w-full px-8 py-3 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50">
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-accent font-medium hover:text-accent-hover">로그인</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
