import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ICreateCarSpecificationsDTO } from '@modules/cars/dtos/ICreateCarSpecificationsDTO';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

class CreateCarSpecificationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { specifications_id } = req.body;

    const data: ICreateCarSpecificationsDTO = {
      car_id: id,
      specifications_id,
    };

    const createCarSpecificationUseCase = container.resolve(
      CreateCarSpecificationUseCase,
    );

    const cars = await createCarSpecificationUseCase.execute(data);

    return res.status(201).json(cars);
  }
}

export { CreateCarSpecificationController };
