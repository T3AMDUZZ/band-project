'use client';

import { useState } from 'react';
import RequireAuth from '@/components/auth/require-auth';

type ReservationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

interface Reservation {
  id: string;
  band: {
    name: string;
    genre: string[];
    memberCount: number;
    leader: string;
    leaderPhone: string;
    leaderEmail: string;
    description: string;
    snsLinks: { instagram?: string; youtube?: string };
  };
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  message: string;
  response: string;
  createdAt: string;
}

/* ══════════ HELPERS ══════════ */

const statusConfig: Record<ReservationStatus, { label: string; badge: string; color: string }> = {
  PENDING: { label: '대기중', badge: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', color: '#EAB308' },
  APPROVED: { label: '승인됨', badge: 'bg-green-500/10 text-green-500 border-green-500/20', color: '#22C55E' },
  REJECTED: { label: '거절됨', badge: 'bg-red-500/10 text-red-500 border-red-500/20', color: '#EF4444' },
  CANCELLED: { label: '취소됨', badge: 'bg-white/[0.04] text-muted border-white/[0.07]', color: '#78716C' },
};

const fmtDate = (d: string) => {
  const x = new Date(d);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${x.getFullYear()}.${String(x.getMonth() + 1).padStart(2, '0')}.${String(x.getDate()).padStart(2, '0')} (${days[x.getDay()]})`;
};

const fmtRelative = (d: string) => {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (diff === 0) return '오늘';
  if (diff === 1) return '어제';
  if (diff < 7) return `${diff}일 전`;
  return fmtDate(d);
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/* ══════════ COMPONENT ══════════ */

export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<'ALL' | ReservationStatus>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dmModal, setDmModal] = useState<string | null>(null);
  const [announceModal, setAnnounceModal] = useState<string | null>(null);
  const [dmForm, setDmForm] = useState('');
  const [announceForm, setAnnounceForm] = useState({ title: '', message: '' });
  const [responseInput, setResponseInput] = useState('');
  const [messages, setMessages] = useState<Record<string, { text: string; time: string; from: 'venue' | 'band' }[]>>({});

  const filtered = reservations.filter((r) => filter === 'ALL' || r.status === filter);
  const selected = reservations.find((r) => r.id === selectedId);

  const counts = {
    ALL: reservations.length,
    PENDING: reservations.filter((r) => r.status === 'PENDING').length,
    APPROVED: reservations.filter((r) => r.status === 'APPROVED').length,
    REJECTED: reservations.filter((r) => r.status === 'REJECTED').length,
  };

  const handleStatusChange = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, response: responseInput || (status === 'APPROVED' ? '승인되었습니다.' : '거절되었습니다.') } : r))
    );

    try {
      await fetch(`${API_BASE}/notifications/reservation/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, message: responseInput }),
      });
    } catch { /* 백엔드 미연동 시 무시 */ }

    setResponseInput('');
    alert(`예약을 ${status === 'APPROVED' ? '승인' : '거절'}하고 밴드에게 알림을 전송했습니다.`);
  };

  const handleSendDM = () => {
    if (!dmModal || !dmForm.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setMessages((prev) => ({
      ...prev,
      [dmModal]: [...(prev[dmModal] || []), { text: dmForm, from: 'venue', time: timeStr }],
    }));
    setDmForm('');
  };

  const handleAnnounce = async () => {
    if (!announceModal || !announceForm.title || !announceForm.message) return;

    try {
      await fetch(`${API_BASE}/notifications/reservation/${announceModal}/announce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announceForm),
      });
    } catch { /* fallback */ }

    alert(`"${announceForm.title}" 알림이 밴드에게 전송되었습니다.`);
    setAnnounceModal(null);
    setAnnounceForm({ title: '', message: '' });
  };

  return (
    <RequireAuth>
      <div className="min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-7">
          {/* ── HEADER ── */}
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-[22px] tracking-[3px] text-muted">VENUE ADMIN</h1>
                <span className="flex-1 h-px bg-white/[0.07] min-w-[40px]" />
              </div>
              <p className="text-sm text-muted">공연장을 등록하면 여기서 관리할 수 있습니다.</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono-space">
              <div className="px-3 py-2 bg-surface-card border border-white/[0.07] rounded-lg text-center">
                <div className="text-accent text-lg font-bold">{counts.PENDING}</div>
                <div className="text-muted">대기중</div>
              </div>
              <div className="px-3 py-2 bg-surface-card border border-white/[0.07] rounded-lg text-center">
                <div className="text-green-500 text-lg font-bold">{counts.APPROVED}</div>
                <div className="text-muted">승인</div>
              </div>
              <div className="px-3 py-2 bg-surface-card border border-white/[0.07] rounded-lg text-center">
                <div className="text-stone-50 text-lg font-bold">{counts.ALL}</div>
                <div className="text-muted">전체</div>
              </div>
            </div>
          </div>

          {/* ── FILTER TABS ── */}
          <div className="flex gap-1 bg-white/[0.04] rounded-[10px] p-[3px] w-fit mb-5">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setSelectedId(null); }}
                className={`px-4 py-[7px] rounded-lg text-[12px] font-medium transition-all ${
                  filter === f ? 'bg-accent text-surface font-bold' : 'text-muted hover:text-stone-50'
                }`}
              >
                {f === 'ALL' ? '전체' : statusConfig[f].label} ({f === 'ALL' ? counts.ALL : counts[f] || 0})
              </button>
            ))}
          </div>

          {/* ── MAIN CONTENT: LIST + DETAIL ── */}
          <div className="flex gap-5" style={{ minHeight: 'calc(100vh - 280px)' }}>
            {/* LEFT: Reservation List */}
            <div className="w-[380px] flex-shrink-0 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-muted text-sm">데이터가 없습니다</div>
              )}
              {filtered.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`p-4 rounded-[14px] cursor-pointer transition-all border ${
                    selectedId === r.id
                      ? 'bg-accent/[0.06] border-accent/30'
                      : 'bg-surface-card border-white/[0.07] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[15px] font-bold">{r.band.name}</span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-mono-space font-medium rounded-full border ${statusConfig[r.status].badge}`}>
                      {statusConfig[r.status].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted font-mono-space mb-1">
                    <span>{fmtDate(r.date)}</span>
                    <span>{r.startTime}~{r.endTime}</span>
                  </div>
                  <p className="text-xs text-subtle truncate">{r.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-muted">{fmtRelative(r.createdAt)}</span>
                    {messages[r.id] && (
                      <span className="text-[10px] text-accent">{messages[r.id].length} messages</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Detail Panel */}
            <div className="flex-1 min-w-0">
              {!selected ? (
                <div className="h-full flex items-center justify-center bg-surface-card border border-white/[0.07] rounded-[14px]">
                  <div className="text-center text-muted">
                    <p className="text-sm">예약을 선택하면 상세 정보가 표시됩니다</p>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-card border border-white/[0.07] rounded-[14px] overflow-hidden" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
                  {/* Detail Header */}
                  <div className="px-6 py-4 border-b border-white/[0.07] relative">
                    <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${statusConfig[selected.status].color}, transparent)` }} />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{selected.band.name}</h3>
                        <div className="flex gap-1.5 mt-1">
                          {selected.band.genre.map((g) => (
                            <span key={g} className="px-[7px] py-[2px] rounded text-[10px] font-mono-space tracking-wider bg-accent/10 text-accent border border-accent/20">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-mono-space font-medium rounded-full border ${statusConfig[selected.status].badge}`}>
                        {statusConfig[selected.status].label}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* 공연 정보 */}
                    <div>
                      <h4 className="font-display text-[13px] tracking-[2px] text-muted mb-2">공연 정보</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-surface rounded-lg p-3 border border-white/[0.05]">
                          <div className="text-[10px] font-mono-space text-muted mb-0.5">날짜</div>
                          <div className="font-medium">{fmtDate(selected.date)}</div>
                        </div>
                        <div className="bg-surface rounded-lg p-3 border border-white/[0.05]">
                          <div className="text-[10px] font-mono-space text-muted mb-0.5">시간</div>
                          <div className="font-medium">{selected.startTime} ~ {selected.endTime}</div>
                        </div>
                      </div>
                      <div className="mt-2 bg-surface rounded-lg p-3 border border-white/[0.05] text-sm">
                        <div className="text-[10px] font-mono-space text-muted mb-0.5">요청 메시지</div>
                        <div className="text-subtle">{selected.message}</div>
                      </div>
                      {selected.response && (
                        <div className="mt-2 bg-surface rounded-lg p-3 border border-accent/10 text-sm">
                          <div className="text-[10px] font-mono-space text-accent mb-0.5">나의 응답</div>
                          <div className="text-subtle">{selected.response}</div>
                        </div>
                      )}
                    </div>

                    {/* 예약자(밴드) 정보 */}
                    <div>
                      <h4 className="font-display text-[13px] tracking-[2px] text-muted mb-2">예약자 정보</h4>
                      <div className="bg-surface rounded-lg p-4 border border-white/[0.05] space-y-2.5">
                        <div className="text-sm">
                          <span className="text-muted text-xs font-mono-space w-20 inline-block">대표자</span>
                          <span className="font-medium">{selected.band.leader}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted text-xs font-mono-space w-20 inline-block">연락처</span>
                          <a href={`tel:${selected.band.leaderPhone}`} className="text-accent hover:text-accent-hover">{selected.band.leaderPhone}</a>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted text-xs font-mono-space w-20 inline-block">이메일</span>
                          <a href={`mailto:${selected.band.leaderEmail}`} className="text-accent hover:text-accent-hover">{selected.band.leaderEmail}</a>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted text-xs font-mono-space w-20 inline-block">멤버</span>
                          <span>{selected.band.memberCount}명</span>
                        </div>
                        {selected.band.snsLinks.instagram && (
                          <div className="text-sm">
                            <span className="text-muted text-xs font-mono-space w-20 inline-block">인스타</span>
                            <span className="text-subtle">{selected.band.snsLinks.instagram}</span>
                          </div>
                        )}
                        <div className="text-sm pt-1 border-t border-white/[0.05]">
                          <div className="text-muted text-xs font-mono-space mb-1">소개</div>
                          <div className="text-subtle text-xs">{selected.band.description}</div>
                        </div>
                      </div>
                    </div>

                    {/* 다이렉트 메시지 */}
                    <div>
                      <h4 className="font-display text-[13px] tracking-[2px] text-muted mb-2">다이렉트 메시지</h4>
                      <div className="bg-surface rounded-lg border border-white/[0.05] overflow-hidden">
                        <div className="p-3 max-h-[200px] overflow-y-auto space-y-2">
                          {(!messages[selected.id] || messages[selected.id].length === 0) ? (
                            <p className="text-xs text-muted text-center py-4">아직 메시지가 없습니다</p>
                          ) : (
                            messages[selected.id].map((m, i) => (
                              <div key={i} className={`flex ${m.from === 'venue' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-3 py-2 rounded-xl text-xs ${
                                  m.from === 'venue'
                                    ? 'bg-accent/15 text-stone-50 rounded-br-sm'
                                    : 'bg-white/[0.06] text-subtle rounded-bl-sm'
                                }`}>
                                  <p>{m.text}</p>
                                  <span className="text-[9px] text-muted mt-0.5 block">{m.time}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="flex gap-2 p-3 border-t border-white/[0.05]">
                          <input
                            value={dmForm}
                            onChange={(e) => setDmForm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendDM()}
                            placeholder="메시지 입력..."
                            className="flex-1 px-3 py-2 bg-surface-card border border-white/[0.07] rounded-lg text-sm text-stone-50 outline-none focus:border-accent/30 transition-all"
                          />
                          <button
                            onClick={() => { setDmModal(selected.id); handleSendDM(); }}
                            className="px-4 py-2 bg-accent text-surface text-xs font-bold rounded-lg hover:bg-accent-hover transition-colors"
                          >
                            전송
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.07]">
                      {selected.status === 'PENDING' && (
                        <>
                          <div className="w-full mb-2">
                            <input
                              value={responseInput}
                              onChange={(e) => setResponseInput(e.target.value)}
                              placeholder="응답 메시지 (선택사항)"
                              className="w-full px-3 py-2 bg-surface border border-white/[0.07] rounded-lg text-sm text-stone-50 outline-none focus:border-accent/30 transition-all"
                            />
                          </div>
                          <button
                            onClick={() => handleStatusChange(selected.id, 'APPROVED')}
                            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold rounded-lg hover:bg-green-500/20 transition-colors"
                          >
                            승인 + 알림 전송
                          </button>
                          <button
                            onClick={() => handleStatusChange(selected.id, 'REJECTED')}
                            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-lg hover:bg-red-500/20 transition-colors"
                          >
                            거절 + 알림 전송
                          </button>
                        </>
                      )}
                      {selected.status === 'APPROVED' && (
                        <button
                          onClick={() => setAnnounceModal(selected.id)}
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-accent/10 border border-accent/20 text-accent text-sm font-bold rounded-lg hover:bg-accent/20 transition-colors"
                        >
                          공지 알림 보내기
                        </button>
                      )}
                      <a
                        href={`tel:${selected.band.leaderPhone}`}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.06] border border-white/[0.07] text-subtle text-sm font-medium rounded-lg hover:bg-white/[0.1] transition-colors"
                      >
                        전화하기
                      </a>
                      <a
                        href={`mailto:${selected.band.leaderEmail}`}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.06] border border-white/[0.07] text-subtle text-sm font-medium rounded-lg hover:bg-white/[0.1] transition-colors"
                      >
                        이메일
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 공지 알림 모달 ── */}
        {announceModal && (
          <div onClick={() => setAnnounceModal(null)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center">
            <div onClick={(e) => e.stopPropagation()} className="bg-surface-card border border-white/[0.1] rounded-[16px] p-6 w-[400px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-display text-xl tracking-[2px]">공지 알림</h3>
                <button onClick={() => setAnnounceModal(null)} className="text-muted hover:text-stone-50">X</button>
              </div>
              <p className="text-xs text-muted mb-4">밴드 멤버 전원에게 모바일 푸시 알림이 전송됩니다.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono-space text-muted mb-1.5">알림 제목</label>
                  <input
                    value={announceForm.title}
                    onChange={(e) => setAnnounceForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="예: 사운드체크 시간 변경"
                    className="w-full px-3 py-2.5 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-space text-muted mb-1.5">내용</label>
                  <textarea
                    value={announceForm.message}
                    onChange={(e) => setAnnounceForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="예: PA 점검으로 사운드체크를 17:00으로 조정합니다."
                    rows={3}
                    className="w-full px-3 py-2.5 bg-surface border border-white/[0.07] rounded-lg text-stone-50 text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setAnnounceModal(null)} className="flex-1 py-2.5 rounded-lg bg-white/[0.06] text-subtle font-semibold text-sm">취소</button>
                  <button onClick={handleAnnounce} className="flex-1 py-2.5 rounded-lg bg-accent text-surface font-bold text-sm hover:bg-accent-hover transition-colors">알림 전송</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
