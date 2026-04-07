'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createOrganization } from '@/lib/queries';

const ORG_TYPES = [
  { value: 'UNIVERSITY_CLUB', label: '대학 동아리' },
  { value: 'BAND_UNION', label: '밴드 연합' },
  { value: 'INDIE_COLLECTIVE', label: '인디 커뮤니티' },
  { value: 'PLANNING_TEAM', label: '기획팀' },
  { value: 'OTHER', label: '기타' },
];

export default function NewOrganizationPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', type: '', description: '', school: '', region: '대전' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createOrganization(form);
      router.push('/organizations');
    } catch (err: any) {
      setError(err?.message || '조직 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[500px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">조직 만들기</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-subtle">조직명</label>
          <input type="text" placeholder="예: 충남대 밴드동아리 소울" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-subtle">유형</label>
          <select value={form.type} onChange={(e) => handleChange('type', e.target.value)} required className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent">
            <option value="">유형을 선택하세요</option>
            {ORG_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-subtle">학교 (선택)</label>
          <input type="text" placeholder="예: 충남대학교" value={form.school} onChange={(e) => handleChange('school', e.target.value)} className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-subtle">지역</label>
          <input type="text" placeholder="예: 대전" value={form.region} onChange={(e) => handleChange('region', e.target.value)} className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-subtle">소개</label>
          <textarea placeholder="조직에 대해 소개해주세요" value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} className="w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm focus:outline-none focus:border-accent resize-none" />
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? '생성 중...' : '조직 만들기'}</Button>
      </form>
    </div>
  );
}
