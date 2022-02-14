import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryMock } from '@modules/accounts/repositories/mock/UsersRepositoryMock';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let usersRepositoryMock: UsersRepositoryMock;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryMock = new UsersRepositoryMock();
    createUserUseCase = new CreateUserUseCase(usersRepositoryMock);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryMock);
  });

  it('should be able to generate a token', async () => {
    const user: ICreateUserDTO = {
      name: 'Thales',
      email: 'thales@mock.com',
      password: 'mockpassword',
      driver_license: 'B',
    };
    // Create user
    await createUserUseCase.execute(user);

    // Get the token (Authenticate user)
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
  });

  it('should not be able to authenticate an nonexist user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'nonexist@email.com',
        password: '123123',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with incorrect password', async () => {
    const user: ICreateUserDTO = {
      name: 'Thales',
      email: 'thales@mock.com',
      password: 'mockpassword',
      driver_license: 'B',
    };
    // Create user
    await createUserUseCase.execute(user);

    // Get the token (Authenticate user)
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'incorrect_password',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
