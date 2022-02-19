import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IListCarsDTO } from '@modules/cars/dtos/IListCarsDTO';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

class ListAvailableCarsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, brand, category_id }: IListCarsDTO = req.query;

    const listAvailableCarsUseCase = container.resolve(
      ListAvailableCarsUseCase,
    );

    const cars = await listAvailableCarsUseCase.execute({
      name,
      brand,
      category_id,
    });

    return res.json(cars);
  }
}

export { ListAvailableCarsController };
