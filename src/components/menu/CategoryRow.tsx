'use client';

import { Check, Pencil, Trash2, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/cn';
import type { Category } from '@/types/menu';

interface CategoryRowProps {
  category: Category;
  itemCount: number;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
  onRename: (category: Category, name: string) => Promise<boolean>;
  onDelete: (category: Category) => void;
}

const ICON_BUTTON_CLASS =
  'grid size-9 shrink-0 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink';

export function CategoryRow({
  category,
  itemCount,
  isSelected,
  onSelect,
  onRename,
  onDelete,
}: CategoryRowProps) {
  const [draftName, setDraftName] = useState<string | null>(null);

  async function handleRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draftName === null) {
      return;
    }
    const isRenamed = await onRename(category, draftName);
    if (isRenamed) {
      setDraftName(null);
    }
  }

  if (draftName !== null) {
    return (
      <li>
        <form onSubmit={handleRename} className="flex items-center gap-1 p-1">
          <input
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            aria-label="Tên danh mục"
            autoFocus
            className="h-9 min-w-0 flex-1 rounded-lg border border-brand bg-surface px-2.5 text-sm ring-2 ring-brand/15 outline-none"
          />
          <button
            type="submit"
            aria-label="Lưu tên danh mục"
            className={ICON_BUTTON_CLASS}
          >
            <Check className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Hủy đổi tên"
            onClick={() => setDraftName(null)}
            className={ICON_BUTTON_CLASS}
          >
            <X className="size-4" />
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-1">
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => onSelect(category.id)}
        className={cn(
          'flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
          isSelected
            ? 'bg-brand-soft font-semibold text-brand-dark'
            : 'text-ink hover:bg-surface-muted',
        )}
      >
        <span className="truncate">{category.name}</span>
        <span className="text-xs text-ink-faint tabular-nums">{itemCount}</span>
      </button>
      <DropdownMenu
        label={`Thao tác danh mục ${category.name}`}
        items={[
          {
            label: 'Đổi tên',
            icon: Pencil,
            onSelect: () => setDraftName(category.name),
          },
          {
            label: 'Xóa danh mục',
            icon: Trash2,
            tone: 'danger',
            onSelect: () => onDelete(category),
          },
        ]}
      />
    </li>
  );
}
