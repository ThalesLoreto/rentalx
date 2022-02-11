import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { UsersRepository } from '../modules/accounts/repositories/implementations/UsersRepository';

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
    throw new Error('Invalid token');
  }

  const [, token] = authHeader.split(' ');

  try {
    // TODO: create secret in .env
    const { sub: user_id } = verify(
      token,
      '6bd9444cb3a2d2b173ef9bad9be05eeb',
    ) as IPayload;

    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(user_id);
    if (!user) {
      throw new Error('User does not exists');
    }
    next();
  } catch {
    throw new Error('Invalid token');
  }
}
