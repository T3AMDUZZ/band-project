'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createBand } from '@/lib/queries';

const GENRE_OPTIONS = [
  'Rock', 'Indie Rock', 'Post-Punk', 'Shoegaze', 'Dream Pop',
  'Metal', 'Hardcore', 'Folk', 'Acoustic', 'Jazz', 'Neo-Soul',
  'Synth Pop', 'Electronic', 'Hip-Hop', 'R&B', 'Pop', 'Punk',
];

export default function NewBandPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', description: '', genre: [] as string[] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleGenre = (g: string) => {
    setForm((prev) => ({
      ...prev,
      genre: prev.genre.includes(g) ? prev.genre.filter((x) => x !== g) : [...prev.genre, g],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.genre.length === 0) { setError('장르를 하나 이상 선택해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      await createBand(form);
      router.push('/bands');
    } catch (err: any) {
      setError(err?.message || '밴드 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[500px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">밴드 만들기</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm text-subtle">밴드명</label>
          <input type="text" placeholder="예: The Wavelength" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-subtle">장르 (1개 이상 선택)</label>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((g) => (
              <button key={g} type="button" onClick={() => toggleGenre(g)} className={`px-3 py-1.5 rounded-full text-xs transition-colors ${form.genre.includes(g) ? 'bg-accent text-black' : 'bg-surface-card text-subtle border border-white/[0.07] hover:text-white'}`}>{g}</button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-subtle">소개</label>
          <textarea placeholder="밴드를 소개해주세요" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent resize-none" />
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? '생성 중...' : '밴드 만들기'}</Button>
      </form>
    </div>
  );
}
