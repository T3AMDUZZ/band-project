import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-3">
              <span className="font-display text-lg tracking-[3px] text-accent">WE ARE LIVE</span>
              <span className="text-sm text-muted">&copy; 2026</span>
            </div>
            <a
              href="https://cursor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono-space text-muted hover:text-accent transition-colors"
            >
              Made-with: Cursor
            </a>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              서비스 소개
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
