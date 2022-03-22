import { ICreateUseTokenDTO } from '../../dtos/ICreateUserTokenDTO';
import { UserToken } from '../../infra/typeorm/entities/UserToken';
import { IUsersTokenRepository } from '../IUsersTokenRepository';

class UsersTokenRepositoryMock implements IUsersTokenRepository {
  usersToken!: UserToken[];

  constructor() {
    this.usersToken = [];
  }

  async create(data: ICreateUseTokenDTO): Promise<UserToken> {
    const { expires_date, refresh_token, user_id } = data;

    const userToken = new UserToken();
    Object.assign(userToken, {
      expires_date,
      refresh_token,
      user_id,
    });

    this.usersToken.push(userToken);

    return userToken;
  }
  async findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UserToken> {
    const userToken = this.usersToken.find(
      userToken =>
        userToken.user_id === userId &&
        userToken.refresh_token === refreshToken,
    );
    return userToken as UserToken;
  }
  async deleteById(id: string): Promise<void> {
    const userToken = this.usersToken.find(
      userToken => userToken.id === id,
    ) as UserToken;
    this.usersToken.splice(this.usersToken.indexOf(userToken));
  }
  async findByRefreshToken(refreshToken: string): Promise<UserToken> {
    const userToken = this.usersToken.find(
      userToken => userToken.refresh_token === refreshToken,
    );
    return userToken as UserToken;
  }
}

export { UsersTokenRepositoryMock };
