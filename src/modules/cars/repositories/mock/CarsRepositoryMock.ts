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
    specifications,
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
      specifications,
    });

    this.cars.push(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
    return this.cars.find(car => car.license_plate === license_plate);
  }

  async listAllAvailable(filters: IListCarsDTO): Promise<Car[]> {
    const { brand, category_id, name } = filters;

    let cars = this.cars.filter(car => car.available === true);

    if (brand) {
      cars = this.cars.filter(car => car.brand === brand);
    }
    if (category_id) {
      cars = this.cars.filter(car => car.category_id === category_id);
    }
    if (name) {
      cars = this.cars.filter(car => car.name === name);
    }

    return cars;
  }

  async findById(car_id: string): Promise<Car | undefined> {
    return this.cars.find(car => car.id === car_id);
  }
}

export { CarsRepositoryMock };
