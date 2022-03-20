import dayjs from 'dayjs';

import { CarsRepositoryMock } from '@modules/cars/repositories/mock/CarsRepositoryMock';
import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { RentalsRepositoryMock } from '@modules/rentals/repositories/mock/RentalsRepositoryMock';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryMock: RentalsRepositoryMock;
let dateProvider: DayjsDateProvider;
let carsRepositoryMock: CarsRepositoryMock;

describe('Create Rental', () => {
  const returnDate24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    dateProvider = new DayjsDateProvider();
    rentalsRepositoryMock = new RentalsRepositoryMock();
    carsRepositoryMock = new CarsRepositoryMock();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryMock,
      dateProvider,
      carsRepositoryMock,
    );
  });

  it('should be able to create a new Rental', async () => {
    const car = await carsRepositoryMock.create({
      name: 'Car Test',
      brand: 'Brand Test',
      daily_rate: 200,
      description: 'Description Test',
      fine_amount: 20,
      license_plate: 'ABS-3434',
      category_id: 'category-uuid-test',
    });

    const data: ICreateRentalDTO = {
      car_id: car.id,
      user_id: '888-99999',
      expected_return_date: returnDate24Hours,
    };

    const rental = await createRentalUseCase.execute(data);

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new Rental if user already have once', async () => {
    const car = await carsRepositoryMock.create({
      name: 'Car Test',
      brand: 'Brand Test',
      daily_rate: 200,
      description: 'Description Test',
      fine_amount: 20,
      license_plate: 'ABS-3434',
      category_id: 'category-uuid-test',
    });

    const car2 = await carsRepositoryMock.create({
      name: 'Car Test',
      brand: 'Brand Test',
      daily_rate: 200,
      description: 'Description Test',
      fine_amount: 20,
      license_plate: 'ABS-3434',
      category_id: 'category-uuid-test',
    });

    const data: ICreateRentalDTO = {
      car_id: car.id,
      user_id: 'same-user-id',
      expected_return_date: returnDate24Hours,
    };

    const data2: ICreateRentalDTO = {
      car_id: car2.id,
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
    const car = await carsRepositoryMock.create({
      name: 'Car Test',
      brand: 'Brand Test',
      daily_rate: 200,
      description: 'Description Test',
      fine_amount: 20,
      license_plate: 'ABS-3434',
      category_id: 'category-uuid-test',
    });

    const data: ICreateRentalDTO = {
      car_id: car.id,
      user_id: 'user-1-uuid',
      expected_return_date: returnDate24Hours,
    };

    const data2: ICreateRentalDTO = {
      car_id: car.id,
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
