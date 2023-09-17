import { getThemeById } from '@/lib/services/themeService';

export async function checkThemePermission(themeId: number, userId: number) {
  if (!isFinite(themeId)) {
    return {
      isValid: false,
      body: {
        error: { message: 'Invalid request' },
      },
      init: { status: 400 },
    };
  }

  const theme = await getThemeById(themeId);
  if (!theme || theme.userId !== userId) {
    return {
      isValid: false,
      body: {
        error: { message: 'Invalid Theme' },
      },
      init: { status: 400 },
    };
  }

  return {
    isValid: true,
  };
}
