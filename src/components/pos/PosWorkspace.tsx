'use client';

import { Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PaymentDialog } from '@/components/orders/PaymentDialog';
import { Button } from '@/components/ui/Button';
import {
  FilterChips,
  type FilterChipOption,
} from '@/components/ui/FilterChips';
import { Modal } from '@/components/ui/Modal';
import { useAddScannedMenuItem } from '@/hooks/use-add-scanned-menu-item';
import { useBarcodeScanner } from '@/hooks/use-barcode-scanner';
import { useCompletePayment } from '@/hooks/use-complete-payment';
import { useConfirm } from '@/hooks/use-confirm';
import { useOrderDraft } from '@/hooks/use-order-draft';
import { useSettings } from '@/hooks/use-settings';
import { useStaffSession } from '@/hooks/use-staff-session';
import {
  TAKEAWAY_LABEL,
  useTableNameResolver,
} from '@/hooks/use-table-name-resolver';
import { useToast } from '@/hooks/use-toast';
import { ALL_CATEGORIES, filterMenuItems } from '@/lib/filter-menu-items';
import { findMenuItemByBarcode } from '@/lib/find-menu-item-by-barcode';
import { formatOrderNumber } from '@/lib/format-order-number';
import { getErrorMessage } from '@/lib/get-error-message';
import { groupActiveOrdersByTable } from '@/lib/group-active-orders-by-table';
import { groupPagersInUse } from '@/lib/pager/group-pagers-in-use';
import { listPagerNumbers } from '@/lib/pager/list-pager-numbers';
import { toOrderItems } from '@/lib/to-order-items';
import { placeOrder } from '@/api-client/order-api';
import type { CheckoutInput } from '@/types/checkout';
import type { DiningTable } from '@/types/dining-table';
import type { Category, MenuItem } from '@/types/menu';
import type { Order, ServiceMode } from '@/types/order';
import { ActiveOrderNotice } from './ActiveOrderNotice';
import { MenuGrid } from './MenuGrid';
import { MobileTicketBar } from './MobileTicketBar';
import { OrderTicket, type OrderTicketContent } from './OrderTicket';
import { PagerSelector } from './PagerSelector';
import { PosHeader } from './PosHeader';
import { TableSelector } from './TableSelector';

interface PosWorkspaceProps {
  categories: readonly Category[];
  menuItems: readonly MenuItem[];
  tables: readonly DiningTable[];
  activeOrders: readonly Order[];
}

function describeDestination(
  serviceMode: ServiceMode,
  table: DiningTable | undefined,
  pagerNumber: number | null,
): string {
  if (serviceMode === 'dineIn') {
    return table ? table.name : 'Chưa chọn bàn';
  }
  if (pagerNumber === null) {
    return TAKEAWAY_LABEL;
  }
  return `${TAKEAWAY_LABEL} · Thẻ ${pagerNumber}`;
}

export function PosWorkspace({
  categories,
  menuItems,
  tables,
  activeOrders,
}: PosWorkspaceProps) {
  const {
    lines,
    dispatch,
    serviceMode,
    setServiceMode,
    selectedTableId,
    selectTable,
    pagerNumber,
    setPagerNumber,
    resetDraft,
  } = useOrderDraft();
  const { settings } = useSettings();
  const showToast = useToast();
  const confirm = useConfirm();
  const completePayment = useCompletePayment();
  const resolveTableName = useTableNameResolver();
  const { can } = useStaffSession();
  const [categoryId, setCategoryId] = useState(ALL_CATEGORIES);
  const [keyword, setKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);

  function addToTicket(menuItem: MenuItem) {
    dispatch({ type: 'add', menuItem });
  }

  const addScannedMenuItem = useAddScannedMenuItem(menuItems, addToTicket);
  // Màn POS vẫn render phía sau màn hình khóa: tắt máy quét để không nuốt phím khi nhập PIN.
  useBarcodeScanner(
    {
      ...settings.scanner,
      enabled: settings.scanner.enabled && can('pos.sell'),
    },
    addScannedMenuItem,
  );

  const categoryOptions = useMemo<FilterChipOption<string>[]>(
    () => [
      { value: ALL_CATEGORIES, label: 'Tất cả', count: menuItems.length },
      ...categories.map((category) => ({
        value: category.id,
        label: category.name,
        count: menuItems.filter((item) => item.categoryId === category.id)
          .length,
      })),
    ],
    [categories, menuItems],
  );

  const visibleMenuItems = useMemo(
    () => filterMenuItems(menuItems, { categoryId, keyword }),
    [menuItems, categoryId, keyword],
  );

  const activeOrderByTable = useMemo(
    () => groupActiveOrdersByTable(activeOrders),
    [activeOrders],
  );

  const pagersInUse = useMemo(
    () => groupPagersInUse(activeOrders),
    [activeOrders],
  );

  const isDineIn = serviceMode === 'dineIn';
  // Thẻ rung dùng cho khách mang đi, tự phục vụ; khách tại bàn được mang món tận bàn.
  const usesPager = settings.pager.enabled && !isDineIn;
  const draftPagerNumber = usesPager ? pagerNumber : null;
  const selectedTable = tables.find((table) => table.id === selectedTableId);
  const targetTableId = isDineIn && selectedTable ? selectedTable.id : null;
  const activeOrderForTable = targetTableId
    ? activeOrderByTable.get(targetTableId)
    : undefined;
  const destinationLabel = describeDestination(
    serviceMode,
    selectedTable,
    draftPagerNumber,
  );
  const blockedReason =
    isDineIn && !selectedTable
      ? 'Chọn bàn trước khi gửi bếp hoặc thanh toán.'
      : null;

  // Khi ô tìm kiếm đang được chọn, máy quét gõ mã vào ô đó; Enter cuối mã sẽ thêm món luôn.
  function handleSearchSubmit(value: string) {
    if (findMenuItemByBarcode(menuItems, value)) {
      addScannedMenuItem(value.trim());
      setKeyword('');
    }
  }

  async function submitOrder(): Promise<Order | null> {
    setIsSubmitting(true);
    try {
      const order = await placeOrder({
        tableId: targetTableId,
        items: toOrderItems(lines),
        pagerNumber: draftPagerNumber,
      });
      resetDraft();
      setIsSheetOpen(false);
      return order;
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'Chưa gửi được đơn',
        description: getErrorMessage(error),
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSendToKitchen() {
    const order = await submitOrder();
    if (order) {
      showToast({
        title: `Đã gửi bếp đơn ${formatOrderNumber(order.number)}`,
        description: resolveTableName(order.tableId),
        action: { label: 'Xem đơn', href: '/orders' },
      });
    }
  }

  async function handleCheckout() {
    const order = await submitOrder();
    if (order) {
      setPayingOrder(order);
    }
  }

  async function handlePay(checkout: CheckoutInput) {
    if (!payingOrder) {
      return;
    }
    await completePayment(payingOrder, checkout);
    setPayingOrder(null);
  }

  function handleClosePayment() {
    if (payingOrder) {
      showToast({
        tone: 'info',
        title: `Đơn ${formatOrderNumber(payingOrder.number)} chưa thanh toán`,
        description: 'Đơn đã gửi bếp, có thể thanh toán sau ở mục Đơn hàng.',
        action: { label: 'Xem đơn', href: '/orders' },
      });
    }
    setPayingOrder(null);
  }

  async function handleClearLines() {
    const isConfirmed = await confirm({
      title: 'Bỏ tất cả món trong phiếu?',
      description: 'Các món đang chọn sẽ bị xóa khỏi phiếu gọi món.',
      confirmLabel: 'Bỏ hết món',
      tone: 'danger',
    });
    if (isConfirmed) {
      dispatch({ type: 'clear' });
    }
  }

  const ticketContent: OrderTicketContent = {
    title: activeOrderForTable ? 'Gọi thêm món' : 'Đơn mới',
    subtitle: activeOrderForTable
      ? `${destinationLabel} · đơn ${formatOrderNumber(activeOrderForTable.number)}`
      : destinationLabel,
    tableSelector: (
      <TableSelector
        serviceMode={serviceMode}
        onServiceModeChange={setServiceMode}
        tables={tables}
        activeOrderByTable={activeOrderByTable}
        selectedTable={selectedTable}
        onTableSelect={selectTable}
      />
    ),
    pagerSelector: usesPager && (
      <PagerSelector
        pagerNumbers={listPagerNumbers(settings.pager)}
        pagersInUse={pagersInUse}
        value={pagerNumber}
        onChange={setPagerNumber}
      />
    ),
    notice: activeOrderForTable ? (
      <ActiveOrderNotice order={activeOrderForTable} />
    ) : null,
    lines,
    dispatch,
    blockedReason,
    isSubmitting,
    onSendToKitchen: handleSendToKitchen,
    onCheckout: can('orders.pay') ? handleCheckout : null,
  };

  const clearButton = (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Bỏ tất cả món"
      title="Bỏ tất cả món"
      disabled={lines.length === 0}
      onClick={handleClearLines}
    >
      <Trash2 className="size-4" />
    </Button>
  );

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <section aria-label="Thực đơn" className="flex min-w-0 flex-col gap-4">
          <PosHeader
            keyword={keyword}
            onKeywordChange={setKeyword}
            onSearchSubmit={handleSearchSubmit}
          />
          <div className="sticky top-14 z-20 -mx-4 bg-canvas/90 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-0 lg:mx-0 lg:px-0">
            <FilterChips
              label="Danh mục món"
              options={categoryOptions}
              value={categoryId}
              onChange={setCategoryId}
            />
          </div>
          <MenuGrid
            menuItems={visibleMenuItems}
            cartLines={lines}
            onAdd={addToTicket}
            onChangeQuantity={(menuItemId, delta) =>
              dispatch({ type: 'changeQuantity', menuItemId, delta })
            }
            onClearFilters={() => {
              setKeyword('');
              setCategoryId(ALL_CATEGORIES);
            }}
          />
        </section>

        <div className="hidden lg:block">
          <div className="sticky top-6">
            <OrderTicket
              variant="panel"
              headerActions={clearButton}
              {...ticketContent}
            />
          </div>
        </div>
      </div>

      <MobileTicketBar
        lines={lines}
        destinationLabel={destinationLabel}
        onOpen={() => setIsSheetOpen(true)}
      />

      {isSheetOpen && (
        <Modal
          title="Phiếu gọi món"
          onClose={() => setIsSheetOpen(false)}
          hideHeader
          padded={false}
        >
          <OrderTicket
            variant="sheet"
            headerActions={
              <>
                {clearButton}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Đóng phiếu"
                  onClick={() => setIsSheetOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </>
            }
            {...ticketContent}
          />
        </Modal>
      )}

      {payingOrder && (
        <PaymentDialog
          order={payingOrder}
          tableName={resolveTableName(payingOrder.tableId)}
          onClose={handleClosePayment}
          onConfirm={handlePay}
        />
      )}
    </>
  );
}
