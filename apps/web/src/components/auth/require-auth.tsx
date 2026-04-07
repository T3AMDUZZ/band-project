'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-stone-50 mb-2">로그인이 필요합니다</h2>
          <p className="text-sm text-muted mb-6">이 페이지를 이용하려면 먼저 로그인해주세요.</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="block w-full py-3 rounded-xl bg-accent text-surface font-bold text-sm hover:bg-accent-hover transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="block w-full py-3 rounded-xl border border-white/[0.1] text-subtle text-sm hover:border-white/[0.2] transition-colors"
            >
              회원가입
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
