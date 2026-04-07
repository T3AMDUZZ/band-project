'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/myband');
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto w-full px-4">
        <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-8">
          <h1 className="font-display text-3xl tracking-[3px] text-center text-accent mb-8">LOGIN</h1>
          {error && (
            <div className="mb-4 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono-space text-muted mb-2">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent/30 focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono-space text-muted mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent/30 focus:outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="text-accent font-medium hover:text-accent-hover">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
