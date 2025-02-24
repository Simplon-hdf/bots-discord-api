import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const mockCategoriesService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(() => {
    controller = new CategoriesController(mockCategoriesService as unknown as CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new category', async () => {
    const dto: CreateCategoryDto = {
      uuid: '123456789012345678',
      uuidGuild: '987654321098765432',
      name: 'Test Category',
      position: 1,
    };
    const result = { ...dto };
    mockCategoriesService.create.mockResolvedValue(result);
    expect(await controller.create(dto)).toEqual(result);
    expect(mockCategoriesService.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of categories', async () => {
    const result = [{ uuid: '123456789012345678', uuidGuild: '987654321098765432', name: 'Test Category', position: 1 }];
    mockCategoriesService.findAll.mockResolvedValue(result);
    expect(await controller.findAll()).toEqual(result);
    expect(mockCategoriesService.findAll).toHaveBeenCalled();
  });

  it('should return a single category', async () => {
    const result = { uuid: '123456789012345678', uuidGuild: '987654321098765432', name: 'Test Category', position: 1 };
    mockCategoriesService.findOne.mockResolvedValue(result);
    expect(await controller.findOne('123456789012345678')).toEqual(result);
    expect(mockCategoriesService.findOne).toHaveBeenCalledWith('123456789012345678');
  });

  it('should update a category', async () => {
    const dto: UpdateCategoryDto = { name: 'Updated Category', position: 2 };
    const result = { uuid: '123456789012345678', uuidGuild: '987654321098765432', name: 'Updated Category', position: 2 };
    mockCategoriesService.update.mockResolvedValue(result);
    expect(await controller.update('123456789012345678', dto)).toEqual(result);
    expect(mockCategoriesService.update).toHaveBeenCalledWith('123456789012345678', dto);
  });

  it('should delete a category', async () => {
    mockCategoriesService.remove.mockResolvedValue({ affected: 1 });
    expect(await controller.remove('123456789012345678')).toEqual({ affected: 1 });
    expect(mockCategoriesService.remove).toHaveBeenCalledWith('123456789012345678');
  });
});
