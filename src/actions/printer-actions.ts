'use server';

import { getCurrentUsername } from '@/lib/auth/current-user';
import { getErrorMessage } from '@/lib/get-error-message';
import { getPrinterTargetError } from '@/lib/printer/printer-target';
import { sendRawToPrinter } from '@/lib/printer/send-raw-to-printer';
import type { PrinterActionResult } from '@/types/printer';

const MAX_PAYLOAD_BYTES = 1_000_000;
const INVALID_JOB_MESSAGE = 'Dữ liệu gửi tới máy in không hợp lệ.';

interface NetworkPrintJobInput {
  host: string;
  port: number;
  payloadBase64: string;
}

// Server Action nhận dữ liệu thẳng từ trình duyệt nên phải kiểm tra kiểu lúc chạy.
function isNetworkPrintJobInput(input: unknown): input is NetworkPrintJobInput {
  return (
    typeof input === 'object' &&
    input !== null &&
    typeof Reflect.get(input, 'host') === 'string' &&
    typeof Reflect.get(input, 'port') === 'number' &&
    typeof Reflect.get(input, 'payloadBase64') === 'string'
  );
}

/** Trả kết quả thay vì ném lỗi vì bản production của Next.js ẩn nội dung lỗi từ Server Action. */
export async function sendNetworkPrintJob(
  input: NetworkPrintJobInput,
): Promise<PrinterActionResult> {
  if (!(await getCurrentUsername())) {
    return {
      ok: false,
      error: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
    };
  }
  if (!isNetworkPrintJobInput(input)) {
    return { ok: false, error: INVALID_JOB_MESSAGE };
  }

  const host = input.host.trim();
  const targetError = getPrinterTargetError(host, input.port);
  if (targetError) {
    return { ok: false, error: targetError };
  }

  const data = Buffer.from(input.payloadBase64, 'base64');
  if (data.length === 0 || data.length > MAX_PAYLOAD_BYTES) {
    return { ok: false, error: INVALID_JOB_MESSAGE };
  }

  try {
    await sendRawToPrinter(host, input.port, data);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}
