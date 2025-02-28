import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CampusesService as CampusesService } from './campuses.service';
import { Repository } from 'typeorm';
import { Campus } from './entities/campus.entity';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { Role } from '../roles/entities/role.entity';

const mockRoleRepository = {
  create: vi.fn(),
  save: vi.fn(),
};

const mockRepository = {
  create: vi.fn(),
  save: vi.fn(),
  find: vi.fn(),
  findOneBy: vi.fn(),
  delete: vi.fn(),
};

describe('CampusesService', () => {
  let service: CampusesService;

  beforeEach(() => {
    service = new CampusesService(
      mockRepository as unknown as Repository<Campus>,
      mockRoleRepository as unknown as Repository<Role>
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new campus', async () => {
    const dto: CreateCampusDto = { 
      name: 'Test Campus',
      uuidGuild: '123456789012345678',
      uuidRole: '234567890123456789'
    };
    
    const mockRole = {
      uuidRole: '234567890123456789',
      uuidGuild: '123456789012345678',
      name: 'Test Campus',
      memberCount: 0,
      rolePosition: 0,
      hoist: false,
      color: "#000000",
    };
    
    const entity = { 
      uuidCampus: '123e4567-e89b-12d3-a456-426614174000', 
      ...dto 
    };
    
    mockRoleRepository.create.mockReturnValue(mockRole);
    mockRoleRepository.save.mockResolvedValue(mockRole);
    mockRepository.create.mockReturnValue(entity);
    mockRepository.save.mockResolvedValue(entity);

    expect(await service.create(dto)).toEqual(entity);
    expect(mockRoleRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      uuidRole: dto.uuidRole,
      uuidGuild: dto.uuidGuild,
      name: dto.name
    }));
    expect(mockRoleRepository.save).toHaveBeenCalledWith(mockRole);
    expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      ...dto,
      uuidRole: mockRole.uuidRole
    }));
    expect(mockRepository.save).toHaveBeenCalledWith(entity);
  });

  it('should return an array of campuses', async () => {
    const result = [{ uuidCampus: '123e4567-e89b-12d3-a456-426614174000', name: 'Test Campus' }];
    mockRepository.find.mockResolvedValue(result);
    expect(await service.findAll()).toEqual(result);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should return a single campus', async () => {
    const result = { uuidCampus: '123e4567-e89b-12d3-a456-426614174000', name: 'Test Campus' };
    mockRepository.findOneBy.mockResolvedValue(result);
    expect(await service.findOne('123e4567-e89b-12d3-a456-426614174000')).toEqual(result);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuidCampus: '123e4567-e89b-12d3-a456-426614174000' });
  });

  it('should update a campus', async () => {
    const dto: UpdateCampusDto = { name: 'Updated Campus' };
    const result = { uuidCampus: '123e4567-e89b-12d3-a456-426614174000', name: 'Updated Campus' };
    mockRepository.findOneBy.mockResolvedValue(result);
    mockRepository.save.mockResolvedValue(result);

    expect(await service.update('123e4567-e89b-12d3-a456-426614174000', dto)).toEqual(result);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuidCampus: '123e4567-e89b-12d3-a456-426614174000' });
    expect(mockRepository.save).toHaveBeenCalledWith(result);
  });

  it('should delete a campus', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });
    expect(await service.remove('123e4567-e89b-12d3-a456-426614174000')).toEqual({ affected: 1 });
    expect(mockRepository.delete).toHaveBeenCalledWith({ uuidCampus: '123e4567-e89b-12d3-a456-426614174000' });
  });
});