'use client';

import { mockOrganizations } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getOrganizations } from '@/lib/queries';
import { useQueryWithFallback } from '@/lib/use-query-with-fallback';

const ORG_TYPE_LABELS: Record<string, string> = {
  UNIVERSITY_CLUB: '대학 동아리',
  BAND_UNION: '밴드 연합',
  INDIE_COLLECTIVE: '인디 커뮤니티',
  PLANNING_TEAM: '기획팀',
  OTHER: '기타',
};

export default function OrganizationsPage() {
  const { data: orgs } = useQueryWithFallback(['organizations'], getOrganizations, mockOrganizations);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">조직</h1>
        <Link href="/organizations/new" className="px-4 py-2 bg-accent text-black rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors">+ 조직 만들기</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(orgs ?? []).map((org: any) => (
          <Card key={org.id} href={`/organizations/${org.id}`}>
            <div className="w-full aspect-[16/7] bg-gradient-to-br from-surface-card to-surface-elevated flex items-center justify-center overflow-hidden">
              {(org.cover_image ?? org.coverImage) ? (
                <img src={org.cover_image ?? org.coverImage} alt={org.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-display text-muted/20">{org.name[0]}</span>
              )}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">{org.name}</h3>
                <Badge>{ORG_TYPE_LABELS[org.type] || org.type}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                {org.school && <span>{org.school}</span>}
                {org.region && <span>{org.region}</span>}
              </div>
              {org.description && <p className="text-xs text-subtle line-clamp-2">{org.description}</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
