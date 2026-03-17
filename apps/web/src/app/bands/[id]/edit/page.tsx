'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { mockBands, mockOrganizations } from '@/lib/mock-data';

const GENRE_OPTIONS = ['인디록', '얼터너티브', '팝록', '어쿠스틱', '포크', '포스트록', '개러지록', '기타'];

const bandOrganizationMap: Record<string, string> = { '1': '1', '3': '2' };

const inputClass = "w-full px-4 py-2.5 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm placeholder-muted focus:ring-2 focus:ring-accent/50 focus:border-accent/30 outline-none transition-all";

export default function EditBandPage() {
  const params = useParams();
  const id = params.id as string;
  const band = mockBands.find((b) => b.id === id);

  const [name, setName] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [organizationId, setOrganizationId] = useState('');

  useEffect(() => {
    if (band) {
      setName(band.name);
      setGenres([...band.genre]);
      setDescription(band.description);
      setOrganizationId(bandOrganizationMap[band.id] || '');
    }
  }, [band]);

  if (!band) {
    return (
      <section className="py-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-stone-50">밴드를 찾을 수 없습니다</h1>
          <Link href="/bands" className="mt-4 inline-block text-accent hover:text-accent-hover font-medium">목록으로 돌아가기</Link>
        </div>
      </section>
    );
  }

  const handleGenreToggle = (genre: string) => {
    setGenres((prev) => prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('밴드 정보가 수정되었습니다. (목 동작)');
  };

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-display text-[18px] tracking-[3px] text-muted">EDIT BAND</h1>
          <span className="flex-1 h-px bg-white/[0.07]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">밴드명</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
          </div>

          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">장르</label>
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.map((genre) => (
                <button key={genre} type="button" onClick={() => handleGenreToggle(genre)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    genres.includes(genre) ? 'bg-accent text-surface font-bold' : 'bg-surface-card border border-white/[0.07] text-muted hover:text-stone-50'
                  }`}
                >{genre}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">소개</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={`${inputClass} resize-none`} />
          </div>

          <div className="space-y-3">
            <label className="block text-[11px] font-mono-space text-muted">SNS 링크</label>
            <div>
              <label className="block text-[10px] text-muted mb-1">인스타그램</label>
              <input type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] text-muted mb-1">유튜브</label>
              <input type="url" value={youtube} onChange={(e) => setYoutube(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">소속 조직 <span className="text-muted/50">(선택사항)</span></label>
            <select value={organizationId} onChange={(e) => setOrganizationId(e.target.value)} className={inputClass}>
              <option value="">선택 안 함</option>
              {mockOrganizations.map((org) => (<option key={org.id} value={org.id}>{org.name}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">프로필 이미지</label>
            <input type="file" accept="image/*" disabled className="w-full px-4 py-2.5 border border-white/[0.07] rounded-lg bg-surface-card text-muted cursor-not-allowed text-sm" />
            <p className="mt-1 text-xs text-muted">이미지 업로드는 추후 지원 예정입니다.</p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="submit" className="px-6 py-2.5 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors">수정하기</button>
            <Link href={`/bands/${id}`} className="px-6 py-2.5 bg-white/[0.06] text-subtle font-medium rounded-lg hover:bg-white/[0.1] transition-colors">취소</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
