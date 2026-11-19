'use client';

import { Printer, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useEInvoiceIssuer } from '@/hooks/use-einvoice-issuer';
import { usePrintOrderReceipt } from '@/hooks/use-print-order-receipt';
import { useSettings } from '@/hooks/use-settings';
import { useToast } from '@/hooks/use-toast';
import { formatEInvoiceNumber } from '@/lib/einvoice/format-einvoice-number';
import { getEInvoiceProvider } from '@/lib/einvoice/providers/get-einvoice-provider';
import { formatOrderNumber } from '@/lib/format-order-number';
import { findOrder } from '@/api-client/order-api';
import type { EInvoice } from '@/types/einvoice';
import type { EInvoiceNumbering } from '@/types/einvoice-provider';
import { EInvoiceDocument } from './EInvoiceDocument';

interface ResendLabels {
  idle: string;
  busy: string;
}

const RESEND_LABELS: Record<EInvoiceNumbering, ResendLabels> = {
  local: { idle: 'Gửi lại', busy: 'Đang gửi…' },
  provider: { idle: 'Phát hành lại', busy: 'Đang phát hành…' },
};

interface EInvoiceDetailDialogProps {
  invoice: EInvoice;
  onClose: () => void;
}

/** Hóa đơn chờ gửi (vd mất mạng giữa chừng) hoặc gửi lỗi thì được gửi lại; đã gửi thì thôi. */
function canResend(invoice: EInvoice): boolean {
  const { status } = invoice.transmission;
  return status === 'pending' || status === 'failed';
}

export function EInvoiceDetailDialog({
  invoice,
  onClose,
}: EInvoiceDetailDialogProps) {
  const { settings } = useSettings();
  const { transmit } = useEInvoiceIssuer();
  const printOrderReceipt = usePrintOrderReceipt();
  const showToast = useToast();
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const provider = getEInvoiceProvider(invoice.providerId);
  const resendLabels = RESEND_LABELS[provider.numbering];
  const isResendable = canResend(invoice);
  const hasNumber = invoice.number !== null;
  const title = hasNumber
    ? `Hóa đơn số ${formatEInvoiceNumber(invoice.number)}`
    : 'Hóa đơn chờ phát hành';

  async function handlePrint() {
    setIsPrinting(true);
    try {
      const order = await findOrder(invoice.orderId);
      if (!order) {
        showToast({
          tone: 'error',
          title: 'Không tìm thấy đơn của hóa đơn này',
        });
        return;
      }
      await printOrderReceipt(order, 'final', { eInvoice: invoice });
    } finally {
      setIsPrinting(false);
    }
  }

  async function handleResend() {
    setIsSending(true);
    try {
      await transmit(invoice);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Modal
      title={title}
      description={`Ký hiệu ${invoice.template}${invoice.series} · Đơn ${formatOrderNumber(invoice.orderNumber)}`}
      size="lg"
      onClose={onClose}
      footer={
        <>
          {isResendable && (
            <Button
              variant="secondary"
              disabled={isSending}
              onClick={handleResend}
            >
              <Send className="size-4" />
              {isSending ? resendLabels.busy : resendLabels.idle}
            </Button>
          )}
          <Button
            variant="secondary"
            disabled={
              isPrinting || !hasNumber || settings.printer.mode === 'none'
            }
            onClick={handlePrint}
          >
            <Printer className="size-4" />
            {isPrinting ? 'Đang in…' : 'In hóa đơn'}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </>
      }
    >
      {isResendable && provider.numbering === 'provider' && (
        <p className="mb-4 rounded-xl bg-surface-muted px-3.5 py-2.5 text-xs text-ink-soft">
          Phát hành lại không tạo hóa đơn trùng: {provider.label} nhận ra hóa
          đơn này nếu lần gửi trước đã phát hành xong và trả lại đúng số đã cấp.
        </p>
      )}
      <EInvoiceDocument
        invoice={invoice}
        lookupUrl={settings.eInvoice.lookupUrl}
      />
    </Modal>
  );
}
