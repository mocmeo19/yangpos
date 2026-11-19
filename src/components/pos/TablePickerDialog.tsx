import { LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { buttonClassName } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import type { DiningTable } from '@/types/dining-table';
import type { Order } from '@/types/order';
import { TableTile } from './TableTile';

interface TablePickerDialogProps {
  tables: readonly DiningTable[];
  activeOrderByTable: ReadonlyMap<string, Order>;
  selectedTableId: string | null;
  onSelect: (tableId: string) => void;
  onClose: () => void;
}

export function TablePickerDialog({
  tables,
  activeOrderByTable,
  selectedTableId,
  onSelect,
  onClose,
}: TablePickerDialogProps) {
  const occupiedCount = tables.filter((table) =>
    activeOrderByTable.has(table.id),
  ).length;
  const freeCount = tables.length - occupiedCount;

  return (
    <Modal
      title="Chọn bàn"
      description={`${freeCount} bàn trống · ${occupiedCount} bàn có khách`}
      size="lg"
      onClose={onClose}
    >
      {tables.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="Chưa có bàn nào"
          description="Thêm bàn để nhận đơn tại chỗ."
          action={
            <Link
              href="/tables"
              className={buttonClassName({ variant: 'secondary', size: 'sm' })}
            >
              Quản lý bàn
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {tables.map((table) => (
            <TableTile
              key={table.id}
              table={table}
              activeOrder={activeOrderByTable.get(table.id)}
              isSelected={table.id === selectedTableId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </Modal>
  );
}
