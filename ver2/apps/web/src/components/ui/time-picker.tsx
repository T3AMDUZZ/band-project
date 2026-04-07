'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string; // HH:mm
  onChange: (time: string) => void;
  placeholder?: string;
  required?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '10', '15', '20', '30', '40', '45', '50'];

export function TimePicker({ value, onChange, placeholder = '시간 선택', required }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);

  const [selHour, selMinute] = value ? value.split(':') : ['', ''];

  const setTime = (h: string, m: string) => {
    onChange(`${h}:${m}`);
  };

  // 외부 클릭 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 열릴 때 선택된 시간으로 스크롤
  useEffect(() => {
    if (open && hourRef.current && selHour) {
      const el = hourRef.current.querySelector(`[data-hour="${selHour}"]`);
      el?.scrollIntoView({ block: 'center' });
    }
  }, [open, selHour]);

  const displayText = value || '';

  return (
    <div ref={ref} className="relative">
      {required && <input type="text" value={value} required tabIndex={-1} className="absolute opacity-0 w-0 h-0" onChange={() => {}} />}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full px-4 py-3 bg-surface-card border border-white/[0.07] rounded-xl text-sm text-left transition-all font-mono-space',
          'hover:border-white/[0.12] focus:border-accent focus:shadow-[0_0_0_1px_rgba(245,158,11,0.15)]',
          value ? 'text-white' : 'text-muted'
        )}
      >
        {displayText || placeholder}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 w-[220px] bg-surface-card border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
          <div className="flex h-[240px]">
            {/* Hours */}
            <div ref={hourRef} className="flex-1 overflow-y-auto border-r border-white/[0.04] py-1 scrollbar-thin">
              <div className="px-2 py-1.5 text-[10px] text-muted/50 sticky top-0 bg-surface-card">시</div>
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  data-hour={h}
                  onClick={() => setTime(h, selMinute || '00')}
                  className={cn(
                    'w-full px-3 py-1.5 text-left text-sm font-mono-space transition-colors rounded-lg mx-1',
                    selHour === h
                      ? 'bg-accent/15 text-accent font-medium'
                      : 'text-subtle hover:bg-white/[0.06] hover:text-white'
                  )}
                  style={{ width: 'calc(100% - 8px)' }}
                >
                  {h}
                </button>
              ))}
            </div>

            {/* Minutes */}
            <div className="flex-1 overflow-y-auto py-1 scrollbar-thin">
              <div className="px-2 py-1.5 text-[10px] text-muted/50 sticky top-0 bg-surface-card">분</div>
              {MINUTES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setTime(selHour || '12', m); setOpen(false); }}
                  className={cn(
                    'w-full px-3 py-1.5 text-left text-sm font-mono-space transition-colors rounded-lg mx-1',
                    selMinute === m
                      ? 'bg-accent/15 text-accent font-medium'
                      : 'text-subtle hover:bg-white/[0.06] hover:text-white'
                  )}
                  style={{ width: 'calc(100% - 8px)' }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Quick presets */}
          <div className="border-t border-white/[0.04] p-2 flex gap-1 flex-wrap">
            {['09:00', '14:00', '18:00', '19:00', '20:00'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { onChange(t); setOpen(false); }}
                className={cn(
                  'px-2 py-1 rounded-md text-[10px] font-mono-space transition-colors',
                  value === t ? 'bg-accent/15 text-accent' : 'bg-white/[0.04] text-muted hover:text-subtle'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
