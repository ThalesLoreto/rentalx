import { getRepository, Repository } from 'typeorm';

import {
  ISpecificationsRepository,
  ISpecificationsRepositoryDTO,
} from '../../../repositories/ISpecificationsRepository';
import { Specification } from '../entities/Specification';

class SpecificationsRepository implements ISpecificationsRepository {
  private repository: Repository<Specification>;

  constructor() {
    this.repository = getRepository(Specification);
  }

  async create(data: ISpecificationsRepositoryDTO): Promise<Specification> {
    const { name, description } = data;
    const specification = this.repository.create({
      name,
      description,
    });

    await this.repository.save(specification);
    return specification;
  }

  async findByName(name: string): Promise<Specification | undefined> {
    const specification = await this.repository.findOne({ name });
    return specification;
  }

  async findByIds(specification_ids: string[]): Promise<Specification[]> {
    const specifications = await this.repository.findByIds(specification_ids);
    return specifications;
  }
}

export { SpecificationsRepository };
