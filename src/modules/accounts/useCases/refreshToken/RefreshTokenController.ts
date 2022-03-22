import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RefreshTokenUseCase } from './RefreshTokenUseCase';

class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const refreshToken =
      req.body.refresh_token ||
      req.headers['x-access-token'] ||
      req.query.token;

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);
    const newToken = await refreshTokenUseCase.execute(refreshToken);

    return res.json(newToken);
  }
}

export { RefreshTokenController };
