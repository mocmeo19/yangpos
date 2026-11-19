'use client';

import { NotebookPen } from 'lucide-react';
import { useState, type Dispatch } from 'react';
import { MenuItemImage } from '@/components/menu/MenuItemImage';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { formatCurrency } from '@/lib/format-currency';
import type { CartAction, CartLine } from '@/types/cart';
import { LineNoteEditor } from './LineNoteEditor';

interface CartLineRowProps {
  line: CartLine;
  dispatch: Dispatch<CartAction>;
}

export function CartLineRow({ line, dispatch }: CartLineRowProps) {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const { menuItemId, name } = line;

  return (
    <li className="flex gap-3 py-3.5 motion-safe:animate-fade-in">
      <MenuItemImage
        menuItem={line}
        className="size-12 rounded-xl text-xl"
        sizes="48px"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm leading-5 font-semibold">{name}</p>
          <p className="font-mono text-sm font-semibold whitespace-nowrap tabular-nums">
            {formatCurrency(line.unitPrice * line.quantity)}
          </p>
        </div>
        <p className="text-xs text-ink-soft">
          {formatCurrency(line.unitPrice)}
        </p>
        {line.note && !isEditingNote && (
          <p className="mt-1 text-xs text-brand-dark italic">“{line.note}”</p>
        )}
        <div className="mt-2 flex items-center justify-between gap-2">
          <QuantityStepper
            quantity={line.quantity}
            itemName={name}
            onDecrease={() =>
              dispatch({ type: 'changeQuantity', menuItemId, delta: -1 })
            }
            onIncrease={() =>
              dispatch({ type: 'changeQuantity', menuItemId, delta: 1 })
            }
          />
          <button
            type="button"
            aria-expanded={isEditingNote}
            onClick={() => setIsEditingNote((isOpen) => !isOpen)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <NotebookPen className="size-3.5" />
            {line.note ? 'Sửa ghi chú' : 'Ghi chú'}
          </button>
        </div>
        {isEditingNote && (
          <LineNoteEditor
            itemName={name}
            note={line.note}
            onChange={(note) => dispatch({ type: 'setNote', menuItemId, note })}
            onDone={() => setIsEditingNote(false)}
          />
        )}
      </div>
    </li>
  );
}
