import { PAGER_MODELS } from '@/data/pager-models';
import type { PagerSettings } from '@/types/pager';

/** Đế phát không nhận lệnh từ máy tính thì chỉ gọi được bằng cách bấm số trên đế. */
export function applyPagerModel(pager: PagerSettings): PagerSettings {
  if (PAGER_MODELS[pager.model].supportsSerial) {
    return pager;
  }
  return { ...pager, connection: 'manual' };
}
