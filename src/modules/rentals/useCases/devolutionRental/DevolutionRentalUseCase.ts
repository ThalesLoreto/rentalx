import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { IDevolutionRentalDTO } from '@modules/rentals/dtos/IDevolutionRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute(data: IDevolutionRentalDTO): Promise<Rental> {
    const { id, user_id } = data;
    const rental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(rental.car_id);

    let total = 0;

    if (!rental) {
      throw new AppError('This rental id does not exists');
    }

    let daily = this.dateProvider.compareInDays(
      this.dateProvider.dateNow(),
      rental.start_date,
    );

    if (daily <= 0) {
      daily = 1;
    }

    const delay = this.dateProvider.compareInDays(
      rental.expected_return_date,
      this.dateProvider.dateNow(),
    );

    console.log(delay);

    if (delay > 0) {
      const calculateFine = delay * car.fine_amount;
      total += calculateFine;
    }

    total += daily * car.daily_rate;

    rental.end_date = this.dateProvider.dateNow();
    rental.total = total;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailability(car.id, true);

    return rental;
  }
}

export { DevolutionRentalUseCase };
