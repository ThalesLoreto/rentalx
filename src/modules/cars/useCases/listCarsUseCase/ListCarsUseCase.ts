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

  async execute({ brand }: IListCarsDTO): Promise<Car[]> {
    const cars = await this.carsRepository.listAllAvailable({ brand });
    return cars;
  }
}

export { ListCarsUseCase };
