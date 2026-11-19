import { Fragment } from 'react';
import { formatCurrency } from '@/lib/format-currency';
import { formatPagerLabel } from '@/lib/pager/format-pager-label';
import { formatReceiptQuantity } from '@/lib/receipt/format-receipt-quantity';
import { getReceiptTotalLabel } from '@/lib/receipt/get-receipt-total-label';
import type { Receipt } from '@/types/receipt';
import { QrCode } from './QrCode';
import { ReceiptDivider } from './ReceiptDivider';
import { ReceiptEInvoiceFooter } from './ReceiptEInvoiceFooter';
import { ReceiptEInvoiceHeading } from './ReceiptEInvoiceHeading';
import { ReceiptOrderHeading } from './ReceiptOrderHeading';

const QR_SIZE_PX = 140;

/** Hóa đơn dạng HTML dùng để xem trước và in qua hộp thoại in của trình duyệt. */
export function ReceiptView({ receipt }: { receipt: Receipt }) {
  const { store, payment, transferQr, eInvoice } = receipt;
  // Hóa đơn điện tử đã ghi tên, MST, địa chỉ người bán theo đăng ký thuế nên không in lặp lại.
  const showsStoreContacts = !eInvoice;

  return (
    <div className="bg-white font-sans text-[12px] leading-snug text-black">
      <header className="text-center">
        <p className="text-[16px] font-bold uppercase">
          {store.name || 'Tên cửa hàng'}
        </p>
        {showsStoreContacts && store.address && <p>{store.address}</p>}
        {showsStoreContacts && store.phone && <p>ĐT: {store.phone}</p>}
        {showsStoreContacts && store.taxCode && <p>MST: {store.taxCode}</p>}
      </header>

      <ReceiptDivider />
      {eInvoice ? (
        <ReceiptEInvoiceHeading receipt={receipt} eInvoice={eInvoice} />
      ) : (
        <ReceiptOrderHeading receipt={receipt} />
      )}
      {receipt.pagerNumber !== null && (
        <p className="mt-2 rounded-sm border-2 border-black py-1 text-center text-[15px] font-bold uppercase">
          {formatPagerLabel(receipt.pagerNumber)}
        </p>
      )}

      <ReceiptDivider />
      <ul className="space-y-1.5">
        {receipt.lines.map((line, index) => (
          <li key={`${line.name}-${index}`}>
            <p className="font-semibold">{line.name}</p>
            {line.note && <p className="italic">“{line.note}”</p>}
            <p className="flex justify-between gap-3">
              <span>{formatReceiptQuantity(line)}</span>
              <span>{formatCurrency(line.amount)}</span>
            </p>
          </li>
        ))}
      </ul>

      <ReceiptDivider />
      {eInvoice && eInvoice.summaryRows.length > 0 && (
        <dl className="mb-1 grid grid-cols-[auto_1fr] gap-x-3">
          {eInvoice.summaryRows.map((row) => (
            <Fragment key={row.label}>
              <dt>{row.label}</dt>
              <dd className="text-right">{row.value}</dd>
            </Fragment>
          ))}
        </dl>
      )}
      <p className="flex justify-between gap-3 text-[14px] font-bold">
        <span>{getReceiptTotalLabel(receipt)}</span>
        <span>{formatCurrency(receipt.total)}</span>
      </p>
      {eInvoice && <p className="italic">Bằng chữ: {eInvoice.totalInWords}.</p>}

      {payment && (
        <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3">
          <dt>Hình thức</dt>
          <dd className="text-right">{payment.methodLabel}</dd>
          {payment.cashReceived !== null && (
            <>
              <dt>Khách đưa</dt>
              <dd className="text-right">
                {formatCurrency(payment.cashReceived)}
              </dd>
            </>
          )}
          {payment.change !== null && (
            <>
              <dt>Tiền thừa</dt>
              <dd className="text-right">{formatCurrency(payment.change)}</dd>
            </>
          )}
          {payment.cardSummary && (
            <>
              <dt>Thẻ</dt>
              <dd className="text-right">{payment.cardSummary}</dd>
            </>
          )}
          {payment.approvalCode && (
            <>
              <dt>Mã chuẩn chi</dt>
              <dd className="text-right">{payment.approvalCode}</dd>
            </>
          )}
          {payment.transferNote && (
            <>
              <dt>Nội dung CK</dt>
              <dd className="text-right">{payment.transferNote}</dd>
            </>
          )}
        </dl>
      )}

      {transferQr && (
        <>
          <ReceiptDivider />
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="font-semibold">Quét mã để chuyển khoản</p>
            <QrCode
              payload={transferQr.payload}
              size={QR_SIZE_PX}
              label="Mã VietQR chuyển khoản"
            />
            <p>
              {transferQr.bankName} · {transferQr.accountNumber}
            </p>
            {transferQr.accountName && <p>{transferQr.accountName}</p>}
            <p>Nội dung: {transferQr.note}</p>
          </div>
        </>
      )}

      {eInvoice && (
        <>
          <ReceiptDivider />
          <ReceiptEInvoiceFooter eInvoice={eInvoice} />
        </>
      )}

      {store.wifiName && (
        <p className="mt-2 text-center">
          Wi-Fi: {store.wifiName}
          {store.wifiPassword && ` · Mật khẩu: ${store.wifiPassword}`}
        </p>
      )}

      {store.receiptFooter && (
        <>
          <ReceiptDivider />
          <p className="text-center italic">{store.receiptFooter}</p>
        </>
      )}
    </div>
  );
}
