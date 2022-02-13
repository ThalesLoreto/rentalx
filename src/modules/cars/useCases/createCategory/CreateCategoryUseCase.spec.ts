import { AppError } from '../../../../errors/AppError';
import { CategoriesRepositoryMock } from '../../repositories/mock/CategoriesRepositoryMock';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

let categoriesRepositoryMock: CategoriesRepositoryMock;
let createCategoryUseCase: CreateCategoryUseCase;

describe('Create Category', () => {
  beforeEach(() => {
    categoriesRepositoryMock = new CategoriesRepositoryMock();
    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepositoryMock);
  });

  it('should be able to create a new category', async () => {
    const category = {
      name: 'Category Test',
      description: 'Category test Description',
    };
    await createCategoryUseCase.execute(category);

    const createdCategory = await categoriesRepositoryMock.findByName(
      category.name,
    );

    expect(createdCategory).toHaveProperty('id');
  });

  it('should not be able to create an exists category', async () => {
    expect(async () => {
      const category = {
        name: 'Category Test',
        description: 'Category test Description',
      };
      await createCategoryUseCase.execute(category);
      // Create again with same name
      await createCategoryUseCase.execute(category);
    }).rejects.toBeInstanceOf(AppError);
  });
});
