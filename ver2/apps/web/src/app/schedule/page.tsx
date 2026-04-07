'use client';

import { useState, useMemo, useCallback } from 'react';
import { mockSchedules } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule, getMyBands } from '@/lib/queries';
import { useQueryWithFallback } from '@/lib/use-query-with-fallback';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';

// ──────────── Config ────────────

const TYPE_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  rehearsal: { label: '합주', color: 'bg-blue-500/10 text-blue-400', dot: 'bg-blue-400' },
  performance: { label: '공연', color: 'bg-accent/10 text-accent', dot: 'bg-accent' },
  meeting: { label: '미팅', color: 'bg-purple-500/10 text-purple-400', dot: 'bg-purple-400' },
  other: { label: '기타', color: 'bg-white/[0.06] text-subtle', dot: 'bg-subtle' },
};

const TYPES = ['rehearsal', 'performance', 'meeting', 'other'] as const;
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

type ViewMode = 'calendar' | 'list';

interface NormalizedSchedule {
  id: string;
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  band?: { id: string; name: string };
  band_id?: string;
  created_by?: string;
  raw: any;
}

// ──────────── Modal ────────────

function ScheduleModal({
  open,
  onClose,
  onSubmit,
  initial,
  bands,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initial?: NormalizedSchedule | null;
  bands: any[];
  loading: boolean;
}) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    type: initial?.type || 'rehearsal',
    band_id: initial?.band_id || initial?.band?.id || '',
    date: initial?.date || '',
    startTime: initial?.startTime || '',
    endTime: initial?.endTime || '',
    location: initial?.location || '',
    memo: initial?.description || '',
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startAt = `${form.date}T${form.startTime}:00`;
    const endAt = `${form.date}T${form.endTime}:00`;
    onSubmit({
      title: form.title,
      type: form.type,
      band_id: form.band_id || undefined,
      start_at: startAt,
      end_at: endAt,
      location: form.location || undefined,
      memo: form.memo || undefined,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-[440px] bg-surface-card border border-white/[0.06] sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto">
        {/* Handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-8 h-1 rounded-full bg-white/10" />
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">{initial ? '일정 수정' : '새 일정'}</h2>
            <button onClick={onClose} className="p-1 text-muted hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <input
              type="text"
              placeholder="일정 제목"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
              className="input-base text-base font-medium placeholder:font-normal"
            />

            {/* Type selector */}
            <div className="flex gap-1.5">
              {TYPES.map((t) => {
                const cfg = TYPE_CONFIG[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set('type', t)}
                    className={cn(
                      'flex-1 py-2 rounded-xl text-xs font-medium transition-all',
                      form.type === t
                        ? cn(cfg.color, 'ring-1 ring-current/20')
                        : 'bg-white/[0.03] text-muted hover:text-subtle'
                    )}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            {/* Band */}
            {bands.length > 0 && (
              <select
                value={form.band_id}
                onChange={(e) => set('band_id', e.target.value)}
                className="input-base text-sm"
              >
                <option value="">밴드 선택 (선택사항)</option>
                {bands.map((b: any) => {
                  const band = b.band || b;
                  return <option key={band.id} value={band.id}>{band.name}</option>;
                })}
              </select>
            )}

            {/* Date */}
            <div>
              <label className="text-[11px] text-muted mb-1.5 block">날짜</label>
              <DatePicker value={form.date} onChange={(v) => set('date', v)} required />
            </div>

            {/* Time row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted mb-1.5 block">시작</label>
                <TimePicker value={form.startTime} onChange={(v) => set('startTime', v)} required />
              </div>
              <div>
                <label className="text-[11px] text-muted mb-1.5 block">종료</label>
                <TimePicker value={form.endTime} onChange={(v) => set('endTime', v)} required />
              </div>
            </div>

            {/* Location */}
            <input
              type="text"
              placeholder="장소 (선택사항)"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              className="input-base text-sm"
            />

            {/* Memo */}
            <textarea
              placeholder="메모 (선택사항)"
              value={form.memo}
              onChange={(e) => set('memo', e.target.value)}
              rows={2}
              className="input-base text-sm resize-none"
            />

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? '저장 중...' : initial ? '수정하기' : '일정 추가'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ──────────── Delete Confirm ────────────

function DeleteConfirm({
  open,
  title,
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-surface-card border border-white/[0.06] rounded-2xl p-6 max-w-[340px] w-full space-y-4">
        <h3 className="text-sm font-semibold">일정 삭제</h3>
        <p className="text-[13px] text-subtle leading-relaxed">
          <span className="text-white font-medium">{title}</span> 일정을 삭제하시겠습니까?<br />
          이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" size="md" className="flex-1" onClick={onCancel}>취소</Button>
          <Button variant="danger" size="md" className="flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ──────────── Main Page ────────────

export default function SchedulePage() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [view, setView] = useState<ViewMode>('list');
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<NormalizedSchedule | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NormalizedSchedule | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Data
  const { data: rawSchedules } = useQueryWithFallback<any[]>(['schedules'], () => getSchedules(), mockSchedules);
  const { data: myBands } = useQueryWithFallback<any[]>(['myBands'], getMyBands, []);

  // Normalize
  const schedules: NormalizedSchedule[] = useMemo(() => {
    return (rawSchedules ?? []).map((s: any) => {
      const startAt = s.start_at ? new Date(s.start_at) : null;
      const endAt = s.end_at ? new Date(s.end_at) : null;
      return {
        id: s.id,
        title: s.title,
        type: (s.type || 'other').toLowerCase(),
        date: s.date || (startAt ? startAt.toISOString().split('T')[0] : ''),
        startTime: s.startTime || (startAt ? startAt.toTimeString().slice(0, 5) : ''),
        endTime: s.endTime || (endAt ? endAt.toTimeString().slice(0, 5) : ''),
        location: s.location || '',
        description: s.description || s.memo || '',
        band: s.band,
        band_id: s.band_id,
        created_by: s.created_by,
        raw: s,
      };
    });
  }, [rawSchedules]);

  const filtered = useMemo(() => {
    let items = schedules;
    if (typeFilter) items = items.filter((s) => s.type === typeFilter);
    return items.sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  }, [schedules, typeFilter]);

  const schedulesByDate = useMemo(() => {
    const map = new Map<string, NormalizedSchedule[]>();
    filtered.forEach((s) => {
      const existing = map.get(s.date) || [];
      existing.push(s);
      map.set(s.date, existing);
    });
    return map;
  }, [filtered]);

  // Handlers
  const refresh = useCallback(() => queryClient.invalidateQueries({ queryKey: ['schedules'] }), [queryClient]);

  const handleCreate = async (data: any) => {
    setSaving(true);
    try {
      await createSchedule(data);
      refresh();
      setModalOpen(false);
    } catch (e: any) {
      alert(e?.message || '일정 추가에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editTarget) return;
    setSaving(true);
    try {
      await updateSchedule(editTarget.id, data);
      refresh();
      setEditTarget(null);
    } catch (e: any) {
      alert(e?.message || '일정 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSchedule(deleteTarget.id);
      refresh();
      setDeleteTarget(null);
    } catch (e: any) {
      alert(e?.message || '일정 삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (s: NormalizedSchedule) => { setEditTarget(s); setModalOpen(false); };

  // Calendar
  const monthLabel = `${year}년 ${month + 1}월`;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); };

  // Date group labels for list
  const dateGroups = useMemo(() => {
    const groups: { date: string; label: string; items: NormalizedSchedule[] }[] = [];
    const seen = new Set<string>();
    filtered.forEach((s) => {
      if (!seen.has(s.date)) {
        seen.add(s.date);
        const d = new Date(s.date);
        const dayName = DAY_NAMES[d.getDay()];
        const label = `${d.getMonth() + 1}/${d.getDate()} (${dayName})`;
        groups.push({ date: s.date, label, items: filtered.filter((x) => x.date === s.date) });
      }
    });
    return groups;
  }, [filtered]);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="section-title text-xl">일정</h1>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-white/[0.04] rounded-lg p-0.5">
            <button
              onClick={() => setView('list')}
              className={cn('px-3 py-1.5 rounded-md text-xs transition-all', view === 'list' ? 'bg-white/[0.08] text-white' : 'text-muted')}
            >
              리스트
            </button>
            <button
              onClick={() => setView('calendar')}
              className={cn('px-3 py-1.5 rounded-md text-xs transition-all', view === 'calendar' ? 'bg-white/[0.08] text-white' : 'text-muted')}
            >
              캘린더
            </button>
          </div>

          {/* Add button */}
          {isAuthenticated && (
            <Button size="sm" onClick={openCreate}>추가</Button>
          )}
        </div>
      </div>

      {/* Type filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setTypeFilter(null)}
          className={cn('px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all', !typeFilter ? 'bg-white/[0.08] text-white' : 'text-muted hover:text-subtle')}
        >
          전체
        </button>
        {TYPES.map((key) => {
          const cfg = TYPE_CONFIG[key];
          return (
            <button
              key={key}
              onClick={() => setTypeFilter(typeFilter === key ? null : key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all',
                typeFilter === key ? cn(cfg.color) : 'text-muted hover:text-subtle'
              )}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* ──── Calendar View ──── */}
      {view === 'calendar' && (
        <div className="bg-surface-card/50 border border-white/[0.04] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1.5 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-sm font-medium">{monthLabel}</span>
            <button onClick={nextMonth} className="p-1.5 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px mb-px">
            {DAY_NAMES.map((d, i) => (
              <div key={d} className={cn('text-center text-[10px] py-2', i === 0 ? 'text-red-400/60' : i === 6 ? 'text-blue-400/60' : 'text-muted/60')}>
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="min-h-[72px]" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const daySchedules = schedulesByDate.get(dateStr) || [];
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const dayOfWeek = new Date(year, month, day).getDay();
              return (
                <div
                  key={day}
                  className={cn(
                    'min-h-[72px] p-1.5 rounded-xl text-xs transition-colors',
                    daySchedules.length > 0 && 'hover:bg-white/[0.03] cursor-pointer',
                  )}
                >
                  <span className={cn(
                    'inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] mb-0.5',
                    isToday && 'bg-accent text-black font-medium',
                    !isToday && dayOfWeek === 0 && 'text-red-400/70',
                    !isToday && dayOfWeek === 6 && 'text-blue-400/70',
                  )}>
                    {day}
                  </span>
                  <div className="space-y-0.5">
                    {daySchedules.slice(0, 2).map((s) => {
                      const cfg = TYPE_CONFIG[s.type] || TYPE_CONFIG['other'];
                      return (
                        <div key={s.id} className="flex items-center gap-1 truncate">
                          <span className={cn('w-1 h-1 rounded-full flex-shrink-0', cfg.dot)} />
                          <span className="text-[9px] text-subtle truncate">{s.title}</span>
                        </div>
                      );
                    })}
                    {daySchedules.length > 2 && (
                      <span className="text-[9px] text-muted">+{daySchedules.length - 2}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──── List View ──── */}
      {view === 'list' && (
        <div className="space-y-6">
          {dateGroups.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <p className="text-sm text-muted">등록된 일정이 없습니다</p>
              {isAuthenticated && (
                <Button variant="secondary" size="sm" onClick={openCreate}>첫 일정 추가하기</Button>
              )}
            </div>
          )}

          {dateGroups.map((group) => (
            <div key={group.date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium text-subtle">{group.label}</span>
                <div className="flex-1 h-px bg-white/[0.04]" />
              </div>

              {/* Items */}
              <div className="space-y-1.5">
                {group.items.map((s) => {
                  const cfg = TYPE_CONFIG[s.type] || TYPE_CONFIG['other'];
                  return (
                    <div
                      key={s.id}
                      className="group flex items-start gap-3 p-3.5 rounded-xl border border-transparent hover:bg-surface-card/60 hover:border-white/[0.04] transition-all"
                    >
                      {/* Time column */}
                      <div className="w-[52px] flex-shrink-0 pt-0.5">
                        <p className="text-xs font-mono-space text-subtle">{s.startTime}</p>
                        <p className="text-[10px] font-mono-space text-muted">{s.endTime}</p>
                      </div>

                      {/* Color bar */}
                      <div className={cn('w-0.5 h-10 rounded-full flex-shrink-0 mt-0.5', cfg.dot)} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[13px] font-medium truncate">{s.title}</h3>
                          <span className={cn('text-[10px] px-1.5 py-[1px] rounded-md flex-shrink-0', cfg.color)}>{cfg.label}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-muted">
                          {s.location && <span>{s.location}</span>}
                          {s.band && <span className="text-subtle">{s.band.name}</span>}
                        </div>
                        {s.description && (
                          <p className="text-[11px] text-muted/70 mt-1 line-clamp-1">{s.description}</p>
                        )}
                      </div>

                      {/* Actions — visible on hover */}
                      {isAuthenticated && (
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => openEdit(s)}
                            className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/[0.06] transition-colors"
                            title="수정"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(s)}
                            className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            title="삭제"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ──── Modals ──── */}
      <ScheduleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        bands={myBands ?? []}
        loading={saving}
      />

      <ScheduleModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        initial={editTarget}
        bands={myBands ?? []}
        loading={saving}
      />

      <DeleteConfirm
        open={!!deleteTarget}
        title={deleteTarget?.title || ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
