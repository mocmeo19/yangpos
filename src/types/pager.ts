/** "manual": nhân viên bấm số trên đế bộ phát; "serial": ứng dụng gửi lệnh qua cổng USB/COM. */
export type PagerConnection = 'manual' | 'serial';

/** Dòng máy của bộ thẻ rung; mỗi dòng có giới hạn số thẻ và cách gọi riêng. */
export type PagerModelId = 'retekess-td157' | 'other';

export interface PagerSettings {
  enabled: boolean;
  model: PagerModelId;
  /** Số thẻ trong bộ, đánh số từ 1. */
  pagerCount: number;
  connection: PagerConnection;
  baudRate: number;
  /**
   * Lệnh gọi thẻ theo tài liệu của hãng bộ phát: `{n}` là số thẻ, `{n:3}` thêm số 0 cho đủ 3 chữ
   * số, `{n:byte}` gửi số thẻ thành 1 byte; `\r`, `\n`, `\t`, `\xNN` là ký tự điều khiển.
   */
  commandTemplate: string;
  /** Tự gọi thẻ khi bếp báo xong món; tắt thì bấm "Gọi thẻ" trên phiếu bếp. */
  autoCallWhenReady: boolean;
}
