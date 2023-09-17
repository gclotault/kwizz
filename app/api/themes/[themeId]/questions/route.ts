import { getThemeById } from '@/lib/services/themeService';
import { NextFetchEvent, NextResponse } from 'next/server';
import { createEdgeRouter } from 'next-connect';
import { getUser } from '@/lib/middlewares/getUser';
import { checkUser, NextRequestWithUser } from '@/lib/middlewares/checkUser';
import { checkThemePermission } from '@/lib/utils/api/checkThemePermission';

type ContextWithThemeId = NextFetchEvent & { params: { themeId: string } };
async function get(req: NextRequestWithUser, { params }: ContextWithThemeId) {
  const themeId = parseInt(params.themeId);
  const { isValid, body, init } = await checkThemePermission(
    themeId,
    req.user.id
  );
  if (!isValid) return NextResponse.json(body, init);

  const theme = await getThemeById(themeId, { includeQuestions: true });

  return NextResponse.json(theme);
}

const router = createEdgeRouter<NextRequestWithUser, ContextWithThemeId>();
router.get(getUser, checkUser, get);
export async function GET(
  request: NextRequestWithUser,
  ctx: ContextWithThemeId
) {
  return router.run(request, ctx);
}
