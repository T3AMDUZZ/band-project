'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getBandById, getBandMembers, getPerformances, getPerformanceBands } from '@/lib/queries';
import { BandStatusBadge, GenreTag } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// SNS platform labels only — no emoji icons

export default function BandDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [tab, setTab] = useState<'members' | 'performances'>('members');

  const { data: band, isLoading } = useQuery({
    queryKey: ['band', id],
    queryFn: () => getBandById(id),
  });

  const { data: members } = useQuery({
    queryKey: ['bandMembers', id],
    queryFn: () => getBandMembers(id),
    enabled: !!band,
  });

  const { data: allPerformances } = useQuery({
    queryKey: ['performances'],
    queryFn: getPerformances,
    enabled: !!band,
  });

  if (isLoading) {
    return <div className="max-w-[1200px] mx-auto px-4 py-20 text-center text-muted">로딩 중...</div>;
  }

  if (!band) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
        <p className="text-muted">밴드를 찾을 수 없습니다.</p>
        <Link href="/bands" className="text-accent text-sm mt-2 inline-block">목록으로 돌아가기</Link>
      </div>
    );
  }

  const snsLinks = band.sns_links || band.snsLinks || {};
  const inviteCode = band.invite_code || band.inviteCode || '';

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Cover Hero */}
      <div className="relative w-full aspect-[16/6] bg-surface-elevated">
        {(band.cover_image || band.coverImage) ? (
          <img src={band.cover_image || band.coverImage} alt={band.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-card to-surface-elevated" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
      </div>

      <div className="px-4 -mt-16 relative z-10 space-y-6 pb-8">
        {/* Profile */}
        <div className="flex items-end gap-4">
          <div className="w-24 h-24 rounded-full bg-surface-card border-4 border-surface flex items-center justify-center overflow-hidden flex-shrink-0">
            {(band.profile_image || band.profileImage) ? (
              <img src={band.profile_image || band.profileImage} alt={band.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-display text-muted">{band.name[0]}</span>
            )}
          </div>
          <div className="pb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{band.name}</h1>
              <BandStatusBadge status={band.status} />
            </div>
            {band.organization && (
              <Link href={`/organizations/${band.organization_id || band.organizationId}`} className="text-xs text-accent hover:text-accent-hover transition-colors">
                소속: {band.organization.name} →
              </Link>
            )}
          </div>
        </div>

        {/* Genre */}
        <div className="flex gap-2 flex-wrap">
          {(band.genre || []).map((g: string) => <GenreTag key={g} genre={g} />)}
        </div>

        {/* Description */}
        {band.description && <p className="text-sm text-subtle leading-relaxed">{band.description}</p>}

        {/* SNS */}
        {Object.keys(snsLinks).length > 0 && (
          <div className="flex gap-3">
            {Object.entries(snsLinks).map(([platform, url]) => (
              <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 bg-surface-card border border-white/[0.07] rounded-lg text-xs text-subtle hover:text-white transition-colors capitalize">
                {platform}
              </a>
            ))}
          </div>
        )}

        {/* Invite Code */}
        {inviteCode && (
          <div className="flex items-center gap-3 p-3 bg-surface-card border border-white/[0.07] rounded-xl">
            <span className="text-xs text-muted">초대코드:</span>
            <code className="font-mono-space text-sm text-accent">{inviteCode}</code>
            <button onClick={() => navigator.clipboard.writeText(inviteCode)} className="px-2 py-1 text-[10px] bg-surface-elevated rounded text-subtle hover:text-white transition-colors">복사</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-white/[0.07]">
          {([{ key: 'members' as const, label: '멤버' }, { key: 'performances' as const, label: '공연이력' }]).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={cn('px-4 py-2.5 text-sm transition-colors relative', tab === t.key ? 'text-white' : 'text-muted hover:text-subtle')}>
              {t.label}
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {tab === 'members' && (
          <div className="space-y-2">
            {(members || []).map((m: any) => (
              <div key={m.id} className="flex items-center gap-3 p-3 bg-surface-card border border-white/[0.07] rounded-xl">
                <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center text-sm text-muted">
                  {m.user?.nickname?.[0] || '?'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.user?.nickname || m.user?.name || '알 수 없음'}</p>
                  <p className="text-xs text-muted">{m.part || '-'}</p>
                </div>
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full', m.role === 'ADMIN' ? 'bg-accent/15 text-accent' : 'bg-surface-elevated text-muted')}>{m.role}</span>
              </div>
            ))}
            {(!members || members.length === 0) && <p className="text-center text-muted py-8 text-sm">멤버 정보가 없습니다.</p>}
          </div>
        )}

        {/* Performances Tab */}
        {tab === 'performances' && (
          <div className="space-y-4">
            {(allPerformances || []).length === 0 && <p className="text-center text-muted py-8 text-sm">공연 이력이 없습니다.</p>}
            {(allPerformances || []).map((perf: any) => (
              <Link key={perf.id} href={`/performances/${perf.id}`} className="block relative pl-6 border-l-2 border-white/[0.07] hover:border-accent transition-colors py-2">
                <div className="absolute left-[-5px] top-3 w-2 h-2 rounded-full bg-accent" />
                <p className="text-sm font-medium">{perf.title}</p>
                <p className="text-xs text-muted mt-0.5">{perf.date} {perf.start_time} · {perf.venue?.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
