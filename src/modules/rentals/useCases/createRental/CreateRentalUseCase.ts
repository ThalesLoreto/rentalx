import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { AppError } from '@shared/errors/AppError';

import { ICreateRentalDTO } from '../../dtos/ICreateRentalDTO';

class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository) {}

  async execute(data: ICreateRentalDTO): Promise<Rental> {
    const { car_id, expected_return_date, user_id } = data;
    // Check if car is available
    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id,
    );
    if (carUnavailable) {
      throw new AppError('Car is unavailable');
    }
    // Check if user have an Rental in progress
    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(
      user_id,
    );
    if (rentalOpenToUser) {
      throw new AppError('User already have a rental in progress');
    }
    const rental = await this.rentalsRepository.create({
      car_id,
      user_id,
      expected_return_date,
    });
    return rental;
  }
}

export { CreateRentalUseCase };
