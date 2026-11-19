'use client';

import { Armchair, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import {
  SegmentedControl,
  type SegmentedOption,
} from '@/components/ui/SegmentedControl';
import type { DiningTable } from '@/types/dining-table';
import type { Order, ServiceMode } from '@/types/order';
import { TablePickerDialog } from './TablePickerDialog';
import { TableSelectButton } from './TableSelectButton';

const SERVICE_MODE_OPTIONS: readonly SegmentedOption<ServiceMode>[] = [
  { value: 'dineIn', label: 'Tại bàn', icon: Armchair },
  { value: 'takeaway', label: 'Mang đi', icon: ShoppingBag },
];

interface TableSelectorProps {
  serviceMode: ServiceMode;
  onServiceModeChange: (serviceMode: ServiceMode) => void;
  tables: readonly DiningTable[];
  activeOrderByTable: ReadonlyMap<string, Order>;
  selectedTable: DiningTable | undefined;
  onTableSelect: (tableId: string) => void;
}

export function TableSelector({
  serviceMode,
  onServiceModeChange,
  tables,
  activeOrderByTable,
  selectedTable,
  onTableSelect,
}: TableSelectorProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  function handleServiceModeChange(nextMode: ServiceMode) {
    onServiceModeChange(nextMode);
    // Chuyển sang "Tại bàn" khi chưa có bàn thì mở luôn danh sách bàn để bớt một lần chạm.
    if (nextMode === 'dineIn' && !selectedTable) {
      setIsPickerOpen(true);
    }
  }

  function handleTableSelect(tableId: string) {
    onTableSelect(tableId);
    setIsPickerOpen(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <SegmentedControl
        label="Hình thức phục vụ"
        options={SERVICE_MODE_OPTIONS}
        value={serviceMode}
        onChange={handleServiceModeChange}
      />
      {serviceMode === 'dineIn' && (
        <TableSelectButton
          table={selectedTable}
          activeOrder={
            selectedTable ? activeOrderByTable.get(selectedTable.id) : undefined
          }
          onClick={() => setIsPickerOpen(true)}
        />
      )}
      {isPickerOpen && (
        <TablePickerDialog
          tables={tables}
          activeOrderByTable={activeOrderByTable}
          selectedTableId={selectedTable?.id ?? null}
          onSelect={handleTableSelect}
          onClose={() => setIsPickerOpen(false)}
        />
      )}
    </div>
  );
}
