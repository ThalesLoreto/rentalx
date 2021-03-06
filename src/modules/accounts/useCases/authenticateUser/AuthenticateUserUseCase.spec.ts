import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryMock } from '@modules/accounts/repositories/mock/UsersRepositoryMock';
import { UsersTokenRepositoryMock } from '@modules/accounts/repositories/mock/UsersTokenRepositoryMock';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let usersRepositoryMock: UsersRepositoryMock;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersTokenRepositoryMock: UsersTokenRepositoryMock;
let dateProvider: DayjsDateProvider;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryMock = new UsersRepositoryMock();
    usersTokenRepositoryMock = new UsersTokenRepositoryMock();
    dateProvider = new DayjsDateProvider();
    createUserUseCase = new CreateUserUseCase(usersRepositoryMock);

    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryMock,
      usersTokenRepositoryMock,
      dateProvider,
    );
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
