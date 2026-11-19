import { FileText, Receipt } from 'lucide-react';
import type { ChoiceCardOption } from '@/types/choice-card';
import type { EInvoiceTemplate } from '@/types/einvoice';

export const EINVOICE_TEMPLATE_OPTIONS: readonly ChoiceCardOption<EInvoiceTemplate>[] =
  [
    {
      value: '1',
      label: 'Hóa đơn GTGT',
      description:
        'Doanh nghiệp, hộ kinh doanh kê khai thuế GTGT theo phương pháp khấu trừ.',
      icon: FileText,
    },
    {
      value: '2',
      label: 'Hóa đơn bán hàng',
      description:
        'Hộ, cá nhân kinh doanh và doanh nghiệp tính thuế GTGT theo phương pháp trực tiếp.',
      icon: Receipt,
    },
  ];
