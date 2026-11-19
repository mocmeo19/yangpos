import type { StoreSettings } from '@/types/settings';

export function prepareStoreSettings(store: StoreSettings): StoreSettings {
  const prepared: StoreSettings = {
    ...store,
    name: store.name.trim(),
    address: store.address.trim(),
    phone: store.phone.trim(),
    taxCode: store.taxCode.trim(),
    wifiName: store.wifiName.trim(),
    receiptFooter: store.receiptFooter.trim(),
  };
  if (!prepared.name) {
    throw new Error('Nhập tên cửa hàng để in trên đầu hóa đơn.');
  }
  return prepared;
}
