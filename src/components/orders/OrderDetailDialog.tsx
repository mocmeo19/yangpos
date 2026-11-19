'use client';

import { Printer, ReceiptText } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { EInvoiceStatusBadge } from '@/components/einvoice/EInvoiceStatusBadge';
import { IssueEInvoiceDialog } from '@/components/einvoice/IssueEInvoiceDialog';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useOrderEInvoice } from '@/hooks/use-order-einvoice';
import { usePrintOrderReceipt } from '@/hooks/use-print-order-receipt';
import { useSettings } from '@/hooks/use-settings';
import { cn } from '@/lib/cn';
import { formatEInvoiceNumber } from '@/lib/einvoice/format-einvoice-number';
import { formatCurrency } from '@/lib/format-currency';
import { formatOrderNumber } from '@/lib/format-order-number';
import { formatDateTime } from '@/lib/format-time';
import { calculateItemsTotal } from '@/lib/order-totals';
import { buildPaymentInfo } from '@/lib/receipt/build-payment-info';
import type { EInvoice } from '@/types/einvoice';
import type { Order } from '@/types/order';
import type { ReceiptPaymentInfo } from '@/types/receipt';
import { OrderStatusBadge } from './OrderStatusBadge';

interface DetailRowProps {
  label: string;
  children: ReactNode;
  isMono?: boolean;
}

function DetailRow({ label, children, isMono = false }: DetailRowProps) {
  return (
    <>
      <dt className="text-ink-soft">{label}</dt>
      <dd
        className={cn(
          'justify-self-end text-right',
          isMono ? 'font-mono' : 'font-semibold',
        )}
      >
        {children}
      </dd>
    </>
  );
}

function PaymentDetailRows({ payment }: { payment: ReceiptPaymentInfo }) {
  return (
    <>
      <DetailRow label="Hình thức">{payment.methodLabel}</DetailRow>
      {payment.cashReceived !== null && (
        <DetailRow label="Khách đưa" isMono>
          {formatCurrency(payment.cashReceived)}
        </DetailRow>
      )}
      {payment.change !== null && (
        <DetailRow label="Tiền thừa" isMono>
          {formatCurrency(payment.change)}
        </DetailRow>
      )}
      {payment.cardSummary && (
        <DetailRow label="Thẻ">{payment.cardSummary}</DetailRow>
      )}
      {payment.approvalCode && (
        <DetailRow label="Mã chuẩn chi" isMono>
          {payment.approvalCode}
        </DetailRow>
      )}
      {payment.transferNote && (
        <DetailRow label="Nội dung CK" isMono>
          {payment.transferNote}
        </DetailRow>
      )}
    </>
  );
}

function EInvoiceDetailRows({ invoice }: { invoice: EInvoice }) {
  return (
    <>
      <DetailRow label="Hóa đơn điện tử" isMono>
        {invoice.template}
        {invoice.series} · {formatEInvoiceNumber(invoice.number)}
      </DetailRow>
      {invoice.taxAuthorityCode && (
        <DetailRow label="Mã của CQT" isMono>
          <span className="text-xs break-all">{invoice.taxAuthorityCode}</span>
        </DetailRow>
      )}
      {invoice.lookupCode && (
        <DetailRow label="Mã tra cứu" isMono>
          {invoice.lookupCode}
        </DetailRow>
      )}
      <DetailRow label="Gửi cơ quan thuế">
        <EInvoiceStatusBadge status={invoice.transmission.status} />
      </DetailRow>
    </>
  );
}

interface OrderDetailDialogProps {
  order: Order;
  tableName: string;
  onClose: () => void;
}

export function OrderDetailDialog({
  order,
  tableName,
  onClose,
}: OrderDetailDialogProps) {
  const { settings } = useSettings();
  const printOrderReceipt = usePrintOrderReceipt();
  const eInvoice = useOrderEInvoice(order.id);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isIssuingEInvoice, setIsIssuingEInvoice] = useState(false);
  const payment = buildPaymentInfo(order);
  const canPrint = order.status === 'paid';
  const canIssueEInvoice =
    settings.eInvoice.enabled && canPrint && eInvoice === null;

  async function handlePrint() {
    setIsPrinting(true);
    try {
      await printOrderReceipt(order, 'final');
    } finally {
      setIsPrinting(false);
    }
  }

  return (
    <>
      <Modal
        title={`Đơn ${formatOrderNumber(order.number)}`}
        description={tableName}
        onClose={onClose}
        footer={
          <>
            {canPrint && (
              <Button
                variant="secondary"
                disabled={isPrinting}
                onClick={handlePrint}
              >
                <Printer className="size-4" />
                {isPrinting ? 'Đang in…' : 'In lại hóa đơn'}
              </Button>
            )}
            <Button variant="secondary" onClick={onClose}>
              Đóng
            </Button>
          </>
        }
      >
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface-muted p-4">
          <dl className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-sm">
            <DetailRow label="Trạng thái">
              <OrderStatusBadge status={order.status} />
            </DetailRow>
            <DetailRow label="Tạo lúc" isMono>
              {formatDateTime(order.createdAt)}
            </DetailRow>
            {order.paidAt && (
              <DetailRow label="Thanh toán lúc" isMono>
                {formatDateTime(order.paidAt)}
              </DetailRow>
            )}
            {payment && <PaymentDetailRows payment={payment} />}
            {eInvoice && <EInvoiceDetailRows invoice={eInvoice} />}
            {canIssueEInvoice && (
              <DetailRow label="Hóa đơn điện tử">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsIssuingEInvoice(true)}
                >
                  <ReceiptText className="size-4" />
                  Lập ngay
                </Button>
              </DetailRow>
            )}
          </dl>

          <div className="my-4 border-t border-dashed border-line-strong" />

          <ul className="space-y-2.5">
            {order.items.map((item) => (
              <li
                key={`${item.menuItemId}-${item.note}`}
                className="flex gap-3 text-sm"
              >
                <span className="w-7 shrink-0 font-mono font-semibold text-brand">
                  {item.quantity}×
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-medium">{item.name}</span>
                  {item.note && (
                    <span className="block text-xs text-brand-dark italic">
                      “{item.note}”
                    </span>
                  )}
                  <span className="block font-mono text-xs text-ink-soft">
                    {formatCurrency(item.unitPrice)}
                  </span>
                </span>
                <span className="font-mono font-semibold tabular-nums">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="my-4 border-t border-dashed border-line-strong" />

          <p className="flex items-baseline justify-between">
            <span className="font-semibold">Tổng cộng</span>
            <span className="font-mono text-xl font-semibold tabular-nums">
              {formatCurrency(calculateItemsTotal(order.items))}
            </span>
          </p>
        </div>
      </Modal>
      {isIssuingEInvoice && (
        <IssueEInvoiceDialog
          order={order}
          tableName={tableName}
          onClose={() => setIsIssuingEInvoice(false)}
        />
      )}
    </>
  );
}
