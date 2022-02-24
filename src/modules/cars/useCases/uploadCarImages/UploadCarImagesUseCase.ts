import { inject, injectable } from 'tsyringe';

import { ICreateCarImageDTO } from '@modules/cars/dtos/ICreateCarImageDTO';
import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository,
  ) {}

  async execute(data: ICreateCarImageDTO): Promise<void> {
    const { car_id, images_name } = data;

    images_name.map(async image => {
      await this.carsImagesRepository.create(car_id, image);
    });
  }
}

export { UploadCarImagesUseCase };
