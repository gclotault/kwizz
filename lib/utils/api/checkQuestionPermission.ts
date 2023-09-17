import { checkThemePermission } from '@/lib/utils/api/checkThemePermission';
import { getQuestionById } from '@/lib/services/questionService';

export async function checkQuestionPermission(
  questionId: number,
  userId: number
) {
  if (!isFinite(questionId)) {
    return {
      isValid: false,
      body: {
        error: { message: 'Invalid request' },
      },
      init: { status: 400 },
    };
  }

  const question = await getQuestionById(questionId);
  if (!question) {
    return {
      isValid: false,
      body: {
        error: { message: 'Invalid question' },
      },
      init: { status: 400 },
    };
  }

  const checkThemeResult = await checkThemePermission(question.themeId, userId);
  if (!checkThemeResult.isValid) return checkThemeResult;

  return {
    isValid: true,
  };
}
