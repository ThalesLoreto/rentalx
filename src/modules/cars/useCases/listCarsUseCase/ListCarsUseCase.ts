import { inject, injectable } from 'tsyringe';

import { IListCarsDTO } from '@modules/cars/dtos/IListCarsDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

@injectable()
class ListCarsUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute(filters: IListCarsDTO): Promise<Car[]> {
    const cars = await this.carsRepository.listAllAvailable(filters);
    return cars;
  }
}

export { ListCarsUseCase };
