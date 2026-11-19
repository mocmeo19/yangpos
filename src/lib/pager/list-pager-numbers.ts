import { PAGER_MODELS } from '@/data/pager-models';
import type { PagerSettings } from '@/types/pager';

/** Các số thẻ chọn được: từ 1 tới số thẻ trong bộ, bỏ những số đế phát dùng làm lệnh điều khiển. */
export function listPagerNumbers({
  pagerCount,
  model,
}: Pick<PagerSettings, 'pagerCount' | 'model'>): number[] {
  const { maxPagerNumber, reservedNumbers } = PAGER_MODELS[model];
  const count = Math.min(pagerCount, maxPagerNumber);
  return Array.from({ length: count }, (_, index) => index + 1).filter(
    (pagerNumber) => !reservedNumbers.includes(pagerNumber),
  );
}
