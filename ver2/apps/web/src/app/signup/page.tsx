'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', name: '', nickname: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form);
      router.push('/');
    } catch (err: any) {
      setError(err?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-[360px] space-y-8">
        <div className="text-center">
          <Link href="/" className="font-display text-3xl text-accent tracking-wider">WE ARE LIVE</Link>
          <p className="text-[13px] text-muted mt-2">새 계정을 만드세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="이름" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required className="input-base" />
          <input type="text" placeholder="닉네임" value={form.nickname} onChange={(e) => handleChange('nickname', e.target.value)} required className="input-base" />
          <input type="email" placeholder="이메일" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required className="input-base" />
          <input type="password" placeholder="비밀번호 (6자 이상)" value={form.password} onChange={(e) => handleChange('password', e.target.value)} required minLength={6} className="input-base" />
          {error && <p className="text-xs text-error pl-1">{error}</p>}
          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? '가입 중...' : '시작하기'}
          </Button>
        </form>

        <p className="text-center text-[13px] text-muted">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-accent hover:text-accent-hover transition-colors font-medium">로그인</Link>
        </p>
      </div>
    </div>
  );
}
