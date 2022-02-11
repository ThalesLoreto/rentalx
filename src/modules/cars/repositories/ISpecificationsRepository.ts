import { Specification } from '../entities/Specification';

interface ISpecificationsRepositoryDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  create({ name, description }: ISpecificationsRepositoryDTO): void;
  findByName(name: string): Specification | undefined;
}

export { ISpecificationsRepository, ISpecificationsRepositoryDTO };
