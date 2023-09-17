import { getUser } from '@/lib/middlewares/getUser';
import { NextFetchEvent, NextResponse } from 'next/server';
import { checkUser } from '@/lib/middlewares/checkUser';
import { createEdgeRouter } from 'next-connect';
import {
  NextRequestWithUserAndBody,
  validateBody,
} from '@/lib/middlewares/validateBody';
import {
  addQuestion,
  deleteQuestionById,
  editQuestion,
} from '@/lib/services/questionService';
import {
  AddQuestionDto,
  AddQuestionDtoSchema,
  DeleteQuestionDto,
  DeleteQuestionDtoSchema,
  EditQuestionDto,
  EditQuestionDtoSchema,
} from '@/lib/validators/dto/questionDtoValidator';
import { checkThemePermission } from '@/lib/utils/api/checkThemePermission';
import { checkQuestionPermission } from '@/lib/utils/api/checkQuestionPermission';

// POST
async function post(req: NextRequestWithUserAndBody<AddQuestionDto>) {
  const { isValid, body, init } = await checkThemePermission(
    req.data.themeId,
    req.user.id
  );
  if (!isValid) return NextResponse.json(body, init);
  const newQuestion = await addQuestion(req.data);

  return NextResponse.json(newQuestion);
}

const postRouter = createEdgeRouter<
  NextRequestWithUserAndBody<AddQuestionDto>,
  NextFetchEvent
>();
postRouter.post(getUser, checkUser, validateBody(AddQuestionDtoSchema), post);
export async function POST(
  request: NextRequestWithUserAndBody<AddQuestionDto>,
  ctx: NextFetchEvent
) {
  return postRouter.run(request, ctx);
}

// PUT
async function put(req: NextRequestWithUserAndBody<EditQuestionDto>) {
  const { isValid, body, init } = await checkQuestionPermission(
    req.data.id,
    req.user.id
  );
  if (!isValid) return NextResponse.json(body, init);

  const newQuestion = await editQuestion(req.data);

  return NextResponse.json(newQuestion);
}

const putRouter = createEdgeRouter<
  NextRequestWithUserAndBody<EditQuestionDto>,
  NextFetchEvent
>();
putRouter.put(getUser, checkUser, validateBody(EditQuestionDtoSchema), put);
export async function PUT(
  request: NextRequestWithUserAndBody<EditQuestionDto>,
  ctx: NextFetchEvent
) {
  return putRouter.run(request, ctx);
}

// DELETE
async function del(req: NextRequestWithUserAndBody<DeleteQuestionDto>) {
  const { isValid, body, init } = await checkQuestionPermission(
    req.data.id,
    req.user.id
  );
  if (!isValid) return NextResponse.json(body, init);
  await deleteQuestionById(req.data.id);

  // NextResponse does not handle 204 status code, so we use the Response object instead
  // https://github.com/vercel/next.js/discussions/51475
  return new Response(null, { status: 204 });
}

const delRouter = createEdgeRouter<
  NextRequestWithUserAndBody<DeleteQuestionDto>,
  NextFetchEvent
>();
delRouter.delete(
  getUser,
  checkUser,
  validateBody(DeleteQuestionDtoSchema),
  del
);
export async function DELETE(
  request: NextRequestWithUserAndBody<DeleteQuestionDto>,
  ctx: NextFetchEvent
) {
  return delRouter.run(request, ctx);
}
