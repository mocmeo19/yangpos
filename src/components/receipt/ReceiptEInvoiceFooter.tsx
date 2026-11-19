import { EINVOICE_SANDBOX_NOTICE } from '@/data/einvoice-labels';
import type { ReceiptEInvoice } from '@/types/receipt';

/** Mã của cơ quan thuế và mã tra cứu để người mua tra cứu hóa đơn trên trang của nhà cung cấp. */
export function ReceiptEInvoiceFooter({
  eInvoice,
}: {
  eInvoice: ReceiptEInvoice;
}) {
  return (
    <div className="text-center">
      {eInvoice.taxAuthorityCode && (
        <>
          <p>Mã của cơ quan thuế:</p>
          <p className="font-bold break-all">{eInvoice.taxAuthorityCode}</p>
        </>
      )}
      {eInvoice.lookupCode && (
        <p className="mt-1">
          Mã tra cứu: <span className="font-bold">{eInvoice.lookupCode}</span>
        </p>
      )}
      <p className="mt-1">Tra cứu hóa đơn tại: {eInvoice.lookupSite}</p>
      {eInvoice.isSandbox && (
        <p className="mt-1.5 border border-black px-1 py-0.5 font-bold">
          {EINVOICE_SANDBOX_NOTICE}
        </p>
      )}
    </div>
  );
}
