import { ICreateUseTokenDTO } from '../dtos/ICreateUserTokenDTO';
import { UserToken } from '../infra/typeorm/entities/UserToken';

interface IUsersTokenRepository {
  create(data: ICreateUseTokenDTO): Promise<UserToken>;
  findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UserToken>;
  deleteById(id: string): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<UserToken>;
}

export { IUsersTokenRepository };
