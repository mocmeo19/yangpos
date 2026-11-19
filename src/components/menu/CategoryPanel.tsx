'use client';

import { Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { ALL_CATEGORIES } from '@/lib/filter-menu-items';
import type { Category } from '@/types/menu';
import { CategoryRow } from './CategoryRow';

interface CategoryPanelProps {
  categories: readonly Category[];
  itemCounts: ReadonlyMap<string, number>;
  totalItemCount: number;
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
  onAdd: (name: string) => Promise<boolean>;
  onRename: (category: Category, name: string) => Promise<boolean>;
  onDelete: (category: Category) => void;
}

export function CategoryPanel({
  categories,
  itemCounts,
  totalItemCount,
  selectedCategoryId,
  onSelect,
  onAdd,
  onRename,
  onDelete,
}: CategoryPanelProps) {
  const [newName, setNewName] = useState('');
  const isAllSelected = selectedCategoryId === ALL_CATEGORIES;

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isAdded = await onAdd(newName);
    if (isAdded) {
      setNewName('');
    }
  }

  return (
    <aside
      aria-label="Danh mục món"
      className="flex flex-col gap-1 self-start rounded-2xl border border-line bg-surface p-2 shadow-card lg:sticky lg:top-6"
    >
      <h2 className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-ink-soft uppercase">
        Danh mục
      </h2>
      <ul className="flex flex-col gap-0.5">
        <li className="flex items-center gap-1">
          <button
            type="button"
            aria-pressed={isAllSelected}
            onClick={() => onSelect(ALL_CATEGORIES)}
            className={cn(
              'flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
              isAllSelected
                ? 'bg-brand-soft font-semibold text-brand-dark'
                : 'text-ink hover:bg-surface-muted',
            )}
          >
            Tất cả món
            <span className="text-xs text-ink-faint tabular-nums">
              {totalItemCount}
            </span>
          </button>
          <span aria-hidden="true" className="size-9 shrink-0" />
        </li>
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            itemCount={itemCounts.get(category.id) ?? 0}
            isSelected={selectedCategoryId === category.id}
            onSelect={onSelect}
            onRename={onRename}
            onDelete={onDelete}
          />
        ))}
      </ul>
      <form
        onSubmit={handleAdd}
        className="mt-1 flex gap-2 border-t border-line px-1 pt-3 pb-1"
      >
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="Thêm danh mục…"
          aria-label="Tên danh mục mới"
          className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-surface-muted px-3 text-sm transition outline-none placeholder:text-ink-faint focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/15"
        />
        <Button
          type="submit"
          variant="dark"
          size="icon"
          aria-label="Thêm danh mục"
          disabled={!newName.trim()}
        >
          <Plus className="size-5" />
        </Button>
      </form>
    </aside>
  );
}
