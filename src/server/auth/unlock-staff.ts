import 'server-only';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { verifyPin } from '@/lib/staff/pin-credential';
import { findEmployeeRecord } from '@/server/repositories/employee-repository';
import { writeStaffSessionCookie } from './staff-session-cookie';

// Chặn dò PIN: sai quá số lần thì tạm khóa nhân viên đó một lúc. Lưu trong bộ nhớ tiến trình là đủ
// cho một máy chủ của cửa hàng; chạy nhiều máy chủ thì cần chuyển sang lưu dùng chung.
const MAX_FAILED_ATTEMPTS = 5;
const COOLDOWN_MS = 30_000;

interface AttemptState {
  failures: number;
  lockedUntil: number;
}

const globalForAttempts = globalThis as typeof globalThis & {
  yangposPinAttempts?: Map<string, AttemptState>;
};

function getAttempts(): Map<string, AttemptState> {
  globalForAttempts.yangposPinAttempts ??= new Map();
  return globalForAttempts.yangposPinAttempts;
}

function assertNotLocked(employeeId: string, now: number): void {
  const state = getAttempts().get(employeeId);
  if (state && state.lockedUntil > now) {
    const seconds = Math.ceil((state.lockedUntil - now) / 1000);
    throw new UserFacingError(
      `Sai PIN quá nhiều lần. Vui lòng thử lại sau ${seconds} giây.`,
      429,
    );
  }
}

function recordFailure(employeeId: string, now: number): string {
  const attempts = getAttempts();
  const failures = (attempts.get(employeeId)?.failures ?? 0) + 1;
  if (failures >= MAX_FAILED_ATTEMPTS) {
    attempts.set(employeeId, { failures: 0, lockedUntil: now + COOLDOWN_MS });
    return `Sai PIN quá nhiều lần. Vui lòng thử lại sau ${COOLDOWN_MS / 1000} giây.`;
  }
  attempts.set(employeeId, { failures, lockedUntil: 0 });
  return 'Mã PIN không đúng, vui lòng thử lại.';
}

/** Kiểm tra PIN trên server rồi ghi cookie phiên nhân viên. */
export async function unlockStaff(
  employeeId: string,
  pin: string,
): Promise<void> {
  const now = Date.now();
  assertNotLocked(employeeId, now);
  const employee = await findEmployeeRecord(employeeId);
  if (!employee || !employee.isActive) {
    throw new UserFacingError('Nhân viên không còn làm việc.', 404);
  }
  if (!(await verifyPin(pin, employee.pin))) {
    throw new UserFacingError(recordFailure(employeeId, now), 401);
  }
  getAttempts().delete(employeeId);
  await writeStaffSessionCookie(employeeId);
}
