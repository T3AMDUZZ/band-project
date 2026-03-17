import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import QueryProvider from '@/providers/query-provider';
import { AuthProvider } from '@/contexts/auth-context';

export const metadata: Metadata = {
  title: 'We are Live - 대전 밴드 생태계 통합 플랫폼',
  description: '대전 지역 밴드 · 동아리 · 공연장을 연결하는 조직 기반 공연·소통·예약 통합 플랫폼',
  manifest: '/manifest.json',
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
      <body className="min-h-screen flex flex-col bg-surface text-stone-50">
        <QueryProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
