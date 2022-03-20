import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokenRepository } from '@modules/accounts/repositories/IUsersTokenRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokenRepository')
    private usersTokenRepository: IUsersTokenRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute(token: string): Promise<string> {
    const { sub, email } = verify(token, auth.secretRefreshToken) as IPayload;
    const userId = sub;

    const userToken =
      await this.usersTokenRepository.findByUserIdAndRefreshToken(
        userId,
        token,
      );
    if (!userToken) {
      throw new AppError('Refresh Token does not exists!');
    }
    await this.usersTokenRepository.deleteById(userToken.id);

    const refreshToken = sign({ email }, auth.secretRefreshToken, {
      subject: userId,
      expiresIn: auth.expiresInRefreshToken,
    });
    await this.usersTokenRepository.create({
      user_id: userId,
      refresh_token: refreshToken,
      expires_date: this.dateProvider.addDays(auth.expiresRefreshTokenDays),
    });

    return refreshToken;
  }
}

export { RefreshTokenUseCase };
