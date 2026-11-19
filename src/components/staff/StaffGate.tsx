'use client';

import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { SWRConfig, type SWRConfiguration } from 'swr';
import { useStaffSession } from '@/hooks/use-staff-session';
import { revalidateApi } from '@/lib/api/revalidate-api';
import { StaffLockScreen } from './StaffLockScreen';

/**
 * Vẫn render nội dung phía sau để trang không phải tải lại sau khi mở khóa, nhưng đặt `inert` để
 * không bấm hay tab vào được. Khi máy khóa, các trang phía sau tạm ngừng gọi API vì máy chủ sẽ từ
 * chối mọi yêu cầu cần nhân viên.
 */
export function StaffGate({ children }: { children: ReactNode }) {
  const { session } = useStaffSession();
  const isUnlocked = session.status === 'unlocked';
  const isPaused = useCallback(() => !isUnlocked, [isUnlocked]);
  const swrConfig = useMemo<SWRConfiguration>(() => ({ isPaused }), [isPaused]);

  // Lúc còn khóa, các lần tải bị bỏ qua; vừa mở khóa thì tải lại để trang có dữ liệu ngay.
  useEffect(() => {
    if (isUnlocked) {
      void revalidateApi('/api/');
    }
  }, [isUnlocked]);

  return (
    <>
      <SWRConfig value={swrConfig}>
        <div inert={!isUnlocked}>{children}</div>
      </SWRConfig>
      {session.status === 'locked' && <StaffLockScreen />}
      {session.status === 'loading' && (
        <div aria-hidden="true" className="fixed inset-0 z-[60] bg-canvas" />
      )}
    </>
  );
}
