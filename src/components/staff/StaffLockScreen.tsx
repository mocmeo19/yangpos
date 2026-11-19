'use client';

import { LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { logout } from '@/actions/auth-actions';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { useEmployees } from '@/hooks/use-employees';
import { useStaffRoles } from '@/hooks/use-staff-roles';
import { useStaffSession } from '@/hooks/use-staff-session';
import { resolveLandingPath } from '@/lib/staff/resolve-landing-path';
import { EmployeePicker } from './EmployeePicker';
import { PinEntry } from './PinEntry';

/** Phủ toàn màn hình cho tới khi một nhân viên nhập đúng PIN. */
export function StaffLockScreen() {
  const employees = useEmployees();
  const roles = useStaffRoles();
  const { unlock } = useStaffSession();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoggingOut, startLogout] = useTransition();

  const isLoading = !employees || !roles;
  const activeEmployees = (employees ?? []).filter(
    (employee) => employee.isActive,
  );
  const selectedEmployee = activeEmployees.find(
    (employee) => employee.id === selectedId,
  );
  const findRole = (roleId: string) =>
    roles?.find((role) => role.id === roleId);
  const resolveRoleName = (roleId: string) =>
    findRole(roleId)?.name ?? 'Chưa có vai trò';

  async function handleSubmitPin(pin: string) {
    if (!selectedEmployee) {
      return;
    }
    await unlock(selectedEmployee.id, pin);
    const role = findRole(selectedEmployee.roleId);
    setSelectedId(null);
    const landingPath = role ? resolveLandingPath(pathname, role) : null;
    if (landingPath) {
      router.replace(landingPath);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="staff-lock-title"
      className="fixed inset-0 z-[60] overflow-y-auto bg-canvas"
    >
      <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-4 pt-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6">
        <header className="mb-8 flex flex-col items-center gap-3 text-center">
          <BrandMark />
          <div>
            <h1
              id="staff-lock-title"
              className="text-2xl font-bold tracking-tight"
            >
              {selectedEmployee ? 'Nhập mã PIN' : 'Ai đang dùng máy?'}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {selectedEmployee
                ? 'Mỗi nhân viên dùng PIN riêng để mở ca làm việc.'
                : 'Chọn tên của bạn để bắt đầu.'}
            </p>
          </div>
        </header>

        <div className="flex-1">
          {isLoading && <LoadingState label="Đang tải danh sách nhân viên…" />}
          {!isLoading && selectedEmployee && (
            <PinEntry
              key={selectedEmployee.id}
              employee={selectedEmployee}
              roleName={resolveRoleName(selectedEmployee.roleId)}
              showDefaultPinHint={selectedEmployee.usesDefaultPin}
              onSubmitPin={handleSubmitPin}
              onBack={() => setSelectedId(null)}
            />
          )}
          {!isLoading && !selectedEmployee && (
            <EmployeePicker
              employees={activeEmployees}
              resolveRoleName={resolveRoleName}
              onSelect={(employee) => setSelectedId(employee.id)}
            />
          )}
        </div>

        <footer className="mt-10 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            disabled={isLoggingOut}
            onClick={() => startLogout(() => logout())}
          >
            <LogOut className="size-4" />
            {isLoggingOut ? 'Đang đăng xuất…' : 'Đăng xuất tài khoản cửa hàng'}
          </Button>
        </footer>
      </div>
    </div>
  );
}
