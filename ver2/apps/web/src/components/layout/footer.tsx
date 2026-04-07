import Link from 'next/link';

export function Footer() {
  return (
    <footer className="hidden md:block border-t border-white/[0.04] bg-surface mt-20">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-display text-lg text-accent tracking-wider">WE ARE LIVE</span>
            <p className="text-[11px] text-muted/60 mt-1.5 leading-relaxed">대전 밴드 생태계 통합 플랫폼</p>
          </div>
          <div className="flex gap-8 text-[12px] text-muted/60">
            <Link href="/about" className="hover:text-subtle transition-colors">소개</Link>
            <Link href="/terms" className="hover:text-subtle transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-subtle transition-colors">개인정보처리방침</Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/[0.03]">
          <p className="text-[11px] text-muted/40">&copy; 2026 We are Live</p>
        </div>
      </div>
    </footer>
  );
}
