import type { Metadata, Viewport } from 'next';
import { Noto_Sans_KR, Bebas_Neue, Space_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import QueryProvider from '@/providers/query-provider';
import { AuthProvider } from '@/contexts/auth-context';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono-space',
  display: 'swap',
});

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
    <html lang="ko" className={`${notoSansKR.variable} ${bebasNeue.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-surface text-stone-50 font-sans">
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
