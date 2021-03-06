import { CarsRepositoryMock } from '@modules/cars/repositories/mock/CarsRepositoryMock';

import { CreateCarUseCase } from '../createCar/CreateCarUseCase';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let carsRepositoryMock: CarsRepositoryMock;
let listCarsUseCase: ListAvailableCarsUseCase;
let createCarUseCase: CreateCarUseCase;

describe('List cars', () => {
  beforeEach(() => {
    carsRepositoryMock = new CarsRepositoryMock();
    createCarUseCase = new CreateCarUseCase(carsRepositoryMock);
    listCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryMock);
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

    expect(cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ brand: 'Brand_Filter' }),
      ]),
    );
  });

  it('should be able to list all available cars filtering by name', async () => {
    await createCarUseCase.execute({
      name: 'Car Searched',
      description: 'Test Description Car',
      daily_rate: 160,
      fine_amount: 30,
      brand: 'AnyBrand',
      category_id: 'category_uuid',
      license_plate: 'OWK-2351',
    });

    await createCarUseCase.execute({
      name: 'Incorrect Car',
      description: 'Test Description Car',
      daily_rate: 160,
      fine_amount: 30,
      category_id: 'category_uuid',
      brand: 'AnyBrand2',
      license_plate: 'FHK-8365',
    });

    const cars = await listCarsUseCase.execute({
      name: 'Car Searched',
    });

    expect(cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Car Searched' }),
      ]),
    );
  });

  it('should be able to list all available cars filtering by category', async () => {
    await createCarUseCase.execute({
      category_id: 'correct-category-uuid',
      name: 'Car Correct',
      description: 'Test Description Car',
      daily_rate: 160,
      fine_amount: 30,
      brand: 'AnyBrand',
      license_plate: 'PRJ-2394',
    });

    await createCarUseCase.execute({
      category_id: 'invalid-uuid',
      name: 'Incorrect Car',
      description: 'Test Description Car',
      daily_rate: 160,
      fine_amount: 30,
      brand: 'AnyBrand2',
      license_plate: 'WJF-7392',
    });

    const cars = await listCarsUseCase.execute({
      category_id: 'correct-category-uuid',
    });

    expect(cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category_id: 'correct-category-uuid' }),
      ]),
    );
  });
});
