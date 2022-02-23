import { Specification } from '../../infra/typeorm/entities/Specification';
import {
  ISpecificationsRepository,
  ISpecificationsRepositoryDTO,
} from '../ISpecificationsRepository';

class SpecificationsRepositoryMock implements ISpecificationsRepository {
  specifications: Specification[] = [];

  async create(data: ISpecificationsRepositoryDTO): Promise<Specification> {
    const { description, name } = data;

    const specification = new Specification();

    Object.assign(specification, {
      name,
      description,
    });

    this.specifications.push(specification);

    return specification;
  }

  async findByName(name: string): Promise<Specification | undefined> {
    return this.specifications.find(spec => spec.name === name);
  }

  async findByIds(specification_ids: string[]): Promise<Specification[]> {
    return this.specifications.filter(spec =>
      specification_ids.includes(spec.id),
    );
  }
}

export { SpecificationsRepositoryMock };
