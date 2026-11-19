import { ReceiptView } from '@/components/receipt/ReceiptView';
import type { Receipt } from '@/types/receipt';

export function ReceiptPreview({ receipt }: { receipt: Receipt }) {
  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="text-xs font-semibold text-ink-soft">
        Xem trước phiếu in
      </figcaption>
      <div className="rounded-xl bg-ink/5 p-3">
        {/* Phần chữ rộng 272px, bằng vùng in 72mm của khổ giấy 80mm, để xuống dòng giống bản in. */}
        <div className="mx-auto w-full max-w-[296px] rounded-sm bg-white px-3 py-5 shadow-raised">
          <ReceiptView receipt={receipt} />
        </div>
      </div>
    </figure>
  );
}
