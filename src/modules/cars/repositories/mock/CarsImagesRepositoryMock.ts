import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';

import { ICarsImagesRepository } from '../ICarsImagesRepository';

class CarsImagesRepositoryMock implements ICarsImagesRepository {
  carsImages: CarImage[] = [];

  async create(car_id: string, image_name: string): Promise<CarImage> {
    const carImage = new CarImage();

    Object.assign(carImage, {
      car_id,
      image_name,
    });

    this.carsImages.push(carImage);
    return carImage;
  }
}

export { CarsImagesRepositoryMock };
