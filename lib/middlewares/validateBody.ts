import { NextFetchEvent, NextResponse } from 'next/server';
import { NextHandler } from 'next-connect';
import { NextRequestWithUser } from '@/lib/middlewares/checkUser';
import { ZodSchema } from 'zod';

export type NextRequestWithUserAndBody<T> = NextRequestWithUser & { data: T };

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (
    req: NextRequestWithUser,
    _event: NextFetchEvent,
    next: NextHandler
  ) => {
    const response = schema.safeParse(await req.json());

    // If the request body is invalid, return a 400 error with the validation errors
    if (!response.success) {
      const { errors } = response.error;

      return NextResponse.json(
        {
          error: { message: 'Invalid request', errors },
        },
        { status: 400 }
      );
    }

    (req as NextRequestWithUserAndBody<T>).data = response.data;

    return next();
  };
}
