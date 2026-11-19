import Image from 'next/image';
import { cn } from '@/lib/cn';

type BrandMarkSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<BrandMarkSize, string> = {
  sm: 'size-8',
  md: 'size-11',
  lg: 'size-14',
};

export function BrandMark({ size = 'md' }: { size?: BrandMarkSize }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex shrink-0', SIZE_CLASSES[size])}
    >
      <Image
        src="/brand/yangpos-mark.svg"
        alt=""
        width={64}
        height={64}
        className="size-full"
        unoptimized
      />
    </span>
  );
}
