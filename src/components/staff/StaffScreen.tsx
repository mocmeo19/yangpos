'use client';

import { ShieldCheck, UsersRound } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  SegmentedControl,
  type SegmentedOption,
} from '@/components/ui/SegmentedControl';
import { useHashTab } from '@/hooks/use-hash-tab';
import { useStaffSession } from '@/hooks/use-staff-session';
import { EmployeeManager } from './EmployeeManager';
import { RoleManager } from './RoleManager';

type StaffTab = 'employees' | 'roles';

const STAFF_TABS: readonly StaffTab[] = ['employees', 'roles'];

const TAB_OPTIONS: readonly SegmentedOption<StaffTab>[] = [
  { value: 'employees', label: 'Nhân viên', icon: UsersRound },
  { value: 'roles', label: 'Vai trò và quyền', icon: ShieldCheck },
];

export function StaffScreen() {
  const [tab, setTab] = useHashTab(STAFF_TABS, 'employees');
  const { session } = useStaffSession();

  // Màn hình khóa đang che phía trên, chưa cần biết ai thao tác.
  if (session.status !== 'unlocked') {
    return null;
  }
  const actor = {
    employeeId: session.employee.id,
    roleId: session.employee.roleId,
  };

  return (
    <>
      <PageHeader
        title="Nhân viên"
        description="Mỗi nhân viên mở khóa máy bằng mã PIN riêng; vai trò quyết định họ được làm gì."
      />
      <SegmentedControl
        label="Mục nhân viên"
        options={TAB_OPTIONS}
        value={tab}
        onChange={setTab}
        className="mb-5 w-full sm:w-auto sm:max-w-md"
      />
      {tab === 'employees' && <EmployeeManager actor={actor} />}
      {tab === 'roles' && <RoleManager />}
    </>
  );
}
