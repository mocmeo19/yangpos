import { Ban, MonitorSmartphone, Network } from 'lucide-react';
import type { ChoiceCardOption } from '@/types/choice-card';
import type { PrinterMode } from '@/types/settings';

export const PRINTER_MODE_OPTIONS: readonly ChoiceCardOption<PrinterMode>[] = [
  {
    value: 'browser',
    label: 'Qua trình duyệt',
    description:
      'Máy in USB, Bluetooth hoặc AirPrint đã cài trên máy. Mỗi lần in hiện hộp thoại in.',
    icon: MonitorSmartphone,
  },
  {
    value: 'network',
    label: 'Máy in mạng LAN',
    description:
      'Gửi thẳng tới máy in nhiệt qua mạng nội bộ, in ngay không cần hộp thoại.',
    icon: Network,
  },
  {
    value: 'none',
    label: 'Không in',
    description: 'Tắt in hóa đơn và phiếu tạm tính.',
    icon: Ban,
  },
];

export const PRINTER_MODE_LABELS: Record<PrinterMode, string> = {
  browser: 'Qua trình duyệt',
  network: 'Máy in mạng LAN',
  none: 'Không in',
};
