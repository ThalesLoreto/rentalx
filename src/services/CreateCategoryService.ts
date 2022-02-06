import { CategoriesRepository } from '../repositories/CategoriesRepository';

interface IRequest {
  name: string;
  description: string;
}

class CreateCategoryService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  execute({ name, description }: IRequest) {
    const repositoryAlreadyExists = this.categoriesRepository.findByName(name);
    if (repositoryAlreadyExists) {
      throw new Error('Category already exists.');
    }

    this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryService };
