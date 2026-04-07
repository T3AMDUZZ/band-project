'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { joinBandByCode } from '@/lib/queries';

export default function BandJoinPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) { setError('초대코드를 입력해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      const bandId = await joinBandByCode(code.trim());
      router.push(`/bands/${bandId}`);
    } catch (err: any) {
      setError(err?.message || '유효하지 않은 초대코드입니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">밴드 참여하기</h1>
        <p className="text-sm text-muted">초대코드를 입력하세요</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input type="text" placeholder="XXXX-XXXX" value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }} className="w-full px-4 py-4 bg-surface-card border border-white/[0.07] rounded-xl text-center text-lg font-mono-space tracking-widest focus:outline-none focus:border-accent placeholder:text-muted/40" maxLength={9} />
          {error && <p className="text-xs text-error mt-1.5 text-center">{error}</p>}
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? '참여 중...' : '참여하기'}</Button>
      </form>
      <div className="text-center mt-6">
        <Link href="/bands" className="text-sm text-subtle hover:text-accent transition-colors">또는 밴드 목록에서 찾기 →</Link>
      </div>
    </div>
  );
}
