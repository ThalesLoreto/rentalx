import { ICreateCarDTO } from '../dtos/ICreateCarDTO';
import { IListCarsDTO } from '../dtos/IListCarsDTO';
import { Car } from '../infra/typeorm/entities/Car';

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car | undefined>;
  listAllAvailable(filters: IListCarsDTO): Promise<Car[]>;
}

export { ICarsRepository };
