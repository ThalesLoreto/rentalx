import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import auth from '@config/auth';
import { UsersTokenRepository } from '@modules/accounts/infra/typeorm/repositories/UsersTokenRepository';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AppError('You are without session', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    // TODO: create secret in .env
    const { sub: user_id } = verify(token, auth.secretRefreshToken) as IPayload;

    const usersTokenRepository = new UsersTokenRepository();

    const userToken = await usersTokenRepository.findByUserIdAndRefreshToken(
      user_id,
      token,
    );
    if (!userToken) {
      throw new AppError('User does not exists', 401);
    }

    req.user = {
      id: user_id,
    };

    next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}
