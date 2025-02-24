import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Guild } from '../guilds/entities/guild.entity';

describe('RolesController', () => {
  let controller: RolesController;
  let rolesService: RolesService;

  const mockGuild: Guild = {
    uuid: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Test Guild',
    memberCount: 10,
    configuration: {},
    createdAt: new Date(),
    updatedAt: new Date()
  };

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
    guild: mockGuild
  };

  beforeEach(() => {
    rolesService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    } as unknown as RolesService;

    controller = new RolesController(rolesService);
  });

  describe('create', () => {
    it('devrait créer un nouveau rôle', async () => {
      const createRoleDto: CreateRoleDto = {
        uuidRole: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Role',
        member_count: '10',
        role_position: '1',
        hoist: true,
        color: '#FF0000',
        uuidGuild: '123e4567-e89b-12d3-a456-426614174001'
      };

      vi.mocked(rolesService.create).mockResolvedValue(mockRole);

      const result = await controller.create(createRoleDto);

      expect(result).toEqual(mockRole);
      expect(rolesService.create).toHaveBeenCalledWith(createRoleDto);
    });
  });

  describe('findAll', () => {
    it('devrait retourner un tableau de rôles', async () => {
      const roles = [mockRole];
      vi.mocked(rolesService.findAll).mockResolvedValue(roles);

      const result = await controller.findAll();

      expect(result).toEqual(roles);
      expect(rolesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devrait retourner un rôle par son uuid', async () => {
      vi.mocked(rolesService.findOne).mockResolvedValue(mockRole);

      const result = await controller.findOne(mockRole.uuid);

      expect(result).toEqual(mockRole);
      expect(rolesService.findOne).toHaveBeenCalledWith(mockRole.uuid);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un rôle', async () => {
      const updateRoleDto: UpdateRoleDto = {
        name: 'Updated Role',
        color: '#00FF00'
      };
      const updatedRole = { ...mockRole, ...updateRoleDto };

      vi.mocked(rolesService.update).mockResolvedValue(updatedRole);

      const result = await controller.update(mockRole.uuid, updateRoleDto);

      expect(result).toEqual(updatedRole);
      expect(rolesService.update).toHaveBeenCalledWith(mockRole.uuid, updateRoleDto);
    });
  });

  describe('remove', () => {
    it('devrait supprimer un rôle', async () => {
      vi.mocked(rolesService.remove).mockResolvedValue(undefined);

      const result = await controller.remove(mockRole.uuid);

      expect(result).toBeUndefined();
      expect(rolesService.remove).toHaveBeenCalledWith(mockRole.uuid);
    });
  });
});
