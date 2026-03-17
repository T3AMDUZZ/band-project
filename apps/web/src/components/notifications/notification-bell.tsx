'use client';

import { useState, useEffect, useRef } from 'react';
import {
  isPushSupported,
  getPermissionStatus,
  subscribeToPush,
  registerServiceWorker,
} from '@/lib/push-notifications';

// Mock 알림 데이터 (백엔드 연동 전)
const mockNotifications = [
  {
    id: '1',
    type: 'RESERVATION_APPROVED',
    title: '공연 예약 승인',
    body: '인디카페 봄에서 블루밍사운드의 3/21 예약을 승인했습니다.',
    isRead: false,
    createdAt: '2026-03-14T10:30:00',
    reservation: { venue: '인디카페 봄', band: '블루밍사운드', date: '2026-03-21' },
  },
  {
    id: '2',
    type: 'VENUE_ANNOUNCEMENT',
    title: '📢 인디카페 봄: 장비 안내',
    body: '공연 당일 PA 시스템 점검이 있으니 사운드체크 시간을 17:00로 조정 부탁드립니다.',
    isRead: false,
    createdAt: '2026-03-13T15:00:00',
    reservation: { venue: '인디카페 봄', band: '블루밍사운드', date: '2026-03-21' },
  },
  {
    id: '3',
    type: 'SHOW_REMINDER',
    title: '공연 리마인더',
    body: '블루밍사운드의 인디카페 봄 공연이 7일 남았습니다.',
    isRead: true,
    createdAt: '2026-03-12T09:00:00',
    reservation: null,
  },
];

const typeIcons: Record<string, string> = {
  RESERVATION_APPROVED: '✅',
  RESERVATION_REJECTED: '❌',
  VENUE_ANNOUNCEMENT: '📢',
  SHOW_REMINDER: '🔔',
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [showPushPrompt, setShowPushPrompt] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    // 서비스워커 등록
    registerServiceWorker();

    // 현재 푸시 상태 확인
    const status = getPermissionStatus();
    setPushEnabled(status === 'granted');

    // 처음 방문이면 푸시 구독 프롬프트 표시
    if (status === 'default' && isPushSupported()) {
      const dismissed = localStorage.getItem('push-prompt-dismissed');
      if (!dismissed) {
        setShowPushPrompt(true);
      }
    }
  }, []);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEnablePush = async () => {
    const result = await subscribeToPush('mock-user-id');
    setPushEnabled(result);
    setShowPushPrompt(false);
    if (!result) {
      localStorage.setItem('push-prompt-dismissed', 'true');
    }
  };

  const handleDismissPrompt = () => {
    setShowPushPrompt(false);
    localStorage.setItem('push-prompt-dismissed', 'true');
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const fmtTime = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;
    return `${Math.floor(diffHour / 24)}일 전`;
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* 푸시 구독 프롬프트 */}
      {showPushPrompt && (
        <div className="fixed top-20 right-4 z-[201] bg-surface-card border border-accent/30 rounded-[14px] p-4 w-[320px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔔</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-stone-50 mb-1">알림을 받으시겠습니까?</p>
              <p className="text-xs text-muted mb-3">
                공연장에서 예약 승인/거절, 공지사항을 모바일 알림으로 받을 수 있습니다.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleEnablePush}
                  className="px-3 py-1.5 bg-accent text-surface text-xs font-bold rounded-lg hover:bg-accent-hover transition-colors"
                >
                  알림 허용
                </button>
                <button
                  onClick={handleDismissPrompt}
                  className="px-3 py-1.5 bg-white/[0.06] text-muted text-xs rounded-lg hover:bg-white/[0.1] transition-colors"
                >
                  나중에
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 벨 아이콘 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-subtle hover:text-stone-50 hover:bg-white/[0.06] transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 알림 패널 */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-[380px] bg-surface-card border border-white/[0.07] rounded-[14px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[200] overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <h3 className="font-display text-[14px] tracking-[2px] text-muted">NOTIFICATIONS</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] text-accent hover:text-accent-hover transition-colors"
                >
                  전체 읽음
                </button>
              )}
              <span
                className={`w-2 h-2 rounded-full ${pushEnabled ? 'bg-green-500' : 'bg-muted'}`}
                title={pushEnabled ? '푸시 알림 활성' : '푸시 알림 비활성'}
              />
            </div>
          </div>

          {/* 알림 목록 */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-muted text-sm">알림이 없습니다</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`px-4 py-3 border-b border-white/[0.04] cursor-pointer transition-colors hover:bg-white/[0.03] ${
                    !n.isRead ? 'bg-accent/[0.03]' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-base mt-0.5">{typeIcons[n.type] || '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-bold text-stone-50 truncate">
                          {n.title}
                        </span>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-subtle mt-0.5 line-clamp-2">{n.body}</p>
                      <span className="text-[10px] text-muted font-mono-space mt-1 block">
                        {fmtTime(n.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 푸시 상태 */}
          {!pushEnabled && isPushSupported() && (
            <div className="px-4 py-3 border-t border-white/[0.07] bg-white/[0.02]">
              <button
                onClick={handleEnablePush}
                className="w-full text-center text-xs text-accent hover:text-accent-hover transition-colors"
              >
                🔔 모바일 알림 활성화하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
