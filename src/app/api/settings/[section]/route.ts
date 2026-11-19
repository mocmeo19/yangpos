import { UserFacingError } from '@/lib/errors/user-facing-error';
import { apiRoute } from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import {
  isSettingsSection,
  saveSettingsSection,
} from '@/server/repositories/settings-repository';

interface SectionRouteContext {
  params: Promise<{ section: string }>;
}

export const PUT = apiRoute<SectionRouteContext>(
  async (request, { params }) => {
    await requireStaff('settings.manage');
    const { section } = await params;
    if (!isSettingsSection(section)) {
      throw new UserFacingError('Không có phần cài đặt này.', 404);
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new UserFacingError('Dữ liệu gửi lên không phải JSON hợp lệ.');
    }
    await saveSettingsSection(section, body);
  },
);
