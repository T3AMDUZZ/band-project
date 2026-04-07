'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createVenue } from '@/lib/api/venues';
import RequireAuth from '@/components/auth/require-auth';

const inputClass = "w-full p-3 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm placeholder-muted focus:ring-2 focus:ring-accent/50 focus:border-accent/30 outline-none transition-all";

export default function NewVenuePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', address: '', capacity: '', operatingHours: '', rentalFee: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createVenue({
        name: form.name,
        address: form.address,
        capacity: form.capacity ? parseInt(form.capacity) : undefined,
        operatingHours: form.operatingHours || undefined,
        rentalFee: form.rentalFee || undefined,
        description: form.description || undefined,
      });
      router.push('/venues');
    } catch (err: any) {
      setError(err.response?.data?.message || '공연장 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth>
    <section className="py-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-display text-[18px] tracking-[3px] text-muted">NEW VENUE</h1>
          <span className="flex-1 h-px bg-white/[0.07]" />
        </div>
        {error && <div className="mb-4 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>}
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
            <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">운영 시간</label>
            <input type="text" name="operatingHours" value={form.operatingHours} onChange={handleChange} placeholder="예: 14:00 - 23:00" className={inputClass} />
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">대관료</label>
            <input type="text" name="rentalFee" value={form.rentalFee} onChange={handleChange} placeholder="예: 200,000원/일" className={inputClass} />
          </div>
          <div>
            <label className="block text-[11px] font-mono-space text-muted mb-2">소개</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} />
          </div>
          <button type="submit" disabled={loading} className="w-full px-8 py-3 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50">
            {loading ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </div>
    </section>
    </RequireAuth>
  );
}
