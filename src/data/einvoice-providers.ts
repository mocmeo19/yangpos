import { FlaskConical, PlugZap } from 'lucide-react';
import type { ChoiceCardOption } from '@/types/choice-card';
import type { EInvoiceProviderId } from '@/types/einvoice-provider';

export const EINVOICE_PROVIDER_OPTIONS: readonly ChoiceCardOption<EInvoiceProviderId>[] =
  [
    {
      value: 'sandbox',
      label: 'Thử nghiệm',
      description:
        'Lập, đánh số và in ngay trên máy; không gửi đi đâu, chưa có giá trị pháp lý.',
      icon: FlaskConical,
    },
    {
      value: 'misa',
      label: 'MISA meInvoice',
      description:
        'Phát hành qua API tích hợp của MISA; số, mã hóa đơn do MISA cấp. Cần Internet lúc thanh toán.',
      icon: PlugZap,
    },
  ];
