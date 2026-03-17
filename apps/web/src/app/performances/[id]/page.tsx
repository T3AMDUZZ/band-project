import Link from 'next/link';
import { mockPerformances } from '@/lib/mock-data';
import { formatDate, formatPrice } from '@/lib/utils';

const BAND_COLORS = ['#F97316', '#06B6D4', '#A855F7', '#EC4899', '#22C55E', '#EAB308', '#EF4444', '#6366F1'];

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PerformanceDetailPage({ params }: Props) {
  const { id } = await params;
  const performance = mockPerformances.find((p) => p.id === id);

  if (!performance) {
    return (
      <section className="py-20 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-stone-50">공연을 찾을 수 없습니다</h1>
          <p className="mt-2 text-muted">요청하신 공연 정보가 존재하지 않습니다.</p>
          <Link href="/performances" className="mt-6 inline-block bg-accent text-surface px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors font-bold">
            목록으로
          </Link>
        </div>
      </section>
    );
  }

  const statusLabel = performance.status === 'UPCOMING' ? '예정' : '종료';

  return (
    <section className="py-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="font-display text-4xl sm:text-5xl tracking-[2px] text-stone-50">{performance.title}</h1>

        {/* Info Section */}
        <div className="mt-8 bg-surface-card border border-white/[0.07] rounded-[14px] p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">📅</span>
            <div>
              <p className="text-xs text-muted font-mono-space">날짜 / 시간</p>
              <p className="font-medium text-stone-50">{formatDate(performance.date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">📍</span>
            <div>
              <p className="text-xs text-muted font-mono-space">장소</p>
              <p className="font-medium text-stone-50">{performance.venue.name}</p>
              <p className="text-sm text-muted">{performance.venue.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">💰</span>
            <div>
              <p className="text-xs text-muted font-mono-space">입장료</p>
              <p className="font-bold text-accent">{formatPrice(performance.ticketPrice)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">🎸</span>
            <div>
              <p className="text-xs text-muted font-mono-space">상태</p>
              <span className={`inline-block mt-1 px-3 py-1 text-xs font-mono-space font-medium rounded-full ${
                performance.status === 'UPCOMING'
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : 'bg-white/[0.04] text-muted border border-white/[0.07]'
              }`}>
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Performing Bands */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-[16px] tracking-[2px] text-muted">PERFORMING BANDS</h2>
            <span className="flex-1 h-px bg-white/[0.07]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {performance.bands.map((band, i) => (
              <Link
                key={band.id}
                href={`/bands/${band.id}`}
                className="bg-surface-card border border-white/[0.07] rounded-[14px] hover:border-white/[0.15] transition-all p-5 group flex items-center gap-4"
              >
                <div
                  className="w-12 h-12 rounded-[11px] flex items-center justify-center flex-shrink-0 font-display text-lg text-surface"
                  style={{ background: BAND_COLORS[i % BAND_COLORS.length] }}
                >
                  {band.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-stone-50 group-hover:text-accent transition-colors truncate">
                    {band.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {band.genre.map((g) => (
                      <span key={g} className="inline-block px-2 py-0.5 text-[10px] font-mono-space tracking-wider bg-accent/10 text-accent rounded">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-10">
          <Link href="/performances" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors">
            &larr; 목록으로
          </Link>
        </div>
      </div>
    </section>
  );
}
