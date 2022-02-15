import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateCarUseCase } from './CreateCarUseCase';

class CreateCarController {
  async handle(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    const createCarUseCase = container.resolve(CreateCarUseCase);

    const car = await createCarUseCase.execute(data);

    return res.status(201).json(car);
  }
}

export { CreateCarController };
