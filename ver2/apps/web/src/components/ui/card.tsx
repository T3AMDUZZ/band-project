import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  hoverable?: boolean;
}

export function Card({ children, className, href, hoverable = true }: CardProps) {
  const styles = cn(
    'bg-surface-card border border-white/[0.05] rounded-2xl overflow-hidden',
    hoverable && 'hover:border-white/[0.1] hover:bg-surface-card/80 transition-all duration-300',
    className
  );

  if (href) {
    return (
      <Link href={href} className={cn(styles, 'block')}>
        {children}
      </Link>
    );
  }

  return <div className={styles}>{children}</div>;
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-4 pb-2', className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-4 pt-2', className)}>{children}</div>;
}

export function CardCover({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  return (
    <div className={cn('w-full aspect-[16/9] bg-surface-elevated/50 flex items-center justify-center relative overflow-hidden', className)}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-surface-card to-surface-elevated">
          <svg className="w-8 h-8 text-white/[0.06]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
      )}
    </div>
  );
}
