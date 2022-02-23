import { ICreateCarSpecificationsDTO } from '@modules/cars/dtos/ICreateCarSpecificationsDTO';
import { CarsRepositoryMock } from '@modules/cars/repositories/mock/CarsRepositoryMock';
import { SpecificationsRepositoryMock } from '@modules/cars/repositories/mock/SpecificationsRepositoryMock';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryMock: CarsRepositoryMock;
let specificationsRepositoryMock: SpecificationsRepositoryMock;

describe('Create Car Specification', () => {
  beforeEach(() => {
    specificationsRepositoryMock = new SpecificationsRepositoryMock();
    carsRepositoryMock = new CarsRepositoryMock();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryMock,
      specificationsRepositoryMock,
    );
  });

  it('should not be able to add a new specification to an non-existent car', () => {
    expect(async () => {
      const data: ICreateCarSpecificationsDTO = {
        car_id: '001',
        specifications_id: ['111', '222'],
      };

      await createCarSpecificationUseCase.execute(data);
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to add a new specification to the car', async () => {
    const car = await carsRepositoryMock.create({
      name: 'Test Car',
      description: 'Test Description Car',
      daily_rate: 160,
      fine_amount: 30,
      brand: 'AnyBrand',
      category_id: 'category_uuid',
      license_plate: 'ABC-1234',
    });

    const specification = await specificationsRepositoryMock.create({
      name: '4 portas',
      description: 'Carro com 4 portas',
    });

    const data: ICreateCarSpecificationsDTO = {
      car_id: car.id,
      specifications_id: [specification.id],
    };

    await createCarSpecificationUseCase.execute(data);

    expect(car).toEqual(
      expect.objectContaining({
        specifications: expect.arrayContaining([
          expect.objectContaining({
            name: '4 portas',
            description: 'Carro com 4 portas',
          }),
        ]),
      }),
    );
  });
});
