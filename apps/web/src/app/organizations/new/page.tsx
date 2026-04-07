'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RequireAuth from '@/components/auth/require-auth';

const inputClass = "w-full px-4 py-2.5 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm placeholder-muted focus:ring-2 focus:ring-accent/50 focus:border-accent/30 outline-none transition-all";

export default function NewOrganizationPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('조직이 등록되었습니다. (목 동작)');
    router.push('/organizations');
  };

  return (
    <RequireAuth>
    <section className="py-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/organizations" className="text-sm text-accent hover:text-accent-hover transition-colors">
          &larr; 조직 목록으로
        </Link>

        <div className="flex items-center gap-3 mt-6 mb-8">
          <h1 className="font-display text-[18px] tracking-[3px] text-muted">NEW ORGANIZATION</h1>
          <span className="flex-1 h-px bg-white/[0.07]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-[11px] font-mono-space text-muted mb-2">조직명</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="조직 이름을 입력하세요" className={inputClass} />
          </div>

          <div>
            <label htmlFor="type" className="block text-[11px] font-mono-space text-muted mb-2">유형</label>
            <select id="type" required value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
              <option value="">유형을 선택하세요</option>
              <option value="UNIVERSITY_CLUB">대학 동아리</option>
              <option value="BAND_UNION">밴드 연합</option>
              <option value="INDIE_COLLECTIVE">인디 연합</option>
              <option value="PRODUCTION">기획팀</option>
              <option value="OTHER">기타</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-[11px] font-mono-space text-muted mb-2">소개</label>
            <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="조직을 소개해주세요" className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label htmlFor="profileImage" className="block text-[11px] font-mono-space text-muted mb-2">프로필 이미지</label>
            <input id="profileImage" type="file" accept="image/*" disabled className="w-full px-4 py-2.5 border border-white/[0.07] rounded-lg bg-surface-card text-muted cursor-not-allowed text-sm" />
            <p className="mt-1 text-xs text-muted">이미지 업로드는 추후 지원 예정입니다.</p>
          </div>

          <button type="submit" className="w-full px-6 py-3 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors">
            등록하기
          </button>
        </form>
      </div>
    </section>
    </RequireAuth>
  );
}
