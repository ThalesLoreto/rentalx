import { inject, injectable } from 'tsyringe';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

import { ICreateRentalDTO } from '../../dtos/ICreateRentalDTO';

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

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
    // The rental duration must be at least 24h
    const minHour = 24;
    const dateNow = this.dateProvider.dateNow();

    const diffHour = this.dateProvider.compareInHours(
      expected_return_date,
      dateNow,
    );

    if (diffHour < minHour) {
      throw new AppError('Invalid return time');
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
