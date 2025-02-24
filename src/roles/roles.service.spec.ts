import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('RolesService', () => {
  let service: RolesService;
  let repository: Repository<Role>;

  const mockRole: Role = {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Role',
    member_count: '10',
    role_position: '1',
    hoist: true,
    color: '#FF0000',
    createdAt: new Date(),
    updatedAt: new Date(),
    uuidGuild: '123e4567-e89b-12d3-a456-426614174001',
    guild: null
  };

  const mockRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOneBy: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  describe('create', () => {
    it('devrait créer un nouveau rôle', async () => {
      const createRoleDto = {
        name: 'Test Role',
        member_count: '10',
        role_position: '1',
        hoist: true,
        color: '#FF0000',
        uuidGuild: '123e4567-e89b-12d3-a456-426614174001'
      };

      mockRepository.create.mockReturnValue(mockRole);
      mockRepository.save.mockResolvedValue(mockRole);

      const result = await service.create(createRoleDto);

      expect(result).toEqual(mockRole);
      expect(mockRepository.create).toHaveBeenCalledWith(createRoleDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockRole);
    });
  });

  describe('findAll', () => {
    it('devrait retourner un tableau de rôles', async () => {
      const roles = [mockRole];
      mockRepository.find.mockResolvedValue(roles);

      const result = await service.findAll();

      expect(result).toEqual(roles);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devrait retourner un rôle par son uuid', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockRole);

      const result = await service.findOne(mockRole.uuid);

      expect(result).toEqual(mockRole);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuid: mockRole.uuid });
    });

    it('devrait lancer une erreur si le rôle n\'est pas trouvé', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('non-existent-uuid'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un rôle', async () => {
      const updateRoleDto = {
        name: 'Updated Role',
        color: '#00FF00'
      };
      const updatedRole = { ...mockRole, ...updateRoleDto };

      mockRepository.findOneBy.mockResolvedValue(mockRole);
      mockRepository.save.mockResolvedValue(updatedRole);

      const result = await service.update(mockRole.uuid, updateRoleDto);

      expect(result).toEqual(updatedRole);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('devrait lancer une erreur si le rôle à mettre à jour n\'existe pas', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update('non-existent-uuid', {}))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('devrait supprimer un rôle', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(mockRole.uuid);

      expect(mockRepository.delete).toHaveBeenCalledWith({ uuid: mockRole.uuid });
    });

    it('devrait lancer une erreur si le rôle à supprimer n\'existe pas', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('non-existent-uuid'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
