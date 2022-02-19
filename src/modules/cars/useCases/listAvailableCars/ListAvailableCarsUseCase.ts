import { inject, injectable } from 'tsyringe';

import { IListCarsDTO } from '@modules/cars/dtos/IListCarsDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
class ListAvailableCarsUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute(filters: IListCarsDTO): Promise<Car[]> {
    try {
      const cars = await this.carsRepository.listAllAvailable(filters);
      return cars;
    } catch {
      throw new AppError('Failed to list all available cars.');
    }
  }
}

export { ListAvailableCarsUseCase };
