import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokenRepository } from '@modules/accounts/repositories/IUsersTokenRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
class ResetUserPasswordUseCase {
  constructor(
    @inject('UsersTokenRepository')
    private usersTokenRepository: IUsersTokenRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  async execute(refreshToken: string, password: string) {
    const userToken = await this.usersTokenRepository.findByRefreshToken(
      refreshToken,
    );
    if (!userToken) {
      throw new AppError('Token invalid.');
    }

    if (
      this.dateProvider.compareIfBefore(
        userToken.expires_date,
        this.dateProvider.dateNow(),
      )
    ) {
      throw new AppError('Expired Token!');
    }

    // Find user and update the password
    const user = await this.usersRepository.findById(userToken.user_id);
    user.password = await hash(password, 8);

    // Update user in table and remove temp refresh_token
    await this.usersRepository.create(user);
    await this.usersTokenRepository.deleteById(userToken.id);
  }
}

export { ResetUserPasswordUseCase };
