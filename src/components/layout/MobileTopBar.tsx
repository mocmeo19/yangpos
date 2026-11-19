import Link from 'next/link';
import type { ReactNode } from 'react';
import { BrandMark } from '@/components/ui/BrandMark';

export function MobileTopBar({ userMenu }: { userMenu: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-canvas/90 px-4 backdrop-blur-md sm:px-6 lg:hidden">
      <Link href="/" className="flex items-center gap-2.5">
        <BrandMark size="sm" />
        <span className="text-base font-bold tracking-tight">YangPOS</span>
      </Link>
      {userMenu}
    </header>
  );
}
