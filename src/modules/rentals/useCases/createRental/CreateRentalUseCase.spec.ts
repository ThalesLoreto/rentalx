import dayjs from 'dayjs';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { RentalsRepositoryMock } from '@modules/rentals/repositories/mock/RentalsRepositoryMock';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryMock: RentalsRepositoryMock;
let dateProvider: DayjsDateProvider;

describe('Create Rental', () => {
  const returnDate24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    dateProvider = new DayjsDateProvider();
    rentalsRepositoryMock = new RentalsRepositoryMock();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryMock,
      dateProvider,
    );
  });

  it('should be able to create a new Rental', async () => {
    const data: ICreateRentalDTO = {
      car_id: '000-11111',
      user_id: '888-99999',
      expected_return_date: returnDate24Hours,
    };

    const rental = await createRentalUseCase.execute(data);

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new Rental if user already have once', async () => {
    const data: ICreateRentalDTO = {
      car_id: 'car-1-uuid',
      user_id: 'same-user-id',
      expected_return_date: returnDate24Hours,
    };

    const data2: ICreateRentalDTO = {
      car_id: 'car-2-uuid',
      user_id: 'same-user-id',
      expected_return_date: returnDate24Hours,
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
      expected_return_date: returnDate24Hours,
    };

    const data2: ICreateRentalDTO = {
      car_id: 'same-car-uuid',
      user_id: 'user-2-uuid',
      expected_return_date: returnDate24Hours,
    };

    // First rental Creation
    await createRentalUseCase.execute(data);

    expect(async () => {
      // Trying to create a new Rental with unavailable car
      await createRentalUseCase.execute(data2);
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new Rental with invalid return time', async () => {
    const data: ICreateRentalDTO = {
      car_id: 'same-car-uuid',
      user_id: 'user-1-uuid',
      expected_return_date: dayjs().toDate(),
    };
    expect(async () => {
      // Trying to create a new Rental with unavailable car
      await createRentalUseCase.execute(data);
    }).rejects.toBeInstanceOf(AppError);
  });
});
