import 'server-only';
import { DEFAULT_SETTINGS } from '@/data/default-settings';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { getCollections } from '@/server/db/collections';
import {
  SETTINGS_RECORD_ID,
  type AppSettings,
  type SettingsSection,
} from '@/types/settings';

function describeKind(value: unknown): string {
  return Array.isArray(value) ? 'array' : typeof value;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Chỉ nhận các trường có trong cài đặt mặc định và đúng kiểu dữ liệu của trường đó; trường lạ bị
 * bỏ. Kiểm tra nghiệp vụ chi tiết (vd số tài khoản) do form cài đặt làm trước khi gửi.
 */
function sanitizeSection<K extends SettingsSection>(
  section: K,
  value: unknown,
): AppSettings[K] {
  if (!isPlainObject(value)) {
    throw new UserFacingError('Dữ liệu cài đặt không hợp lệ.');
  }
  // Bắt đầu từ bản mặc định để luôn đủ trường, rồi chỉ ghi đè các trường đúng kiểu.
  const sanitized: AppSettings[K] = { ...DEFAULT_SETTINGS[section] };
  for (const [key, defaultValue] of Object.entries(sanitized)) {
    const candidate = value[key];
    if (candidate === undefined) {
      continue;
    }
    if (describeKind(candidate) !== describeKind(defaultValue)) {
      throw new UserFacingError(
        `Trường cài đặt "${key}" không đúng kiểu dữ liệu.`,
      );
    }
    Object.assign(sanitized, { [key]: candidate });
  }
  return sanitized;
}

export function isSettingsSection(value: string): value is SettingsSection {
  return Object.hasOwn(DEFAULT_SETTINGS, value);
}

export async function getStoredSettings(): Promise<Partial<AppSettings>> {
  const { settings } = await getCollections();
  // Bỏ cả khóa `id` của bản ghi, chỉ trả về các phần cài đặt.
  const stored = await settings.findOne<Partial<AppSettings>>(
    { id: SETTINGS_RECORD_ID },
    { projection: { _id: 0, id: 0 } },
  );
  return stored ?? {};
}

export async function saveSettingsSection<K extends SettingsSection>(
  section: K,
  value: unknown,
): Promise<void> {
  const sanitized = sanitizeSection(section, value);
  const { settings } = await getCollections();
  await settings.updateOne(
    { id: SETTINGS_RECORD_ID },
    { $set: { [section]: sanitized } },
    { upsert: true },
  );
}
