import { CarsRepositoryMock } from '@modules/cars/repositories/mock/CarsRepositoryMock';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

let carsRepositoryMock: CarsRepositoryMock;
let createCarUseCase: CreateCarUseCase;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryMock = new CarsRepositoryMock();
    createCarUseCase = new CreateCarUseCase(carsRepositoryMock);
  });

  it('should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Test Car',
      description: 'Test Description Car',
      daily_rate: 160,
      fine_amount: 30,
      brand: 'AnyBrand',
      category_id: 'category_uuid',
      license_plate: 'ABC-1234',
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a new car if this license plate already exists', () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: 'Car 1',
        license_plate: 'ABC-1234',
        description: 'Test Description Car1',
        daily_rate: 200,
        fine_amount: 60,
        brand: 'AnyBrand',
        category_id: 'category_uuid',
      });

      await createCarUseCase.execute({
        name: 'Car 2',
        license_plate: 'ABC-1234',
        description: 'Test Description Car2',
        daily_rate: 110,
        fine_amount: 10,
        brand: 'AnyBrand',
        category_id: 'category_uuid',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a new car with available true', async () => {
    const createdCar = await createCarUseCase.execute({
      name: 'Car Available',
      description: 'Test Car Available',
      daily_rate: 160,
      fine_amount: 30,
      brand: 'AnyBrand',
      category_id: 'category_uuid',
      license_plate: 'AAA-1111',
    });

    expect(createdCar.available).toBe(true);
  });
});
