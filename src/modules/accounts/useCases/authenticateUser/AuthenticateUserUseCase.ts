import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokenRepository } from '@modules/accounts/repositories/IUsersTokenRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokenRepository')
    private usersTokenRepository: IUsersTokenRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Email or password incorrect');
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError('Email or password incorrect');
    }

    // TODO: create secret in .env
    const token = sign({}, auth.secretToken, {
      subject: user.id,
      expiresIn: auth.expiresInToken,
    });

    const refreshToken = sign({ email }, auth.secretRefreshToken, {
      subject: user.id,
      expiresIn: auth.expiresInRefreshToken,
    });

    await this.usersTokenRepository.create({
      user_id: user.id as string,
      refresh_token: refreshToken,
      expires_date: this.dateProvider.addDays(auth.expiresRefreshTokenDays),
    });

    const tokenReturn: IResponse = {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
      refresh_token: refreshToken,
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };
