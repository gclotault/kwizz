import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { User } from '@prisma/client';
import { NextHandler } from 'next-connect';
import { NextRequestWithOptionalUser } from '@/lib/middlewares/getUser';

export type NextRequestWithUser = NextRequest & { user: User };

export async function checkUser(
  req: NextRequestWithOptionalUser,
  _event: NextFetchEvent,
  next: NextHandler
) {
  if (!req.user)
    return NextResponse.json(
      {
        error: { message: 'Forbidden' },
      },
      { status: 403 }
    );

  return next();
}
