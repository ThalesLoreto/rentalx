import { Specification } from '../../entities/Specification';
import {
  ISpecificationsRepository,
  ISpecificationsRepositoryDTO,
} from '../ISpecificationsRepository';

class SpecificationsRepository implements ISpecificationsRepository {
  specifications: Specification[];

  private static INSTANCE: SpecificationsRepository;

  private constructor() {
    this.specifications = [];
  }

  public static getInstance(): SpecificationsRepository {
    if (!SpecificationsRepository.INSTANCE) {
      SpecificationsRepository.INSTANCE = new SpecificationsRepository();
    }
    return SpecificationsRepository.INSTANCE;
  }

  create({ name, description }: ISpecificationsRepositoryDTO): void {
    const specification = new Specification();

    Object.assign(specification, {
      name,
      description,
      created_at: new Date(),
    });

    this.specifications.push(specification);
  }

  findByName(name: string): Specification | undefined {
    const specification = this.specifications.find(spec => spec.name === name);
    return specification;
  }
}

export { SpecificationsRepository };
