import { getUser } from '@/lib/middlewares/getUser';
import { NextFetchEvent, NextResponse } from 'next/server';
import {
  addTheme,
  deleteThemeById,
  editTheme,
  getThemesByUserId,
} from '@/lib/services/themeService';
import { checkUser, NextRequestWithUser } from '@/lib/middlewares/checkUser';
import { createEdgeRouter } from 'next-connect';
import {
  NextRequestWithUserAndBody,
  validateBody,
} from '@/lib/middlewares/validateBody';
import {
  AddThemeDto,
  AddThemeDtoSchema,
  DeleteThemeDto,
  DeleteThemeDtoSchema,
  EditThemeDto,
  EditThemeDtoSchema,
} from '@/lib/validators/dto/themeDtoValidator';
import { checkThemePermission } from '@/lib/utils/api/checkThemePermission';

// GET
async function get(req: NextRequestWithUser) {
  const themes = await getThemesByUserId(req.user.id);
  return NextResponse.json(themes);
}

const getRouter = createEdgeRouter<NextRequestWithUser, NextFetchEvent>();
getRouter.get(getUser, checkUser, get);
export async function GET(request: NextRequestWithUser, ctx: NextFetchEvent) {
  return getRouter.run(request, ctx);
}

// POST
async function post(req: NextRequestWithUserAndBody<AddThemeDto>) {
  const newTheme = await addTheme(req.data, req.user.id);

  return NextResponse.json(newTheme);
}

const postRouter = createEdgeRouter<
  NextRequestWithUserAndBody<AddThemeDto>,
  NextFetchEvent
>();
postRouter.post(getUser, checkUser, validateBody(AddThemeDtoSchema), post);
export async function POST(
  request: NextRequestWithUserAndBody<AddThemeDto>,
  ctx: NextFetchEvent
) {
  return postRouter.run(request, ctx);
}

// PUT
async function put(req: NextRequestWithUserAndBody<EditThemeDto>) {
  const { isValid, body, init } = await checkThemePermission(
    req.data.id,
    req.user.id
  );
  if (!isValid) return NextResponse.json(body, init);

  const newTheme = await editTheme(req.data);

  return NextResponse.json(newTheme);
}

const putRouter = createEdgeRouter<
  NextRequestWithUserAndBody<EditThemeDto>,
  NextFetchEvent
>();
putRouter.put(getUser, checkUser, validateBody(EditThemeDtoSchema), put);
export async function PUT(
  request: NextRequestWithUserAndBody<EditThemeDto>,
  ctx: NextFetchEvent
) {
  return putRouter.run(request, ctx);
}

// DELETE
async function del(req: NextRequestWithUserAndBody<DeleteThemeDto>) {
  const { isValid, body, init } = await checkThemePermission(
    req.data.id,
    req.user.id
  );
  if (!isValid) return NextResponse.json(body, init);

  await deleteThemeById(req.data.id);

  // NextResponse does not handle 204 status code, so we use the Response object instead
  // https://github.com/vercel/next.js/discussions/51475
  return new Response(null, { status: 204 });
}

const delRouter = createEdgeRouter<
  NextRequestWithUserAndBody<DeleteThemeDto>,
  NextFetchEvent
>();
delRouter.delete(getUser, checkUser, validateBody(DeleteThemeDtoSchema), del);
export async function DELETE(
  request: NextRequestWithUserAndBody<DeleteThemeDto>,
  ctx: NextFetchEvent
) {
  return delRouter.run(request, ctx);
}
