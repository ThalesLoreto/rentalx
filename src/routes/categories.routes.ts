import { Router } from 'express';

import { CategoriesRepository } from '../repositories/CategoriesRepository';

const categoriesRoutes = Router();
const categoriesRepository = new CategoriesRepository();

categoriesRoutes.post('/', (req, res) => {
  const { name, description } = req.body;

  const repositoryAlreadyExists = categoriesRepository.findByName(name);
  if (repositoryAlreadyExists) {
    return res.status(400).json({ error: 'Category already exists.' });
  }

  categoriesRepository.create({ name, description });

  return res.status(201).send();
});

categoriesRoutes.get('/', (req, res) => {
  const categories = categoriesRepository.list();
  return res.json(categories);
});

export { categoriesRoutes };
