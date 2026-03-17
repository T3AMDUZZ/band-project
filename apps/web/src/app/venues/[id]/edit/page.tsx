'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { mockVenues } from '@/lib/mock-data';

const inputClass = "w-full p-3 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm placeholder-muted focus:ring-2 focus:ring-accent/50 focus:border-accent/30 outline-none transition-all";

export default function EditVenuePage() {
  const params = useParams();
  const venue = mockVenues.find((v) => v.id === params.id);

  const [form, setForm] = useState({
    name: venue?.name ?? '',
    address: venue?.address ?? '',
    capacity: venue?.capacity?.toString() ?? '',
    operatingHours: '',
    rentalFee: venue?.rentalFee ?? '',
    description: '',
  });

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">공연장을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); alert('공연장 정보가 수정되었습니다.'); };

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-display text-[18px] tracking-[3px] text-muted">EDIT VENUE</h1>
          <span className="flex-1 h-px bg-white/[0.07]" />
        </div>
        <form onSubmit={handleSubmit} className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6 space-y-5">
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">공연장명</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">주소</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">수용 인원</label>
            <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">운영 시간</label>
            <input type="text" name="operatingHours" value={form.operatingHours} onChange={handleChange} placeholder="예: 10:00 - 22:00" className={inputClass} />
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">대관료</label>
            <input type="text" name="rentalFee" value={form.rentalFee} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">소개</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">사진</label>
            <input type="file" disabled className="w-full p-3 border border-white/[0.07] rounded-lg bg-surface-card text-muted cursor-not-allowed text-sm" />
            <p className="text-xs text-muted mt-1">사진 업로드는 추후 지원 예정입니다.</p>
          </div>
          <button type="submit" className="w-full px-8 py-3 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors">수정하기</button>
        </form>
      </div>
    </section>
  );
}
