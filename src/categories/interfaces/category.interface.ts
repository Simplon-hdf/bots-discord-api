import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

export interface ICategoriesService {
  create(createCategoryDto: CreateCategoryDto);
  findAll();
  findOne(uuid: string);
  update(uuid: string, updateCategoryDto: UpdateCategoryDto);
  remove(uuid: string);
}

export const ICategoriesServiceToken = Symbol('ICategoriesService');
