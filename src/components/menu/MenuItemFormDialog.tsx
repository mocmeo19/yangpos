'use client';

import { ScanBarcode } from 'lucide-react';
import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Switch } from '@/components/ui/Switch';
import { EMOJI_SUGGESTIONS } from '@/data/emoji-suggestions';
import { DEFAULT_MENU_UNIT, MENU_UNIT_SUGGESTIONS } from '@/data/menu-units';
import {
  VAT_RATE_CODES,
  VAT_RATE_LABELS,
  VAT_RATE_SHORT_LABELS,
} from '@/data/vat-rates';
import { useSettings } from '@/hooks/use-settings';
import { formatAmountInput, parseAmountInput } from '@/lib/amount-input';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format-currency';
import { getErrorMessage } from '@/lib/get-error-message';
import type { VatRateCode } from '@/types/einvoice';
import type { Category, MenuItem, MenuItemInput } from '@/types/menu';
import { MenuItemImage } from './MenuItemImage';

const FORM_ID = 'menu-item-form';
const DEFAULT_EMOJI = '🍽️';
const UNIT_SUGGESTIONS_ID = 'menu-unit-suggestions';

/** Chuỗi rỗng nghĩa là dùng thuế suất mặc định trong cài đặt hóa đơn. */
type VatRateChoice = VatRateCode | '';

function toVatRateChoice(value: string): VatRateChoice {
  return VAT_RATE_CODES.find((code) => code === value) ?? '';
}

// Máy quét gửi Enter sau mỗi mã; chặn để form không lưu ngay khi vừa quét xong.
function preventScannerSubmit(event: KeyboardEvent<HTMLInputElement>) {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
}

interface MenuItemFormDialogProps {
  menuItem?: MenuItem;
  categories: readonly Category[];
  defaultCategoryId: string;
  onClose: () => void;
  onSubmit: (input: MenuItemInput) => Promise<void>;
}

export function MenuItemFormDialog({
  menuItem,
  categories,
  defaultCategoryId,
  onClose,
  onSubmit,
}: MenuItemFormDialogProps) {
  const { settings } = useSettings();
  const [name, setName] = useState(menuItem?.name ?? '');
  const [price, setPrice] = useState(menuItem?.price ?? 0);
  const [categoryId, setCategoryId] = useState(
    menuItem?.categoryId ?? defaultCategoryId,
  );
  const [emoji, setEmoji] = useState(menuItem?.emoji ?? DEFAULT_EMOJI);
  const [barcode, setBarcode] = useState(menuItem?.barcode ?? '');
  const [unit, setUnit] = useState(menuItem?.unit ?? '');
  const [vatRate, setVatRate] = useState<VatRateChoice>(
    menuItem?.vatRate ?? '',
  );
  const [isAvailable, setIsAvailable] = useState(menuItem?.isAvailable ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultVatLabel = `Mặc định (${VAT_RATE_SHORT_LABELS[settings.eInvoice.defaultVatRate]})`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name,
        price,
        categoryId,
        emoji,
        isAvailable,
        barcode,
        unit,
        vatRate: vatRate || undefined,
      });
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      title={menuItem ? 'Sửa món' : 'Thêm món'}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {menuItem ? 'Lưu thay đổi' : 'Thêm vào thực đơn'}
          </Button>
        </>
      }
    >
      <form
        id={FORM_ID}
        onSubmit={handleSubmit}
        className="grid gap-5 sm:grid-cols-[180px_minmax(0,1fr)]"
      >
        <div className="hidden flex-col gap-2 sm:flex">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
            <MenuItemImage
              menuItem={{ name, emoji }}
              className="aspect-[4/3] w-full text-5xl"
              sizes="180px"
            />
            <div className="flex flex-col gap-1 p-3">
              <p className="line-clamp-2 text-sm leading-5 font-semibold">
                {name.trim() || 'Tên món'}
              </p>
              <p className="font-mono text-sm font-semibold text-brand">
                {formatCurrency(price)}
              </p>
            </div>
          </div>
          <p className="text-xs text-ink-soft">
            Xem trước thẻ món trên màn hình bán hàng.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Field label="Tên món" htmlFor="menu-item-name">
            <input
              id="menu-item-name"
              data-autofocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Phở bò tái"
              className={INPUT_CLASS_NAME}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Giá bán (₫)" htmlFor="menu-item-price">
              <input
                id="menu-item-price"
                inputMode="numeric"
                value={formatAmountInput(price)}
                onChange={(event) =>
                  setPrice(parseAmountInput(event.target.value))
                }
                placeholder="0"
                className={cn(INPUT_CLASS_NAME, 'text-right font-mono')}
              />
            </Field>
            <Field label="Danh mục" htmlFor="menu-item-category">
              <select
                id="menu-item-category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className={INPUT_CLASS_NAME}
              >
                <option value="" disabled>
                  Chọn danh mục
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Đơn vị tính"
              htmlFor="menu-item-unit"
              hint="In trên hóa đơn điện tử, vd Tô, Ly, Phần."
            >
              <input
                id="menu-item-unit"
                list={UNIT_SUGGESTIONS_ID}
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                placeholder={DEFAULT_MENU_UNIT}
                maxLength={20}
                className={INPUT_CLASS_NAME}
              />
              <datalist id={UNIT_SUGGESTIONS_ID}>
                {MENU_UNIT_SUGGESTIONS.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </Field>
            <Field
              label="Thuế suất GTGT"
              htmlFor="menu-item-vat-rate"
              hint="Bia, rượu chịu 10%, không được giảm thuế."
            >
              <select
                id="menu-item-vat-rate"
                value={vatRate}
                onChange={(event) =>
                  setVatRate(toVatRateChoice(event.target.value))
                }
                className={INPUT_CLASS_NAME}
              >
                <option value="">{defaultVatLabel}</option>
                {VAT_RATE_CODES.map((code) => (
                  <option key={code} value={code}>
                    {VAT_RATE_LABELS[code]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Mã vạch / SKU"
            htmlFor="menu-item-barcode"
            hint="Quét bằng máy quét hoặc nhập tay. Bỏ trống nếu món không có mã."
          >
            <div className="relative">
              <ScanBarcode
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-faint"
              />
              <input
                id="menu-item-barcode"
                value={barcode}
                onChange={(event) => setBarcode(event.target.value)}
                onKeyDown={preventScannerSubmit}
                placeholder="VD: 8934563138165"
                autoComplete="off"
                spellCheck={false}
                className={cn(INPUT_CLASS_NAME, 'pl-10 font-mono')}
              />
            </div>
          </Field>

          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold">Biểu tượng</legend>
            <div className="flex flex-wrap items-center gap-1.5">
              {EMOJI_SUGGESTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={emoji === option}
                  aria-label={`Chọn biểu tượng ${option}`}
                  onClick={() => setEmoji(option)}
                  className={cn(
                    'grid size-11 place-items-center rounded-xl border text-xl transition-colors',
                    emoji === option
                      ? 'border-brand bg-brand-soft'
                      : 'border-line bg-surface hover:border-line-strong',
                  )}
                >
                  {option}
                </button>
              ))}
              <div className="w-16">
                <input
                  value={emoji}
                  onChange={(event) => setEmoji(event.target.value)}
                  maxLength={4}
                  aria-label="Biểu tượng khác"
                  className={cn(INPUT_CLASS_NAME, 'text-center text-xl')}
                />
              </div>
            </div>
            <p className="mt-1.5 text-xs text-ink-soft">
              Hiển thị khi món chưa có ảnh.
            </p>
          </fieldset>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface-muted px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Đang bán</p>
              <p className="text-xs text-ink-soft">
                Tắt khi món tạm hết để thu ngân không chọn nhầm.
              </p>
            </div>
            <Switch
              checked={isAvailable}
              label="Đang bán"
              onChange={setIsAvailable}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-danger-soft px-3 py-2.5 text-sm text-danger"
            >
              {error}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
