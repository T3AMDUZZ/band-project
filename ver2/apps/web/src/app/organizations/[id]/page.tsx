'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getOrganizationById, getOrgBands, getOrgAnnouncements } from '@/lib/queries';
import { Badge, GenreTag } from '@/components/ui/badge';
import { Card, CardCover } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ORG_TYPE_LABELS: Record<string, string> = {
  UNIVERSITY_CLUB: '대학 동아리', BAND_UNION: '밴드 연합', INDIE_COLLECTIVE: '인디 커뮤니티', PLANNING_TEAM: '기획팀', OTHER: '기타',
};
// SNS platform labels only — no emoji icons

export default function OrganizationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [tab, setTab] = useState<'bands' | 'announcements' | 'members'>('bands');

  const { data: org, isLoading } = useQuery({ queryKey: ['org', id], queryFn: () => getOrganizationById(id) });
  const { data: orgBands } = useQuery({ queryKey: ['orgBands', id], queryFn: () => getOrgBands(id), enabled: !!org });
  const { data: announcements } = useQuery({ queryKey: ['orgAnnouncements', id], queryFn: () => getOrgAnnouncements(id), enabled: !!org });

  if (isLoading) return <div className="max-w-[1200px] mx-auto px-4 py-20 text-center text-muted">로딩 중...</div>;
  if (!org) return (
    <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
      <p className="text-muted">조직을 찾을 수 없습니다.</p>
      <Link href="/organizations" className="text-accent text-sm mt-2 inline-block">목록으로 돌아가기</Link>
    </div>
  );

  const snsLinks = org.sns_links || org.snsLinks || {};
  const bands = orgBands || [];
  const anns = announcements || [];

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Cover */}
      <div className="relative w-full aspect-[16/6] bg-surface-elevated">
        {(org.cover_image || org.coverImage) ? (
          <img src={org.cover_image || org.coverImage} alt={org.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-card to-surface-elevated" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
      </div>

      <div className="px-4 -mt-16 relative z-10 space-y-6 pb-8">
        <div className="flex items-end gap-4">
          <div className="w-20 h-20 rounded-full bg-surface-card border-4 border-surface flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-2xl font-display text-muted">{org.name[0]}</span>
          </div>
          <div className="pb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{org.name}</h1>
              <Badge>{ORG_TYPE_LABELS[org.type] || org.type}</Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted">
              {org.school && <span>{org.school}</span>}
              {org.region && <span>{org.region}</span>}
            </div>
          </div>
        </div>

        {Object.keys(snsLinks).length > 0 && (
          <div className="flex gap-3">
            {Object.entries(snsLinks).map(([platform, url]) => (
              <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-card border border-white/[0.07] rounded-lg text-xs text-subtle hover:text-white transition-colors">
                {platform}
              </a>
            ))}
          </div>
        )}

        {org.description && <p className="text-sm text-subtle leading-relaxed">{org.description}</p>}

        {/* Tabs */}
        <div className="flex border-b border-white/[0.07]">
          {[
            { key: 'bands' as const, label: `산하밴드 (${bands.length})` },
            { key: 'announcements' as const, label: '공지' },
            { key: 'members' as const, label: '멤버' },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={cn('px-4 py-2.5 text-sm transition-colors relative', tab === t.key ? 'text-white' : 'text-muted hover:text-subtle')}>
              {t.label}{tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
            </button>
          ))}
        </div>

        {tab === 'bands' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bands.map((band: any) => (
              <Card key={band.id} href={`/bands/${band.id}`}>
                <CardCover src={band.cover_image || band.coverImage} alt={band.name} />
                <div className="p-4 space-y-2">
                  <h3 className="font-medium text-sm">{band.name}</h3>
                  <div className="flex gap-1 flex-wrap">{(band.genre || []).map((g: string) => <GenreTag key={g} genre={g} />)}</div>
                </div>
              </Card>
            ))}
            {bands.length === 0 && <p className="text-muted text-sm col-span-full text-center py-8">산하 밴드가 없습니다.</p>}
          </div>
        )}

        {tab === 'announcements' && (
          <div className="space-y-3">
            {anns.map((a: any) => (
              <div key={a.id} className="p-4 bg-surface-card border border-white/[0.07] rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  {(a.is_pinned || a.isPinned) && <span className="text-[10px] px-2 py-0.5 bg-accent/15 text-accent rounded-full">고정</span>}
                  <h3 className="text-sm font-medium flex-1">{a.title}</h3>
                  <span className="text-[10px] text-muted">{new Date(a.created_at || a.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
                <p className="text-xs text-subtle leading-relaxed">{a.content}</p>
                <p className="text-[10px] text-muted">{a.author?.nickname || a.author?.name}</p>
              </div>
            ))}
            {anns.length === 0 && <p className="text-muted text-sm text-center py-8">공지가 없습니다.</p>}
          </div>
        )}

        {tab === 'members' && <p className="text-muted text-sm text-center py-8">멤버 목록은 로그인 후 표시됩니다.</p>}
      </div>
    </div>
  );
}
