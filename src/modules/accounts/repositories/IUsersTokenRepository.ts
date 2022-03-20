import { ICreateUseTokenDTO } from '../dtos/ICreateUserTokenDTO';
import { UserToken } from '../infra/typeorm/entities/UserToken';

interface IUsersTokenRepository {
  create(data: ICreateUseTokenDTO): Promise<UserToken>;
}

export { IUsersTokenRepository };
