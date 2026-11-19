'use client';

import { Plus, UtensilsCrossed } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  FilterChips,
  type FilterChipOption,
} from '@/components/ui/FilterChips';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { useCategories } from '@/hooks/use-categories';
import { useConfirm } from '@/hooks/use-confirm';
import { useMenuItems } from '@/hooks/use-menu-items';
import { useToast } from '@/hooks/use-toast';
import { ALL_CATEGORIES, filterMenuItems } from '@/lib/filter-menu-items';
import { getErrorMessage } from '@/lib/get-error-message';
import {
  addCategory,
  deleteCategory,
  renameCategory,
} from '@/api-client/category-api';
import {
  addMenuItem,
  deleteMenuItem,
  setMenuItemAvailability,
  updateMenuItem,
} from '@/api-client/menu-item-api';
import type { Category, MenuItem, MenuItemInput } from '@/types/menu';
import { CategoryPanel } from './CategoryPanel';
import { MenuItemFormDialog } from './MenuItemFormDialog';
import { MenuItemRow } from './MenuItemRow';

type MenuItemFormState =
  { mode: 'create' } | { mode: 'edit'; menuItem: MenuItem };

type AvailabilityFilter = 'all' | 'available' | 'soldOut';

function matchesAvailability(
  menuItem: MenuItem,
  filter: AvailabilityFilter,
): boolean {
  switch (filter) {
    case 'available':
      return menuItem.isAvailable;
    case 'soldOut':
      return !menuItem.isAvailable;
    default:
      return true;
  }
}

export function MenuManager() {
  const categories = useCategories();
  const menuItems = useMenuItems();
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_CATEGORIES);
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [keyword, setKeyword] = useState('');
  const [formState, setFormState] = useState<MenuItemFormState | null>(null);
  const showToast = useToast();
  const confirm = useConfirm();

  const itemCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of menuItems ?? []) {
      counts.set(item.categoryId, (counts.get(item.categoryId) ?? 0) + 1);
    }
    return counts;
  }, [menuItems]);

  const categoryNames = useMemo(
    () => new Map(categories?.map((category) => [category.id, category.name])),
    [categories],
  );

  if (!categories || !menuItems) {
    return <LoadingState />;
  }

  const matchingItems = filterMenuItems(menuItems, {
    categoryId: selectedCategoryId,
    keyword,
  });
  const visibleItems = matchingItems.filter((item) =>
    matchesAvailability(item, availability),
  );
  const soldOutCount = matchingItems.filter((item) => !item.isAvailable).length;
  const availabilityOptions: FilterChipOption<AvailabilityFilter>[] = [
    { value: 'all', label: 'Tất cả', count: matchingItems.length },
    {
      value: 'available',
      label: 'Đang bán',
      count: matchingItems.length - soldOutCount,
      dotClassName: 'bg-success',
    },
    {
      value: 'soldOut',
      label: 'Hết món',
      count: soldOutCount,
      dotClassName: 'bg-ink-faint',
    },
  ];
  const defaultCategoryId =
    selectedCategoryId === ALL_CATEGORIES
      ? (categories[0]?.id ?? '')
      : selectedCategoryId;
  const canAddItems = categories.length > 0;

  async function runAction(
    action: () => Promise<unknown>,
    successTitle: string,
  ): Promise<boolean> {
    try {
      await action();
      showToast({ title: successTitle });
      return true;
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'Thao tác chưa thành công',
        description: getErrorMessage(error),
      });
      return false;
    }
  }

  async function handleSubmitItem(input: MenuItemInput) {
    if (formState?.mode === 'edit') {
      await updateMenuItem(formState.menuItem.id, input);
    } else {
      await addMenuItem(input);
    }
    showToast({ title: `Đã lưu món ${input.name.trim()}` });
    setFormState(null);
  }

  function handleToggleAvailability(menuItem: MenuItem) {
    const successTitle = menuItem.isAvailable
      ? `${menuItem.name} đã chuyển sang hết món`
      : `${menuItem.name} đã bán trở lại`;
    void runAction(
      () => setMenuItemAvailability(menuItem.id, !menuItem.isAvailable),
      successTitle,
    );
  }

  async function handleDeleteItem(menuItem: MenuItem) {
    const isConfirmed = await confirm({
      title: `Xóa món "${menuItem.name}"?`,
      description:
        'Món sẽ bị gỡ khỏi thực đơn. Các đơn cũ vẫn giữ nguyên tên và giá.',
      confirmLabel: 'Xóa món',
      tone: 'danger',
    });
    if (isConfirmed) {
      await runAction(
        () => deleteMenuItem(menuItem.id),
        `Đã xóa món ${menuItem.name}`,
      );
    }
  }

  async function handleDeleteCategory(category: Category) {
    const isConfirmed = await confirm({
      title: `Xóa danh mục "${category.name}"?`,
      confirmLabel: 'Xóa danh mục',
      tone: 'danger',
    });
    if (!isConfirmed) {
      return;
    }
    const isDeleted = await runAction(
      () => deleteCategory(category.id),
      `Đã xóa danh mục ${category.name}`,
    );
    if (isDeleted && selectedCategoryId === category.id) {
      setSelectedCategoryId(ALL_CATEGORIES);
    }
  }

  const openCreateForm = () => setFormState({ mode: 'create' });

  return (
    <>
      <PageHeader
        title="Thực đơn"
        description={`${menuItems.length} món · ${categories.length} danh mục`}
        actions={
          <Button disabled={!canAddItems} onClick={openCreateForm}>
            <Plus className="size-4" />
            Thêm món
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <CategoryPanel
          categories={categories}
          itemCounts={itemCounts}
          totalItemCount={menuItems.length}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
          onAdd={(name) =>
            runAction(
              () => addCategory(name),
              `Đã thêm danh mục ${name.trim()}`,
            )
          }
          onRename={(category, name) =>
            runAction(
              () => renameCategory(category.id, name),
              'Đã đổi tên danh mục',
            )
          }
          onDelete={handleDeleteCategory}
        />

        <section
          aria-label="Danh sách món"
          className="flex min-w-0 flex-col gap-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              label="Tìm món trong thực đơn"
              placeholder="Tìm món…"
              value={keyword}
              onChange={setKeyword}
              shortcutKey="/"
              className="w-full sm:max-w-xs"
            />
            <FilterChips
              label="Lọc theo trạng thái bán"
              options={availabilityOptions}
              value={availability}
              onChange={setAvailability}
            />
          </div>

          {visibleItems.length === 0 ? (
            <EmptyState
              icon={UtensilsCrossed}
              title="Không có món nào phù hợp"
              description="Thử từ khóa hoặc bộ lọc khác, hoặc thêm món mới."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!canAddItems}
                  onClick={openCreateForm}
                >
                  <Plus className="size-4" />
                  Thêm món
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
              {visibleItems.map((menuItem) => (
                <MenuItemRow
                  key={menuItem.id}
                  menuItem={menuItem}
                  categoryName={
                    categoryNames.get(menuItem.categoryId) ?? 'Chưa phân loại'
                  }
                  onToggleAvailability={handleToggleAvailability}
                  onEdit={(target) =>
                    setFormState({ mode: 'edit', menuItem: target })
                  }
                  onDelete={handleDeleteItem}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      {formState && (
        <MenuItemFormDialog
          menuItem={formState.mode === 'edit' ? formState.menuItem : undefined}
          categories={categories}
          defaultCategoryId={defaultCategoryId}
          onClose={() => setFormState(null)}
          onSubmit={handleSubmitItem}
        />
      )}
    </>
  );
}
