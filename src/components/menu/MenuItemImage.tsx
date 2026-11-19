'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MENU_IMAGES } from '@/data/menu-images';
import { normalizeSearchText } from '@/lib/normalize-search-text';
import { cn } from '@/lib/cn';
import type { MenuItem } from '@/types/menu';

interface MenuItemImageProps {
  menuItem: Pick<MenuItem, 'name' | 'emoji'>;
  className?: string;
  sizes: string;
  loading?: 'eager' | 'lazy';
}

export function MenuItemImage({
  menuItem,
  className,
  sizes,
  loading,
}: MenuItemImageProps) {
  const src = MENU_IMAGES[normalizeSearchText(menuItem.name)];
  const [failedSrc, setFailedSrc] = useState<string>();

  return (
    <span
      className={cn(
        'relative grid shrink-0 place-items-center overflow-hidden bg-surface-muted select-none',
        className,
      )}
      aria-hidden="true"
    >
      {src && failedSrc !== src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          loading={loading}
          className="object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        menuItem.emoji
      )}
    </span>
  );
}
