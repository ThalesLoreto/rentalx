import { CarsRepositoryMock } from '@modules/cars/repositories/mock/CarsRepositoryMock';

import { CreateCarUseCase } from '../createCar/CreateCarUseCase';
import { ListCarsUseCase } from './ListCarsUseCase';

let carsRepositoryMock: CarsRepositoryMock;
let listCarsUseCase: ListCarsUseCase;
let createCarUseCase: CreateCarUseCase;

describe('List cars', () => {
  beforeEach(() => {
    carsRepositoryMock = new CarsRepositoryMock();
    createCarUseCase = new CreateCarUseCase(carsRepositoryMock);
    listCarsUseCase = new ListCarsUseCase(carsRepositoryMock);
  });

  it('should be able to list all available cars', async () => {
    const car = await createCarUseCase.execute({
      name: 'Test Car',
      description: 'Test Description Car',
      daily_rate: 160,
      fine_amount: 30,
      brand: 'AnyBrand',
      category_id: 'category_uuid',
      license_plate: 'ABC-1234',
    });

    const cars = await listCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars filtering by brand', async () => {
    await createCarUseCase.execute({
      brand: 'Brand_Filter',
      name: 'Car1',
      description: 'Test Description Car',
      daily_rate: 160,
      fine_amount: 30,
      category_id: 'category_uuid',
      license_plate: 'DDZ-2934',
    });

    await createCarUseCase.execute({
      brand: 'Another_Brand',
      name: 'Car2',
      description: 'Test Description Car',
      daily_rate: 160,
      fine_amount: 30,
      category_id: 'category_uuid',
      license_plate: 'SFJ-2932',
    });

    const cars = await listCarsUseCase.execute({
      brand: 'Brand_Filter',
    });

    console.log(cars);

    expect(cars).toEqual(
      expect.arrayContaining(
        expect.objectContaining({ brand: 'Brand_Filter' }),
      ),
    );
  });
});
