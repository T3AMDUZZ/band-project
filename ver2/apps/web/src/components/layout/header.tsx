'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

// 비로그인: 탐색 위주
const publicLinks = [
  { href: '/performances', label: '공연' },
  { href: '/bands', label: '밴드' },
  { href: '/venues', label: '공연장' },
];

// 로그인: 관리 기능 추가
const authLinks = [
  { href: '/performances', label: '공연' },
  { href: '/bands', label: '밴드' },
  { href: '/venues', label: '공연장' },
  { href: '/schedule', label: '일정' },
  { href: '/booking', label: '대관' },
];

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const navLinks = isAuthenticated ? authLinks : publicLinks;

  // 프로필 드롭다운 외부 클릭 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-[22px] text-accent tracking-wider hover:opacity-80 transition-opacity">
          WE ARE LIVE
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[13px] transition-all',
                  active
                    ? 'text-white bg-white/[0.06]'
                    : 'text-subtle hover:text-white hover:bg-white/[0.04]'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-surface-elevated animate-pulse" />
          ) : isAuthenticated ? (
            <>
              {/* Notification */}
              <Link href="/notifications" className="relative p-2 text-subtle hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
              </Link>

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-8 h-8 rounded-full bg-surface-elevated border border-white/[0.07] flex items-center justify-center text-xs font-medium text-subtle hover:text-white hover:border-white/20 transition-all"
                >
                  {user?.nickname?.[0]?.toUpperCase() || '?'}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-11 w-52 bg-surface-card/95 backdrop-blur-xl border border-white/[0.07] rounded-xl py-1.5 shadow-2xl shadow-black/40">
                    <div className="px-4 py-2.5 border-b border-white/[0.04]">
                      <p className="text-sm font-medium truncate">{user?.nickname || user?.name}</p>
                      <p className="text-[11px] text-muted truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { href: '/mypage', label: '마이페이지' },
                        { href: '/reservations', label: '예약 관리' },
                        { href: '/booking/admin', label: '공연장 관리' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-[13px] text-subtle hover:text-white hover:bg-white/[0.04] transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-white/[0.04] pt-1">
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="w-full text-left px-4 py-2 text-[13px] text-red-400 hover:bg-white/[0.04] transition-colors"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden sm:block px-3 py-1.5 text-[13px] text-subtle hover:text-white transition-colors">
                로그인
              </Link>
              <Link href="/signup" className="px-4 py-1.5 bg-accent text-black rounded-lg text-[13px] font-medium hover:bg-accent-hover transition-colors">
                시작하기
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-subtle hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-white/[0.04] bg-surface-card/95 backdrop-blur-xl">
          <div className="py-2">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block px-4 py-2.5 text-[13px] transition-colors',
                    active ? 'text-white bg-white/[0.04]' : 'text-subtle hover:text-white'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          {!isAuthenticated && (
            <div className="border-t border-white/[0.04] p-4 flex gap-2">
              <Link href="/login" className="flex-1 text-center py-2 text-[13px] text-subtle border border-white/[0.07] rounded-lg hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                로그인
              </Link>
              <Link href="/signup" className="flex-1 text-center py-2 text-[13px] bg-accent text-black rounded-lg font-medium" onClick={() => setMobileOpen(false)}>
                시작하기
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
