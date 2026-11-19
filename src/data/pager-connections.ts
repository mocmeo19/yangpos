import { Hand, Usb } from 'lucide-react';
import type { ChoiceCardOption } from '@/types/choice-card';
import type { PagerConnection } from '@/types/pager';

export const PAGER_CONNECTION_OPTIONS: readonly ChoiceCardOption<PagerConnection>[] =
  [
    {
      value: 'manual',
      label: 'Bấm trên đế phát',
      description:
        'Ứng dụng nhắc số thẻ cần gọi, nhân viên bấm số rồi CALL trên đế. Dùng được với mọi bộ thẻ rung.',
      icon: Hand,
    },
    {
      value: 'serial',
      label: 'Kết nối USB/COM',
      description:
        'Ứng dụng tự gửi lệnh gọi thẻ tới đế phát có cổng USB hoặc RS232. Cần Chrome/Edge trên máy tính.',
      icon: Usb,
    },
  ];
