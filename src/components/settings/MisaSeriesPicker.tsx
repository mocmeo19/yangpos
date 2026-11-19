import { cn } from '@/lib/cn';
import type { MisaSeries } from '@/types/misa';

interface MisaSeriesPickerProps {
  series: readonly MisaSeries[];
  year: number;
  /** Mẫu số ghép ký hiệu đang chỉnh, vd "1C26MAA". */
  currentSymbol: string;
  onSelect: (symbol: string) => void;
}

const MULTIPLE_RATES_LABEL = 'nhiều thuế suất';

/** Tên mẫu trên MISA có khi đã ghi "nhiều thuế suất"; chỉ thêm nhãn khi tên chưa nói rõ. */
function describeSeries({ name, allowsMultipleVatRates }: MisaSeries): string {
  const isNamed = name
    .toLocaleLowerCase('vi-VN')
    .includes(MULTIPLE_RATES_LABEL);
  if (!allowsMultipleVatRates || isNamed) {
    return name;
  }
  return `${name} · ${MULTIPLE_RATES_LABEL}`;
}

/** Ký hiệu hóa đơn máy tính tiền đã đăng ký trên MISA; chọn một ký hiệu để dùng cho máy này. */
export function MisaSeriesPicker({
  series,
  year,
  currentSymbol,
  onSelect,
}: MisaSeriesPickerProps) {
  const hasSeries = series.length > 0;
  const isCurrentListed = series.some((item) => item.symbol === currentSymbol);

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">
        Ký hiệu máy tính tiền năm {year} trên MISA
      </legend>
      <div className="flex flex-col gap-2">
        {!hasSeries && (
          <p className="text-sm text-warning">
            Chưa có ký hiệu hóa đơn khởi tạo từ máy tính tiền nào cho năm {year}
            . Đăng ký ký hiệu trên meinvoice.vn rồi kiểm tra lại.
          </p>
        )}
        {hasSeries && (
          <div className="flex flex-wrap gap-2">
            {series.map((item) => {
              const isSelected = item.symbol === currentSymbol;
              return (
                <button
                  key={item.symbol}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelect(item.symbol)}
                  className={cn(
                    'flex max-w-full flex-col items-start rounded-xl border px-3 py-2 text-left transition-colors focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none',
                    isSelected
                      ? 'border-brand bg-brand-soft/60'
                      : 'border-line bg-surface hover:border-line-strong',
                  )}
                >
                  <span className="font-mono text-sm font-semibold">
                    {item.symbol}
                  </span>
                  <span className="text-xs text-ink-soft">
                    {describeSeries(item)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {hasSeries && !isCurrentListed && (
          <p className="text-xs font-medium text-warning">
            Ký hiệu đang dùng {currentSymbol} chưa có trên MISA, chọn một ký
            hiệu ở trên.
          </p>
        )}
        <p className="text-xs text-ink-soft">
          Bán cả món 8% và bia 10% trên cùng hóa đơn thì chọn mẫu nhiều thuế
          suất.
        </p>
      </div>
    </fieldset>
  );
}
