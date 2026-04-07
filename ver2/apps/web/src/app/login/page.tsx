'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

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
      router.push('/');
    } catch (err: any) {
      setError(err?.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-[360px] space-y-8">
        <div className="text-center">
          <Link href="/" className="font-display text-3xl text-accent tracking-wider">WE ARE LIVE</Link>
          <p className="text-[13px] text-muted mt-2">계정에 로그인하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-base" />
          <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-base" />
          {error && <p className="text-xs text-error pl-1">{error}</p>}
          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <p className="text-center text-[13px] text-muted">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-accent hover:text-accent-hover transition-colors font-medium">회원가입</Link>
        </p>
      </div>
    </div>
  );
}
