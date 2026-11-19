'use client';

import { SearchInput } from '@/components/ui/SearchInput';
import { useNow } from '@/hooks/use-now';
import { formatTime, formatWeekdayDate } from '@/lib/format-time';
import { CustomerDisplayButton } from './CustomerDisplayButton';

const CLOCK_REFRESH_MS = 30_000;

interface PosHeaderProps {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onSearchSubmit: (keyword: string) => void;
}

export function PosHeader({
  keyword,
  onKeywordChange,
  onSearchSubmit,
}: PosHeaderProps) {
  const now = useNow(CLOCK_REFRESH_MS);

  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        <p className="text-sm font-medium text-ink-soft first-letter:uppercase">
          {formatWeekdayDate(now)} · {formatTime(now)}
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Bán hàng
        </h1>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <SearchInput
          label="Tìm món hoặc quét mã vạch"
          placeholder="Tìm món, vd: pho, ca phe…"
          value={keyword}
          onChange={onKeywordChange}
          onSubmit={onSearchSubmit}
          shortcutKey="/"
          className="min-w-0 flex-1 sm:w-80 sm:flex-none"
        />
        <CustomerDisplayButton />
      </div>
    </div>
  );
}
