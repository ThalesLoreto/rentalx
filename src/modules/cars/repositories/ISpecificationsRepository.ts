import { Specification } from '../infra/typeorm/entities/Specification';

interface ISpecificationsRepositoryDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  create(data: ISpecificationsRepositoryDTO): Promise<Specification>;
  findByName(name: string): Promise<Specification | undefined>;
  findByIds(specification_ids: string[]): Promise<Specification[]>;
}

export { ISpecificationsRepository, ISpecificationsRepositoryDTO };
