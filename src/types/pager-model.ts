import type { LucideIcon } from 'lucide-react';
import type { PagerModelId } from './pager';

export interface PagerModel {
  id: PagerModelId;
  label: string;
  /** Tên ngắn trên nhãn trạng thái, vd "TD157". */
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  /** Đế phát nhận lệnh từ máy tính; không có cổng này thì chỉ gọi được bằng bàn phím trên đế. */
  supportsSerial: boolean;
  /** Số lớn nhất ghép được cho một thẻ trên đế phát. */
  maxPagerNumber: number;
  /** Số đế phát dùng làm lệnh điều khiển; gán cho thẻ sẽ khiến bấm gọi thành lệnh tắt cả bộ. */
  reservedNumbers: readonly number[];
}
