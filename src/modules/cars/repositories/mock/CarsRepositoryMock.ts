import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IListCarsDTO } from '@modules/cars/dtos/IListCarsDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../ICarsRepository';

class CarsRepositoryMock implements ICarsRepository {
  cars: Car[] = [];

  async create({
    brand,
    category_id,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    name,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();
    Object.assign(car, {
      name,
      description,
      daily_rate,
      brand,
      category_id,
      fine_amount,
      license_plate,
    });

    this.cars.push(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
    return this.cars.find(car => car.license_plate === license_plate);
  }

  async listAllAvailable(filters: IListCarsDTO): Promise<Car[]> {
    const { brand, category_id, name } = filters;

    return this.cars
      .filter(car => car.available === true)
      .filter(car => (category_id ? car.category_id === category_id : null))
      .filter(car => (brand ? car.brand === brand : null))
      .filter(car => (name ? car.name === name : null));
  }
}

export { CarsRepositoryMock };
