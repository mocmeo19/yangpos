'use client';

import { useSearchParams } from 'next/navigation';

/** Chuyển tiếp trang người dùng định vào (do proxy gắn vào `?from=`) để quay lại sau khi đăng nhập. */
export function RedirectToField() {
  const searchParams = useSearchParams();
  return (
    <input
      type="hidden"
      name="redirectTo"
      value={searchParams.get('from') ?? '/'}
    />
  );
}
