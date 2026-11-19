import { Keyboard, SlidersHorizontal } from 'lucide-react';
import type { ChoiceCardOption } from '@/types/choice-card';
import type { PagerModelId } from '@/types/pager';
import type { PagerModel } from '@/types/pager-model';

/** Thông số theo hướng dẫn sử dụng của từng hãng; thêm dòng máy mới bằng một mục mới. */
export const PAGER_MODELS: Record<PagerModelId, PagerModel> = {
  'retekess-td157': {
    id: 'retekess-td157',
    label: 'Retekess TD157',
    shortLabel: 'TD157',
    description:
      'Đế phát có bàn phím và khe sạc, gọi bằng cách bấm số thẻ rồi CALL. Không có cổng nối máy tính.',
    icon: Keyboard,
    supportsSerial: false,
    maxPagerNumber: 998,
    // 999 + CALL là lệnh tắt mọi thẻ; đế đời đầu còn coi 99 là lệnh tắt.
    reservedNumbers: [99],
  },
  other: {
    id: 'other',
    label: 'Bộ thẻ rung khác',
    shortLabel: 'Bộ khác',
    description:
      'Bấm số trên đế phát, hoặc gửi lệnh qua USB/COM nếu đế có cổng kết nối máy tính.',
    icon: SlidersHorizontal,
    supportsSerial: true,
    maxPagerNumber: 999,
    reservedNumbers: [],
  },
};

export const PAGER_MODEL_OPTIONS: readonly ChoiceCardOption<PagerModelId>[] =
  Object.values(PAGER_MODELS).map(({ id, label, description, icon }) => ({
    value: id,
    label,
    description,
    icon,
  }));
