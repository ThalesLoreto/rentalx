import { inject, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokenRepository } from '@modules/accounts/repositories/IUsersTokenRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokenRepository')
    private usersTokenRepository: IUsersTokenRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
    @inject('EtherealMailProvider')
    private mailProvider: IMailProvider,
  ) {}
  async execute(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User does not exists!');
    }
    const token = uuid();
    await this.usersTokenRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date: this.dateProvider.addHours(3),
    });

    await this.mailProvider.sendMail(
      email,
      'Recuperacao de Conta',
      `O link para recuperar é: ${token}`,
    );
  }
}

export { SendForgotPasswordMailUseCase };
