import { NextFetchEvent, NextResponse } from 'next/server';
import { createEdgeRouter } from 'next-connect';
import { getUser } from '@/lib/middlewares/getUser';
import { checkUser, NextRequestWithUser } from '@/lib/middlewares/checkUser';
import { checkQuestionPermission } from '@/lib/utils/api/checkQuestionPermission';
import { getQuestionById } from '@/lib/services/questionService';

type ContextWithQuestionId = NextFetchEvent & {
  params: { questionId: string };
};
async function get(
  req: NextRequestWithUser,
  { params }: ContextWithQuestionId
) {
  const questionId = parseInt(params.questionId);
  const { isValid, body, init } = await checkQuestionPermission(
    questionId,
    req.user.id
  );
  if (!isValid) return NextResponse.json(body, init);

  const question = await getQuestionById(questionId);

  return NextResponse.json(question);
}

const router = createEdgeRouter<NextRequestWithUser, ContextWithQuestionId>();
router.get(getUser, checkUser, get);
export async function GET(
  request: NextRequestWithUser,
  ctx: ContextWithQuestionId
) {
  return router.run(request, ctx);
}
