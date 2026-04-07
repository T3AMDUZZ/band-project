'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function DatePicker({ value, onChange, placeholder = '날짜 선택', required }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  const selected = value ? new Date(value + 'T00:00:00') : null;
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const selectDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // 표시 텍스트
  const displayText = selected
    ? `${selected.getFullYear()}. ${selected.getMonth() + 1}. ${selected.getDate()} (${DAY_NAMES[selected.getDay()]})`
    : '';

  // 외부 클릭 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Hidden native input for form validation */}
      {required && <input type="text" value={value} required tabIndex={-1} className="absolute opacity-0 w-0 h-0" onChange={() => {}} />}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm text-left transition-all',
          'hover:border-white/[0.12] focus:border-accent focus:shadow-[0_0_0_1px_rgba(245,158,11,0.15)]',
          value ? 'text-white' : 'text-muted'
        )}
      >
        {displayText || placeholder}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 w-[300px] bg-surface-card border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/40 p-4">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prevMonth} className="p-1 rounded-lg text-muted hover:text-white hover:bg-white/[0.06] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-sm font-medium">{viewYear}년 {viewMonth + 1}월</span>
            <button type="button" onClick={nextMonth} className="p-1 rounded-lg text-muted hover:text-white hover:bg-white/[0.06] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_NAMES.map((d, i) => (
              <div key={d} className={cn(
                'text-center text-[10px] py-1.5',
                i === 0 ? 'text-red-400/50' : i === 6 ? 'text-blue-400/50' : 'text-muted/50'
              )}>{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = dateStr === value;
              const isToday = dateStr === todayStr;
              const dayOfWeek = new Date(viewYear, viewMonth, day).getDay();

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDate(day)}
                  className={cn(
                    'w-full aspect-square rounded-lg text-xs flex items-center justify-center transition-all',
                    isSelected
                      ? 'bg-accent text-black font-medium'
                      : isToday
                        ? 'bg-white/[0.06] text-white font-medium'
                        : 'hover:bg-white/[0.06] text-subtle',
                    !isSelected && dayOfWeek === 0 && 'text-red-400/70',
                    !isSelected && dayOfWeek === 6 && 'text-blue-400/70',
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today shortcut */}
          <div className="mt-3 pt-3 border-t border-white/[0.04] flex justify-center">
            <button
              type="button"
              onClick={() => { selectDate(today.getDate()); setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}
              className="text-[11px] text-accent hover:text-accent-hover transition-colors"
            >
              오늘
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
