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

interface ITokenResponse {
  refresh_token: string;
  token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokenRepository')
    private usersTokenRepository: IUsersTokenRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute(refreshToken: string): Promise<ITokenResponse> {
    const { sub, email } = verify(
      refreshToken,
      auth.secretRefreshToken,
    ) as IPayload;
    const userId = sub;

    const userToken =
      await this.usersTokenRepository.findByUserIdAndRefreshToken(
        userId,
        refreshToken,
      );
    if (!userToken) {
      throw new AppError('Refresh Token does not exists!');
    }
    if (
      this.dateProvider.compareIfBefore(
        userToken.expires_date,
        this.dateProvider.dateNow(),
      )
    ) {
      throw new AppError('Your session has expired, login again.');
    }
    await this.usersTokenRepository.deleteById(userToken.id);

    const newRefreshToken = sign({ email }, auth.secretRefreshToken, {
      subject: userId,
      expiresIn: auth.expiresInRefreshToken,
    });
    await this.usersTokenRepository.create({
      user_id: userId,
      refresh_token: newRefreshToken,
      expires_date: this.dateProvider.addDays(auth.expiresRefreshTokenDays),
    });

    const newToken = sign({}, auth.secretToken, {
      subject: userId,
      expiresIn: auth.expiresInToken,
    });

    return {
      refresh_token: newRefreshToken,
      token: newToken,
    };
  }
}

export { RefreshTokenUseCase };
