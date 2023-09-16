import { getUser } from '@/lib/middlewares/getUser';
import { NextFetchEvent, NextResponse } from 'next/server';
import {
  addTheme,
  deleteThemeById,
  editTheme,
  getThemeById,
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

// GET
async function get(request: NextRequestWithUser) {
  const themes = await getThemesByUserId(request.user.id);
  return NextResponse.json(themes);
}

const getRouter = createEdgeRouter<NextRequestWithUser, NextFetchEvent>();
getRouter.get(getUser, checkUser, get);
export async function GET(request: NextRequestWithUser, ctx: NextFetchEvent) {
  return getRouter.run(request, ctx);
}

// POST
async function post(request: NextRequestWithUserAndBody<AddThemeDto>) {
  const { data } = request;
  const newTheme = await addTheme(data, request.user.id);

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
async function put(request: NextRequestWithUserAndBody<EditThemeDto>) {
  const { data } = request;
  const theme = await getThemeById(data.id);
  if (!theme || theme.userId !== request.user.id) {
    return NextResponse.json(
      {
        error: { message: 'Invalid theme' },
      },
      { status: 400 }
    );
  }
  const newTheme = await editTheme(data);

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
async function del(request: NextRequestWithUserAndBody<DeleteThemeDto>) {
  const { data } = request;
  const theme = await getThemeById(data.id);
  if (!theme || theme.userId !== request.user.id) {
    return NextResponse.json(
      {
        error: { message: 'Invalid theme' },
      },
      { status: 400 }
    );
  }
  await deleteThemeById(data.id);

  // NextReponse does not handle 204 status code, so we use the Reponse object instead
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
