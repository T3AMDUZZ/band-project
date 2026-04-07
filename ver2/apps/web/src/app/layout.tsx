import type { Metadata, Viewport } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';

export const metadata: Metadata = {
  title: 'We are Live - 대전 밴드 생태계 통합 플랫폼',
  description: '대전 지역 밴드, 공연장, 공연 정보를 한곳에서. 밴드 관리, 공연장 예약, 공연 홍보까지.',
};

export const viewport: Viewport = {
  themeColor: '#F59E0B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-surface text-stone-50 font-sans">
        <QueryProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <BottomNav />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
