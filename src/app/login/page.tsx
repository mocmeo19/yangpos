import type { Metadata } from 'next';
import Image from 'next/image';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoginShowcase } from '@/components/auth/LoginShowcase';

export const metadata: Metadata = {
  title: 'Đăng nhập',
};

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <LoginShowcase />
      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <Image
            src="/brand/yangpos-logo.svg"
            alt="YangPOS"
            width={180}
            height={44}
            loading="eager"
            unoptimized
            className="mb-10 h-11 w-auto"
          />
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Chào mừng trở lại
          </h1>
          <p className="mt-1 mb-8 text-sm text-ink-soft">
            Đăng nhập để bắt đầu ca bán hàng.
          </p>
          <LoginForm />
          <p className="mt-8 text-center text-xs text-ink-faint">
            Dữ liệu bán hàng được lưu ngay trên trình duyệt của máy này.
          </p>
        </div>
      </section>
    </main>
  );
}
