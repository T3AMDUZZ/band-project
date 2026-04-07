'use client';

import { useState, useEffect, useCallback } from 'react';
import RequireAuth from '@/components/auth/require-auth';
import { useAuth } from '@/contexts/auth-context';
import { createClient } from '@/lib/supabase';

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
const typeLabel: Record<string, string> = { rehearsal: '합주', performance: '공연', meeting: '미팅', other: '기타' };
const typeColor: Record<string, string> = { rehearsal: 'bg-blue-500', performance: 'bg-accent', meeting: 'bg-purple-500', other: 'bg-stone-500' };

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function SchedulePage() {
  return (
    <RequireAuth>
      <ScheduleContent />
    </RequireAuth>
  );
}

function ScheduleContent() {
  const supabase = createClient();
  const { user } = useAuth();

  const [items, setItems] = useState<any[]>([]);
  const [myBands, setMyBands] = useState<any[]>([]);
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 캘린더 월 네비게이션
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const cells = getCalendarDays(year, month);

  const emptyForm = {
    band_id: '',
    type: 'rehearsal',
    title: '',
    date: '',
    start_time: '19:00',
    end_time: '21:00',
    location: '',
    memo: '',
  };
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  // 내 밴드 로드
  useEffect(() => {
    if (!user) return;
    supabase
      .from('band_members')
      .select('band_id, role, band:bands(id, name)')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setMyBands(data ?? []);
        if (data && data.length > 0 && !form.band_id) {
          setForm(f => ({ ...f, band_id: data[0].band_id }));
        }
      });
  }, [user, supabase]);

  // 일정 로드
  const loadSchedules = useCallback(async () => {
    if (!user || myBands.length === 0) return;
    const bandIds = myBands.map(b => b.band_id);
    const { data } = await supabase
      .from('schedules')
      .select('*, band:bands(name)')
      .in('band_id', bandIds)
      .order('start_at', { ascending: true });
    setItems(data ?? []);
  }, [user, myBands, supabase]);

  useEffect(() => { loadSchedules(); }, [loadSchedules]);

  // 일정 추가/수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.title || !form.date || !form.band_id) {
      setFormError('필수 항목을 입력해주세요.');
      return;
    }

    const startAt = new Date(`${form.date}T${form.start_time}:00`);
    const endAt = new Date(`${form.date}T${form.end_time}:00`);

    const payload = {
      band_id: form.band_id,
      type: form.type,
      title: form.title,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      location: form.location || null,
      memo: form.memo || null,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('schedules').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('schedules').insert({ ...payload, created_by: user!.id }));
    }

    if (error) {
      setFormError(error.message);
      return;
    }

    setForm({ ...emptyForm, band_id: form.band_id });
    setShowForm(false);
    setEditingId(null);
    loadSchedules();
  };

  // 수정 시작
  const handleEdit = (item: any) => {
    const start = new Date(item.start_at);
    const end = new Date(item.end_at);
    setForm({
      band_id: item.band_id,
      type: item.type,
      title: item.title,
      date: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
      start_time: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
      end_time: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
      location: item.location || '',
      memo: item.memo || '',
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  // 폼 취소
  const handleCancel = () => {
    setForm({ ...emptyForm, band_id: myBands[0]?.band_id || '' });
    setShowForm(false);
    setEditingId(null);
  };

  // 일정 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('이 일정을 삭제하시겠습니까?')) return;
    await supabase.from('schedules').delete().eq('id', id);
    loadSchedules();
  };

  // 캘린더용 날짜별 이벤트
  const eventsByDate = new Map<string, any[]>();
  items.forEach(item => {
    const d = new Date(item.start_at);
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (!eventsByDate.has(key)) eventsByDate.set(key, []);
    eventsByDate.get(key)!.push(item);
  });

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const inputClass = "w-full p-2.5 bg-surface border border-white/[0.07] rounded-lg text-sm text-stone-50 focus:outline-none focus:border-accent/40";

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[18px] tracking-[3px] text-muted">SCHEDULE</h1>
            <span className="flex-1 h-px bg-white/[0.07] min-w-[40px]" />
          </div>
          <div className="flex items-center gap-3">
            {/* 뷰 전환 */}
            <div className="flex gap-1 bg-white/[0.04] rounded-[10px] p-[3px]">
              <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'list' ? 'bg-accent text-surface' : 'text-muted'}`}>
                리스트
              </button>
              <button onClick={() => setView('calendar')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'calendar' ? 'bg-accent text-surface' : 'text-muted'}`}>
                캘린더
              </button>
            </div>
            <button
              onClick={() => showForm ? handleCancel() : setShowForm(true)}
              className="px-5 py-2 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors text-sm"
            >
              {showForm ? '취소' : '+ 일정 추가'}
            </button>
          </div>
        </div>

        {/* 밴드 없음 */}
        {myBands.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted mb-2">소속된 밴드가 없어 일정을 관리할 수 없습니다.</p>
            <p className="text-sm text-muted">먼저 밴드를 만들거나 가입해주세요.</p>
          </div>
        )}

        {/* 일정 추가 폼 */}
        {showForm && myBands.length > 0 && (
          <form onSubmit={handleSubmit} className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6 mb-8 animate-fade-up">
            <h2 className="font-bold text-stone-50 mb-4">{editingId ? '일정 수정' : '새 일정'}</h2>
            {formError && <p className="text-red-400 text-sm mb-3">{formError}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono-space text-muted mb-1.5">밴드</label>
                <select value={form.band_id} onChange={e => setForm({ ...form, band_id: e.target.value })} className={inputClass}>
                  {myBands.map(b => <option key={b.band_id} value={b.band_id}>{b.band?.name || b.band_id}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-mono-space text-muted mb-1.5">유형</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputClass}>
                  <option value="rehearsal">합주</option>
                  <option value="performance">공연</option>
                  <option value="meeting">미팅</option>
                  <option value="other">기타</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono-space text-muted mb-1.5">제목 *</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="예: 4월 정기 합주" className={inputClass} required />
              </div>
              <div>
                <label className="block text-[11px] font-mono-space text-muted mb-1.5">날짜 *</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputClass} required />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-mono-space text-muted mb-1.5">시작</label>
                  <input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} className={inputClass} />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-mono-space text-muted mb-1.5">종료</label>
                  <input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono-space text-muted mb-1.5">장소</label>
                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="예: 합주실 사운드웨이브" className={inputClass} />
              </div>
              <div>
                <label className="block text-[11px] font-mono-space text-muted mb-1.5">메모</label>
                <input type="text" value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} placeholder="참고 사항" className={inputClass} />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              {editingId && (
                <button type="button" onClick={handleCancel} className="px-6 py-2.5 border border-white/[0.1] text-subtle rounded-lg hover:bg-white/[0.04] transition-colors text-sm">
                  취소
                </button>
              )}
              <button type="submit" className="px-6 py-2.5 bg-accent text-surface font-bold rounded-lg hover:bg-accent-hover transition-colors text-sm">
                {editingId ? '수정 완료' : '일정 등록'}
              </button>
            </div>
          </form>
        )}

        {/* 리스트 뷰 */}
        {view === 'list' && myBands.length > 0 && (
          <div className="space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-muted py-16">등록된 일정이 없습니다.</p>
            ) : (
              items.map(item => {
                const start = new Date(item.start_at);
                const end = new Date(item.end_at);
                const dateStr = `${start.getFullYear()}.${pad(start.getMonth() + 1)}.${pad(start.getDate())}`;
                const timeStr = `${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(end.getHours())}:${pad(end.getMinutes())}`;
                return (
                  <div key={item.id} className="bg-surface-card border border-white/[0.07] rounded-[14px] p-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-1 h-12 rounded-full ${typeColor[item.type] || 'bg-stone-500'}`} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono-space px-2 py-0.5 bg-white/[0.04] text-muted rounded">
                            {typeLabel[item.type] || item.type}
                          </span>
                          <span className="text-xs text-muted font-mono-space">{item.band?.name}</span>
                        </div>
                        <h3 className="font-bold text-stone-50">{item.title}</h3>
                        <p className="text-sm text-accent font-mono-space mt-1">{dateStr} {timeStr}</p>
                        {item.location && <p className="text-sm text-muted mt-0.5">📍 {item.location}</p>}
                        {item.memo && <p className="text-sm text-subtle mt-0.5">{item.memo}</p>}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        title="수정"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 캘린더 뷰 */}
        {view === 'calendar' && myBands.length > 0 && (
          <div className="bg-surface-card border border-white/[0.07] rounded-[14px] p-6">
            {/* 월 네비 */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="p-2 hover:bg-white/[0.06] rounded-lg text-muted">&larr;</button>
              <h2 className="font-display text-lg tracking-[2px] text-stone-50">{year}. {pad(month + 1)}</h2>
              <button onClick={nextMonth} className="p-2 hover:bg-white/[0.06] rounded-lg text-muted">&rarr;</button>
            </div>
            {/* 요일 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayLabels.map(d => (
                <div key={d} className="text-center text-xs font-mono-space text-muted py-1">{d}</div>
              ))}
            </div>
            {/* 날짜 */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={`e${i}`} />;
                const key = `${year}-${pad(month + 1)}-${pad(day)}`;
                const events = eventsByDate.get(key) || [];
                const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                return (
                  <div key={key} className={`min-h-[60px] p-1 rounded-lg border ${isToday ? 'border-accent/30 bg-accent/5' : 'border-transparent hover:bg-white/[0.02]'}`}>
                    <span className={`text-xs font-mono-space ${isToday ? 'text-accent font-bold' : 'text-subtle'}`}>{day}</span>
                    {events.map(ev => (
                      <div key={ev.id} className={`mt-0.5 px-1 py-0.5 rounded text-[9px] font-medium truncate ${typeColor[ev.type] || 'bg-stone-500'} text-white`}>
                        {ev.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
