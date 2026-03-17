'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const sentReservations = [
  { id: '1', band: '블루밍사운드', venue: '인디카페 봄', date: '2026-03-21', status: 'APPROVED' as const, message: '봄맞이 합동 공연입니다' },
  { id: '2', band: '블루밍사운드', venue: '라이브홀 루트', date: '2026-04-10', status: 'PENDING' as const, message: '4월 단독 공연 예약 요청드립니다' },
];

const receivedReservations = [
  { id: '3', band: '미드나잇 크루', venue: '인디카페 봄', date: '2026-04-15', status: 'PENDING' as const, message: '4월 공연 가능할까요?' },
  { id: '4', band: '선셋드라이브', venue: '인디카페 봄', date: '2026-04-20', status: 'PENDING' as const, message: '단독 공연 예약 요청' },
  { id: '5', band: '블루밍사운드', venue: '인디카페 봄', date: '2026-03-21', status: 'APPROVED' as const, message: '봄맞이 합동 공연입니다' },
];

const statusBadge: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
  APPROVED: 'bg-green-500/10 text-green-500 border border-green-500/20',
  REJECTED: 'bg-red-500/10 text-red-500 border border-red-500/20',
  CANCELLED: 'bg-white/[0.04] text-muted border border-white/[0.07]',
};

const statusLabel: Record<string, string> = {
  PENDING: '대기중',
  APPROVED: '승인됨',
  REJECTED: '거절됨',
  CANCELLED: '취소됨',
};

export default function ReservationsPage() {
  const [tab, setTab] = useState<'sent' | 'received'>('sent');
  const [announceModal, setAnnounceModal] = useState<string | null>(null);
  const [announceForm, setAnnounceForm] = useState({ title: '', message: '' });
  const [sentNotifications, setSentNotifications] = useState<Record<string, { title: string; message: string; time: string }[]>>({});

  const handleApprove = async (reservationId: string) => {
    // 백엔드 연동 시 실제 API 호출
    try {
      await fetch(`${API_BASE}/notifications/reservation/${reservationId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED', message: '예약이 승인되었습니다.' }),
      });
    } catch {
      // 백엔드 미연동 시 fallback
    }
    alert(`예약 #${reservationId}을 승인하고 밴드에게 알림을 전송했습니다.`);
  };

  const handleReject = async (reservationId: string) => {
    try {
      await fetch(`${API_BASE}/notifications/reservation/${reservationId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', message: '죄송합니다, 해당 날짜는 이용이 어렵습니다.' }),
      });
    } catch {
      // fallback
    }
    alert(`예약 #${reservationId}을 거절하고 밴드에게 알림을 전송했습니다.`);
  };

  const handleSendAnnouncement = async () => {
    if (!announceModal || !announceForm.title || !announceForm.message) return;

    try {
      await fetch(`${API_BASE}/notifications/reservation/${announceModal}/announce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announceForm),
      });
    } catch {
      // fallback
    }

    // 로컬 상태 업데이트
    setSentNotifications((prev) => ({
      ...prev,
      [announceModal]: [
        ...(prev[announceModal] || []),
        { ...announceForm, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) },
      ],
    }));

    alert(`📢 "${announceForm.title}" 알림이 밴드에게 전송되었습니다.`);
    setAnnounceModal(null);
    setAnnounceForm({ title: '', message: '' });
  };

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-display text-[18px] tracking-[3px] text-muted">RESERVATIONS</h1>
          <span className="flex-1 h-px bg-white/[0.07]" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.04] rounded-[10px] p-[3px] w-fit mb-6">
          <button
            onClick={() => setTab('sent')}
            className={`px-5 py-2 rounded-lg text-[13px] font-medium transition-all ${
              tab === 'sent' ? 'bg-accent text-surface font-bold' : 'text-muted hover:text-stone-50'
            }`}
          >
            보낸 예약
          </button>
          <button
            onClick={() => setTab('received')}
            className={`px-5 py-2 rounded-lg text-[13px] font-medium transition-all ${
              tab === 'received' ? 'bg-accent text-surface font-bold' : 'text-muted hover:text-stone-50'
            }`}
          >
            받은 예약 (공연장)
          </button>
        </div>

        {/* ── 보낸 예약 탭 ── */}
        {tab === 'sent' && (
          <div className="space-y-4">
            {sentReservations.map((r) => (
              <div key={r.id} className="bg-surface-card border border-white/[0.07] rounded-[14px] p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-stone-50">{r.venue}</h3>
                  <span className={`px-3 py-1 text-xs font-mono-space font-medium rounded-full ${statusBadge[r.status]}`}>
                    {statusLabel[r.status]}
                  </span>
                </div>
                <p className="text-sm text-muted font-mono-space mb-1">{r.date}</p>
                <p className="text-sm text-subtle">{r.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── 받은 예약 탭 (공연장 관리자 시점) ── */}
        {tab === 'received' && (
          <div className="space-y-4">
            {receivedReservations.map((r) => (
              <div key={r.id} className="bg-surface-card border border-white/[0.07] rounded-[14px] p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-stone-50">{r.band}</h3>
                    <p className="text-sm text-muted">{r.venue}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-mono-space font-medium rounded-full ${statusBadge[r.status]}`}>
                    {statusLabel[r.status]}
                  </span>
                </div>
                <p className="text-sm text-muted font-mono-space mb-1">{r.date}</p>
                <p className="text-sm text-subtle mb-3">{r.message}</p>

                {/* 승인/거절 버튼 */}
                {r.status === 'PENDING' && (
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold rounded-lg hover:bg-green-500/20 transition-colors"
                    >
                      ✅ 승인 + 알림
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      ❌ 거절 + 알림
                    </button>
                  </div>
                )}

                {/* 공지 알림 보내기 버튼 (승인된 예약에만 표시) */}
                {r.status === 'APPROVED' && (
                  <div className="pt-3 border-t border-white/[0.05]">
                    <button
                      onClick={() => setAnnounceModal(r.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-accent/10 border border-accent/20 text-accent text-sm font-bold rounded-lg hover:bg-accent/20 transition-colors"
                    >
                      📢 밴드에게 공지 알림 보내기
                    </button>
                    {/* 이전에 보낸 알림 목록 */}
                    {sentNotifications[r.id] && sentNotifications[r.id].length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <div className="text-[10px] font-mono-space text-muted">보낸 알림:</div>
                        {sentNotifications[r.id].map((n, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-subtle pl-2 border-l-2 border-accent/20">
                            <span className="text-muted font-mono-space">{n.time}</span>
                            <span className="font-medium text-stone-50">{n.title}</span>
                            <span className="text-muted truncate">{n.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 공지 알림 모달 ── */}
      {announceModal && (
        <div
          onClick={() => setAnnounceModal(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-card border border-white/[0.1] rounded-[16px] p-6 w-[400px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display text-xl tracking-[2px]">📢 공지 알림</h3>
              <button
                onClick={() => setAnnounceModal(null)}
                className="text-muted hover:text-stone-50 transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-muted mb-4">
              이 알림은 예약한 밴드의 모든 멤버에게 모바일 푸시 알림으로 전송됩니다.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono-space text-muted mb-1.5">알림 제목</label>
                <input
                  value={announceForm.title}
                  onChange={(e) => setAnnounceForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="예: 사운드체크 시간 변경"
                  className="w-full px-3 py-2.5 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent/30 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono-space text-muted mb-1.5">내용</label>
                <textarea
                  value={announceForm.message}
                  onChange={(e) => setAnnounceForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="예: PA 점검으로 사운드체크를 17:00으로 조정 부탁드립니다."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent/30 outline-none transition-all resize-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setAnnounceModal(null)}
                  className="flex-1 py-2.5 rounded-lg bg-white/[0.06] text-subtle font-semibold text-sm hover:bg-white/[0.1] transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSendAnnouncement}
                  className="flex-1 py-2.5 rounded-lg bg-accent text-surface font-bold text-sm hover:bg-accent-hover transition-colors"
                >
                  📲 알림 전송
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
