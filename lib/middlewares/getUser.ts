import { getServerSession } from 'next-auth';
import { getUserById } from '@/lib/services/userService';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextFetchEvent, NextRequest } from 'next/server';
import { User } from '@/prisma/generated/client';
import { NextHandler } from 'next-connect';

export type NextRequestWithOptionalUser = NextRequest & { user?: User };

export async function getUser(
  req: NextRequest,
  _res: NextFetchEvent,
  next: NextHandler
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return next();

  const user = await getUserById(session.user.id);
  if (!user) return next();

  (req as NextRequestWithOptionalUser).user = user;

  return next();
}
