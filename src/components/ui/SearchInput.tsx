'use client';

import { Search } from 'lucide-react';
import { useRef } from 'react';
import { useFocusShortcut } from '@/hooks/use-focus-shortcut';
import { cn } from '@/lib/cn';
import { INPUT_CLASS_NAME } from './Field';

interface SearchInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  /** Phím tắt để focus nhanh vào ô tìm kiếm, vd "/". */
  shortcutKey?: string;
  /** Gọi khi nhấn Enter, vd để thêm món khi máy quét gõ mã vào ô tìm kiếm. */
  onSubmit?: (value: string) => void;
  className?: string;
}

export function SearchInput({
  label,
  placeholder,
  value,
  onChange,
  shortcutKey,
  onSubmit,
  className,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useFocusShortcut(inputRef, shortcutKey);

  return (
    <label className={cn('relative block', className)}>
      <span className="sr-only">{label}</span>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-faint"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
            onSubmit?.(value);
          }
        }}
        placeholder={placeholder}
        className={cn(INPUT_CLASS_NAME, 'pl-10')}
      />
      {shortcutKey && !value && (
        <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-line bg-surface-muted px-1.5 py-0.5 font-mono text-[11px] leading-none text-ink-faint sm:block">
          {shortcutKey}
        </kbd>
      )}
    </label>
  );
}
