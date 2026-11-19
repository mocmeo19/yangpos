'use client';

import { useState } from 'react';
import { checkMisaConnection } from '@/actions/misa-einvoice-actions';
import { getErrorMessage } from '@/lib/get-error-message';
import type { MisaConnectionResult } from '@/types/misa';

/** Nhờ máy chủ thử đăng nhập MISA và lấy ký hiệu hóa đơn của năm; giữ kết quả lần gần nhất. */
export function useMisaConnectionCheck() {
  const [result, setResult] = useState<MisaConnectionResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  async function check(year: number) {
    setIsChecking(true);
    try {
      setResult(await checkMisaConnection(year));
    } catch (error) {
      setResult({ ok: false, error: getErrorMessage(error) });
    } finally {
      setIsChecking(false);
    }
  }

  return { result, isChecking, check };
}
