import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, IBM_Plex_Mono } from 'next/font/google';
import { cn } from '@/lib/cn';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600'],
});

export const metadata: Metadata = {
  title: {
    default: 'YangPOS',
    template: '%s · YangPOS',
  },
  description:
    'Ứng dụng POS quản lý đặt món cho quán ăn, lưu dữ liệu ngay trên trình duyệt.',
};

export const viewport: Viewport = {
  themeColor: '#f6f2ec',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="vi"
      className={cn(beVietnamPro.variable, ibmPlexMono.variable, 'antialiased')}
    >
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
