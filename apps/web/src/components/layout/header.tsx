'use client';

import { useState } from 'react';
import Link from 'next/link';
import NotificationBell from '@/components/notifications/notification-bell';

const navLinks = [
  { href: '/myband', label: '내 밴드' },
  { href: '/bands', label: '다른 밴드' },
  { href: '/schedule', label: '일정' },
  { href: '/booking', label: '대관' },
  { href: '/venues', label: '공연장' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-surface/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-[3px] text-accent">WE ARE LIVE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] rounded-[10px] p-[3px]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-[18px] py-[7px] rounded-lg text-[13px] font-medium text-muted hover:text-stone-50 hover:bg-white/[0.06] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-2">
            <NotificationBell />
            <Link
              href="/admin"
              className="px-3.5 py-[6px] rounded-lg border border-accent/30 bg-accent/10 text-accent text-[13px] font-semibold hover:bg-accent/20 transition-all"
            >
              🏠 공연장 관리
            </Link>
            <Link
              href="/mypage"
              className="px-3.5 py-[6px] rounded-lg border border-white/[0.1] bg-white/[0.04] text-subtle text-[13px] hover:text-stone-50 hover:border-white/[0.15] transition-all"
            >
              👤 마이페이지
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-1">
            <NotificationBell />
            <button
              type="button"
              className="p-2 rounded-lg text-subtle hover:bg-white/[0.06]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.07] bg-surface">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-lg text-base font-medium text-subtle hover:bg-white/[0.06] hover:text-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-white/[0.07]" />
            <Link
              href="/admin"
              className="block px-3 py-2 rounded-lg text-base font-medium text-accent hover:bg-accent/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 공연장 관리
            </Link>
            <Link
              href="/mypage"
              className="block px-3 py-2 rounded-lg text-base font-medium text-subtle hover:bg-white/[0.06]"
              onClick={() => setMobileMenuOpen(false)}
            >
              👤 마이페이지
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
