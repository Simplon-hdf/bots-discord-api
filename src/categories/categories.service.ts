import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { Category } from './entities/category.entity';
import { ICategoriesService } from './interfaces/category.interface';

@Injectable()
export class CategoriesService implements ICategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find({
      relations: {
        guild: true,
        channels: true,
        course: true,
        promotion: true,
        guildTemplate: true,
      },
    });
  }

  findOne(uuid: string) {
    return this.categoryRepository.findOne({
      where: { uuid },
      relations: {
        guild: true,
        channels: true,
        course: true,
        promotion: true,
        guildTemplate: true,
      },
    });
  }

  async update(uuid: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ uuid });
    if (!category) {
      return null;
    }

    // Mise à jour des champs autorisés uniquement
    const { name, position, uuidGuildTemplate } = updateCategoryDto;
    if (name !== undefined) category.name = name;
    if (position !== undefined) category.position = position;
    if (uuidGuildTemplate !== undefined)
      category.uuidGuildTemplate = uuidGuildTemplate;

    category.updatedAt = new Date();
    return this.categoryRepository.save(category);
  }

  remove(uuid: string) {
    return this.categoryRepository.delete({ uuid });
  }
}
