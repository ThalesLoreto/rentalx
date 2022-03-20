import { getRepository, Repository } from 'typeorm';

import { ICreateUseTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IUsersTokenRepository } from '@modules/accounts/repositories/IUsersTokenRepository';

import { UserToken } from '../entities/UserToken';

class UsersTokenRepository implements IUsersTokenRepository {
  private repository: Repository<UserToken>;
  constructor() {
    this.repository = getRepository(UserToken);
  }

  async create(data: ICreateUseTokenDTO): Promise<UserToken> {
    const { user_id, expires_date, refresh_token } = data;
    const userToken = this.repository.create({
      user_id,
      expires_date,
      refresh_token,
    });

    await this.repository.save(userToken);

    return userToken;
  }
}

export { UsersTokenRepository };
