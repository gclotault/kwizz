import { getThemeById } from '@/lib/services/themeService';
import { NextFetchEvent, NextResponse } from 'next/server';
import { createEdgeRouter } from 'next-connect';
import { getUser } from '@/lib/middlewares/getUser';
import { checkUser, NextRequestWithUser } from '@/lib/middlewares/checkUser';

type ContextWithParams = NextFetchEvent & { params: { id: string } };
async function get(
  request: NextRequestWithUser,
  { params }: ContextWithParams
) {
  const themeId = parseInt(params.id);
  if (!isFinite(themeId)) {
    return NextResponse.json(
      {
        error: { message: 'Invalid request' },
      },
      { status: 400 }
    );
  }
  const theme = await getThemeById(themeId);
  if (!theme || theme.userId !== request.user.id) {
    return NextResponse.json(
      {
        error: { message: 'Invalid theme' },
      },
      { status: 400 }
    );
  }

  return NextResponse.json(theme);
}

const router = createEdgeRouter<NextRequestWithUser, ContextWithParams>();
router.get(getUser, checkUser, get);
export async function GET(
  request: NextRequestWithUser,
  ctx: ContextWithParams
) {
  return router.run(request, ctx);
}
