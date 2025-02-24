import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoriesService } from './categories.service';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const mockRepository = {
  create: vi.fn(),
  save: vi.fn(),
  find: vi.fn(),
  findOneBy: vi.fn(),
  delete: vi.fn(),
};

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(() => {
    service = new CategoriesService(mockRepository as unknown as Repository<Category>);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new category', async () => {
    const dto: CreateCategoryDto = {
      uuid: '123456789012345678',
      uuidGuild: '987654321098765432',
      name: 'Test Category',
      position: 1,
    };
    const entity = { ...dto };
    mockRepository.create.mockReturnValue(entity);
    mockRepository.save.mockResolvedValue(entity);

    expect(await service.create(dto)).toEqual(entity);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
    expect(mockRepository.save).toHaveBeenCalledWith(entity);
  });

  it('should return an array of categories', async () => {
    const result = [{ uuid: '123456789012345678', uuidGuild: '987654321098765432', name: 'Test Category', position: 1 }];
    mockRepository.find.mockResolvedValue(result);
    expect(await service.findAll()).toEqual(result);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should return a single category', async () => {
    const result = { uuid: '123456789012345678', uuidGuild: '987654321098765432', name: 'Test Category', position: 1 };
    mockRepository.findOneBy.mockResolvedValue(result);
    expect(await service.findOne('123456789012345678')).toEqual(result);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuid: '123456789012345678' });
  });

  it('should update a category', async () => {
    const dto: UpdateCategoryDto = { name: 'Updated Category', position: 2 };
    const result = { uuid: '123456789012345678', uuidGuild: '987654321098765432', name: 'Updated Category', position: 2 };
    mockRepository.findOneBy.mockResolvedValue(result);
    mockRepository.save.mockResolvedValue(result);

    expect(await service.update('123456789012345678', dto)).toEqual(result);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuid: '123456789012345678' });
    expect(mockRepository.save).toHaveBeenCalledWith(result);
  });

  it('should delete a category', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });
    expect(await service.remove('123456789012345678')).toEqual({ affected: 1 });
    expect(mockRepository.delete).toHaveBeenCalledWith({ uuid: '123456789012345678' });
  });
});
