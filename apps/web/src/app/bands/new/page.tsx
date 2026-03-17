'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBand } from '@/lib/api/bands';
import { getOrganizations } from '@/lib/api/organizations';

const GENRE_OPTIONS = ['인디록', '얼터너티브', '팝록', '어쿠스틱', '포크', '포스트록', '개러지록', '기타'];
const inputClass = "w-full px-4 py-2.5 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm placeholder-muted focus:ring-2 focus:ring-accent/50 focus:border-accent/30 outline-none transition-all";

export default function NewBandPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrganizations().then(setOrganizations).catch(() => {});
  }, []);

  const handleGenreToggle = (genre: string) => {
    setGenres((prev) => prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const snsLinks: any = {};
      if (instagram) snsLinks.instagram = instagram;
      if (youtube) snsLinks.youtube = youtube;

      await createBand({
        name,
        genre: genres,
        description: description || undefined,
        snsLinks: Object.keys(snsLinks).length > 0 ? snsLinks : undefined,
        organizationId: organizationId || undefined,
      });
      router.push('/bands');
    } catch (err: any) {
      setError(err.response?.data?.message || '밴드 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-display text-[18px] tracking-[3px] text-muted">NEW BAND</h1>
          <span className="flex-1 h-px bg-white/[0.07]" />
        </div>
        {error && <div className="mb-4 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">밴드명</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="밴드 이름을 입력하세요" className={inputClass} required />
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">장르</label>
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.map((genre) => (
                <button key={genre} type="button" onClick={() => handleGenreToggle(genre)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${genres.includes(genre) ? 'bg-accent text-surface font-bold' : 'bg-surface-card border border-white/[0.07] text-muted hover:text-stone-50'}`}
                >{genre}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">소개</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="밴드를 소개해주세요" rows={4} className={`${inputClass} resize-none`} />
          </div>
          <div className="space-y-3">
            <label className="block text-[11px] font-mono-space text-muted">SNS 링크</label>
            <div>
              <label className="block text-[10px] text-muted mb-1">인스타그램</label>
              <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@username" className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] text-muted mb-1">유튜브</label>
              <input type="text" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="채널명 또는 URL" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">소속 조직 <span className="text-muted/50">(선택사항)</span></label>
            <select value={organizationId} onChange={(e) => setOrganizationId(e.target.value)} className={inputClass}>
              <option value="">선택 안 함</option>
              {organizations.map((org: any) => (<option key={org.id} value={org.id}>{org.name}</option>))}
            </select>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50">
              {loading ? '등록 중...' : '등록하기'}
            </button>
            <Link href="/bands" className="px-6 py-2.5 bg-white/[0.06] text-subtle font-medium rounded-lg hover:bg-white/[0.1] transition-colors">취소</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
