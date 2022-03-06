import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { RentalsRepositoryMock } from '@modules/rentals/repositories/mock/RentalsRepositoryMock';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryMock: RentalsRepositoryMock;

describe('Create Rental', () => {
  beforeEach(() => {
    rentalsRepositoryMock = new RentalsRepositoryMock();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryMock);
  });

  it('should be able to create a new Rental', async () => {
    const data: ICreateRentalDTO = {
      car_id: '000-11111',
      user_id: '888-99999',
      expected_return_date: new Date(),
    };

    const rental = await createRentalUseCase.execute(data);

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new Rental if user already have once', async () => {
    const data: ICreateRentalDTO = {
      car_id: 'car-1-uuid',
      user_id: 'same-user-id',
      expected_return_date: new Date(),
    };

    const data2: ICreateRentalDTO = {
      car_id: 'car-2-uuid',
      user_id: 'same-user-id',
      expected_return_date: new Date(),
    };

    // First rental Creation
    await createRentalUseCase.execute(data);

    expect(async () => {
      // Second rental Creation with same user_id
      await createRentalUseCase.execute(data2);
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new Rental if the car is unavailable', async () => {
    const data: ICreateRentalDTO = {
      car_id: 'same-car-uuid',
      user_id: 'user-1-uuid',
      expected_return_date: new Date(),
    };

    const data2: ICreateRentalDTO = {
      car_id: 'same-car-uuid',
      user_id: 'user-2-uuid',
      expected_return_date: new Date(),
    };

    // First rental Creation
    await createRentalUseCase.execute(data);

    expect(async () => {
      // Trying to create a new Rental with unavailable car
      await createRentalUseCase.execute(data2);
    }).rejects.toBeInstanceOf(AppError);
  });
});
