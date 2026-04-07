import { cn } from '@/lib/utils';
import type { BandStatus, ReservationStatus, AvailabilityStatus, PerformanceStatus } from '@/lib/mock-data';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'muted';

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/[0.06] text-subtle',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  muted: 'bg-white/[0.04] text-muted',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center px-2 py-[2px] rounded-md text-[11px] font-medium', variantStyles[variant], className)}>
      {children}
    </span>
  );
}

export function BandStatusBadge({ status }: { status: BandStatus }) {
  const config: Record<BandStatus, { label: string; variant: BadgeVariant }> = {
    ACTIVE: { label: '활동중', variant: 'success' },
    HIATUS: { label: '휴식', variant: 'warning' },
    DISBANDED: { label: '해체', variant: 'muted' },
  };
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const config: Record<ReservationStatus, { label: string; variant: BadgeVariant }> = {
    PENDING: { label: '대기', variant: 'warning' },
    APPROVED: { label: '승인', variant: 'success' },
    REJECTED: { label: '거절', variant: 'error' },
    CANCELLED: { label: '취소', variant: 'muted' },
  };
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function AvailabilityDot({ status }: { status: AvailabilityStatus }) {
  const colors: Record<AvailabilityStatus, string> = {
    AVAILABLE: 'bg-success',
    BOOKED: 'bg-error',
    BLOCKED: 'bg-muted/50',
  };
  return <span className={cn('inline-block w-1.5 h-1.5 rounded-full', colors[status])} />;
}

export function PerformanceStatusBadge({ status }: { status: PerformanceStatus }) {
  const config: Record<PerformanceStatus, { label: string; variant: BadgeVariant }> = {
    UPCOMING: { label: '예정', variant: 'success' },
    COMPLETED: { label: '종료', variant: 'muted' },
    CANCELLED: { label: '취소', variant: 'error' },
  };
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function GenreTag({ genre }: { genre: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] bg-white/[0.04] text-muted border border-white/[0.04]">
      {genre}
    </span>
  );
}
