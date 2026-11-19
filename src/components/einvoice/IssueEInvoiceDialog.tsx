'use client';

import { useState } from 'react';
import { InvoiceBuyerDialog } from '@/components/payment/InvoiceBuyerDialog';
import { InvoiceBuyerSummary } from '@/components/payment/InvoiceBuyerSummary';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useEInvoiceIssuer } from '@/hooks/use-einvoice-issuer';
import { useToast } from '@/hooks/use-toast';
import { formatEInvoiceNumber } from '@/lib/einvoice/format-einvoice-number';
import { formatCurrency } from '@/lib/format-currency';
import { formatOrderNumber } from '@/lib/format-order-number';
import { getErrorMessage } from '@/lib/get-error-message';
import { calculateItemsTotal } from '@/lib/order-totals';
import type { InvoiceBuyer } from '@/types/einvoice';
import type { Order } from '@/types/order';

interface IssueEInvoiceDialogProps {
  order: Order;
  tableName: string;
  onClose: () => void;
}

/** Lập hóa đơn cho đơn đã thu tiền nhưng chưa có hóa đơn, vd khi tắt tự động lập lúc thanh toán. */
export function IssueEInvoiceDialog({
  order,
  tableName,
  onClose,
}: IssueEInvoiceDialogProps) {
  const { issueForOrder } = useEInvoiceIssuer();
  const showToast = useToast();
  const [buyer, setBuyer] = useState<InvoiceBuyer | null>(null);
  const [isEditingBuyer, setIsEditingBuyer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const orderLabel = formatOrderNumber(order.number);

  async function handleIssue() {
    setIsSubmitting(true);
    setError(null);
    try {
      const invoice = await issueForOrder(order, buyer);
      // Chưa có số nghĩa là phát hành lỗi; thông báo lỗi đã hiện từ bước phát hành.
      if (invoice.number !== null) {
        showToast({
          title: `Đã lập hóa đơn số ${formatEInvoiceNumber(invoice.number)}`,
          description: `Đơn ${orderLabel} · ${formatCurrency(invoice.totalAmount)}`,
        });
      }
      onClose();
    } catch (issueError) {
      setError(getErrorMessage(issueError));
      setIsSubmitting(false);
    }
  }

  function handleBuyerSubmit(nextBuyer: InvoiceBuyer) {
    setBuyer(nextBuyer);
    setIsEditingBuyer(false);
  }

  return (
    <>
      <Modal
        title="Lập hóa đơn điện tử"
        description={`${orderLabel} · ${tableName} · ${formatCurrency(calculateItemsTotal(order.items))}`}
        onClose={onClose}
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button disabled={isSubmitting} onClick={handleIssue}>
              {isSubmitting ? 'Đang lập…' : 'Lập hóa đơn'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <InvoiceBuyerSummary
            buyer={buyer}
            autoIssue
            onEdit={() => setIsEditingBuyer(true)}
            onClear={() => setBuyer(null)}
          />
          <p className="text-xs text-ink-soft">
            Ngày lập là lúc bấm “Lập hóa đơn”; số hóa đơn được cấp tiếp theo số
            gần nhất của ký hiệu đang dùng.
          </p>
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-danger-soft px-3 py-2.5 text-sm text-danger"
            >
              {error}
            </p>
          )}
        </div>
      </Modal>
      {isEditingBuyer && (
        <InvoiceBuyerDialog
          initialBuyer={buyer}
          onClose={() => setIsEditingBuyer(false)}
          onSubmit={handleBuyerSubmit}
        />
      )}
    </>
  );
}
