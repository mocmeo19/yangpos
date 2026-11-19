'use client';

import { CircleCheck, PlugZap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useMisaConnectionCheck } from '@/hooks/use-misa-connection-check';
import type { EInvoiceTemplate } from '@/types/einvoice';
import type { MisaEnvironment } from '@/types/misa';
import { MisaSeriesPicker } from './MisaSeriesPicker';
import { SettingsNote } from './SettingsNote';

const ENVIRONMENT_LABELS: Record<MisaEnvironment, string> = {
  test: 'Môi trường thử nghiệm · testapi.meinvoice.vn',
  production: 'Môi trường chính thức · api.meinvoice.vn',
};

interface MisaConnectionPanelProps {
  /** Mẫu số ghép ký hiệu đang chỉnh, vd "1C26MAA". */
  currentSymbol: string;
  sellerTaxCode: string;
  year: number;
  onSelectSeries: (template: EInvoiceTemplate, seriesSuffix: string) => void;
}

/** Ký hiệu MISA ("1C26MAA") gồm mẫu số ở đầu và 2 chữ cái người bán tự đặt ở cuối. */
function splitSymbol(symbol: string): [EInvoiceTemplate, string] {
  const template: EInvoiceTemplate = symbol.startsWith('2') ? '2' : '1';
  return [template, symbol.slice(-2)];
}

export function MisaConnectionPanel({
  currentSymbol,
  sellerTaxCode,
  year,
  onSelectSeries,
}: MisaConnectionPanelProps) {
  const { result, isChecking, check } = useMisaConnectionCheck();

  function handleSelect(symbol: string) {
    const [template, seriesSuffix] = splitSymbol(symbol);
    onSelectSeries(template, seriesSuffix);
  }

  return (
    <section
      aria-labelledby="misa-connection-title"
      className="flex flex-col gap-3 rounded-xl border border-line p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-56 flex-1">
          <h3 id="misa-connection-title" className="text-sm font-semibold">
            Kết nối MISA meInvoice
          </h3>
          <p className="mt-0.5 text-xs text-ink-soft">
            AppID, mã số thuế, tên đăng nhập và mật khẩu MISA nằm trong tệp
            .env.local của máy chủ, không lưu trên trình duyệt.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={isChecking}
          onClick={() => check(year)}
        >
          <PlugZap className="size-4" />
          {isChecking ? 'Đang kiểm tra…' : 'Kiểm tra kết nối'}
        </Button>
      </div>

      {result && !result.ok && (
        <p
          role="alert"
          className="rounded-xl bg-danger-soft px-3 py-2.5 text-sm break-words text-danger"
        >
          {result.error}
        </p>
      )}

      {result?.ok && (
        <>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-success">
              <CircleCheck aria-hidden="true" className="size-4" />
              Đã kết nối · MST {result.taxCode}
            </p>
            <p className="mt-0.5 text-xs text-ink-soft">
              {ENVIRONMENT_LABELS[result.environment]}
            </p>
          </div>
          {result.environment === 'test' && (
            <SettingsNote tone="warning">
              Hóa đơn phát hành ở môi trường thử nghiệm không gửi cơ quan thuế.
              Khi dùng thật, đặt{' '}
              <code className="font-mono text-xs break-all">
                MISA_MEINVOICE_ENVIRONMENT=production
              </code>{' '}
              cùng tài khoản chính thức rồi khởi động lại máy chủ.
            </SettingsNote>
          )}
          {sellerTaxCode && sellerTaxCode !== result.taxCode && (
            <SettingsNote tone="warning">
              Mã số thuế người bán ({sellerTaxCode}) khác mã số thuế đăng nhập
              MISA ({result.taxCode}).
            </SettingsNote>
          )}
          <MisaSeriesPicker
            series={result.series}
            year={year}
            currentSymbol={currentSymbol}
            onSelect={handleSelect}
          />
        </>
      )}
    </section>
  );
}
