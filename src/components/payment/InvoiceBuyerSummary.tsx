import { ReceiptText, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { InvoiceBuyer } from '@/types/einvoice';

interface InvoiceBuyerSummaryProps {
  buyer: InvoiceBuyer | null;
  /** Đang bật tự lập hóa đơn cho mọi đơn, kể cả khi khách không yêu cầu. */
  autoIssue: boolean;
  onEdit: () => void;
  onClear: () => void;
}

function describeBuyer(buyer: InvoiceBuyer): string {
  const identity = buyer.kind === 'company' ? `MST ${buyer.taxCode}` : '';
  return [buyer.name, identity].filter(Boolean).join(' · ');
}

function describeWithoutBuyer(autoIssue: boolean): string {
  return autoIssue
    ? 'Lập cho khách lẻ, không ghi người mua'
    : 'Chỉ lập khi khách yêu cầu';
}

export function InvoiceBuyerSummary({
  buyer,
  autoIssue,
  onEdit,
  onClear,
}: InvoiceBuyerSummaryProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-muted py-2 pr-2 pl-3.5">
      <ReceiptText
        aria-hidden="true"
        className="size-5 shrink-0 text-ink-soft"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Hóa đơn điện tử</p>
        <p className="truncate text-xs text-ink-soft">
          {buyer ? describeBuyer(buyer) : describeWithoutBuyer(autoIssue)}
        </p>
      </div>
      <Button variant="secondary" size="sm" onClick={onEdit}>
        {buyer ? 'Sửa' : 'Nhập người mua'}
      </Button>
      {buyer && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClear}
          aria-label="Bỏ thông tin người mua"
          title="Bỏ thông tin người mua"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
