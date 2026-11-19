'use server';

import { getCurrentUsername } from '@/lib/auth/current-user';
import { getErrorMessage } from '@/lib/get-error-message';
import { isMisaInvoiceData } from '@/lib/misa/is-misa-invoice-data';
import { listMisaSeries } from '@/lib/misa/list-misa-series';
import { publishMisaInvoiceData } from '@/lib/misa/publish-misa-invoice-data';
import { readMisaConfig } from '@/lib/misa/read-misa-config';
import type { MisaConnectionResult, MisaPublishResult } from '@/types/misa';
import type { MisaInvoiceData } from '@/types/misa-invoice-data';

const SESSION_EXPIRED_MESSAGE =
  'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.';
const MIN_YEAR = 2022;
const MAX_YEAR = 2100;

// Các hàm trả kết quả thay vì ném lỗi vì bản production của Next.js ẩn nội dung lỗi từ Server Action.

/** Kiểm tra tài khoản tích hợp và lấy các ký hiệu hóa đơn máy tính tiền của năm trên MISA. */
export async function checkMisaConnection(
  year: number,
): Promise<MisaConnectionResult> {
  if (!(await getCurrentUsername())) {
    return { ok: false, error: SESSION_EXPIRED_MESSAGE };
  }
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    return { ok: false, error: 'Năm lấy ký hiệu hóa đơn không hợp lệ.' };
  }
  const configResult = readMisaConfig();
  if (!configResult.ok) {
    return configResult;
  }
  const { config } = configResult;
  try {
    return {
      ok: true,
      environment: config.environment,
      taxCode: config.taxCode,
      series: await listMisaSeries(config, year),
    };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

/** Phát hành một hóa đơn; MISA dựa vào RefID nên gửi lại sau sự cố không sinh hóa đơn trùng. */
export async function publishMisaInvoice(
  invoice: MisaInvoiceData,
): Promise<MisaPublishResult> {
  if (!(await getCurrentUsername())) {
    return { ok: false, error: SESSION_EXPIRED_MESSAGE };
  }
  if (!isMisaInvoiceData(invoice)) {
    return { ok: false, error: 'Dữ liệu hóa đơn gửi MISA không hợp lệ.' };
  }
  const configResult = readMisaConfig();
  if (!configResult.ok) {
    return configResult;
  }
  const { config } = configResult;
  try {
    return {
      ok: true,
      environment: config.environment,
      invoice: await publishMisaInvoiceData(config, invoice),
    };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}
