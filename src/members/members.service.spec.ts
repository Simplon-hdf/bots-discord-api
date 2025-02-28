import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { Guild } from '../guilds/entities/guild.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../roles/entities/role.entity';

describe('MembersService', () => {
  let service: MembersService;
  let membersRepository: Repository<Member>;
  let rolesRepository: Repository<Role>;

  const mockGuild: Guild = {
    uuid: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Test Guild',
    memberCount: 10,
    configuration: {},
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockMember: Member = {
    uuidMember: '123e4567-e89b-12d3-a456-426614174000',
    guild_username: 'TestUser',
    xp: '100.00',
    level: 1,
    community_role: 'Member',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
    uuidDiscord: '123e4567-e89b-12d3-a456-426614174002',
    guild: mockGuild,
    roles: []
  };

  const mockMembersRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    delete: vi.fn(),
    manager: {
      query: vi.fn()
    }
  };

  const mockRolesRepository = {
    findOne: vi.fn(),
    save: vi.fn()
  };

  beforeEach(() => {
    membersRepository = mockMembersRepository as unknown as Repository<Member>;
    rolesRepository = mockRolesRepository as unknown as Repository<Role>;
    service = new MembersService(membersRepository, rolesRepository);
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('devrait créer un nouveau membre', async () => {
      const createMemberDto = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        guild_username: 'TestUser',
        xp: '100.00',
        level: 1,
        community_role: 'Member',
        status: 'Active',
        uuidGuild: '123e4567-e89b-12d3-a456-426614174001',
        uuidDiscord: '123e4567-e89b-12d3-a456-426614174002'
      };

      mockMembersRepository.create.mockReturnValue(mockMember);
      mockMembersRepository.save.mockResolvedValue(mockMember);

      const result = await service.create(createMemberDto);

      expect(result).toEqual(mockMember);
      expect(mockMembersRepository.create).toHaveBeenCalledWith(createMemberDto);
      expect(mockMembersRepository.save).toHaveBeenCalledWith(mockMember);
    });
  });

  describe('findAll', () => {
    it('devrait retourner un tableau de membres', async () => {
      const members = [mockMember];
      mockMembersRepository.find.mockResolvedValue(members);

      const result = await service.findAll();

      expect(result).toEqual(members);
      expect(mockMembersRepository.find).toHaveBeenCalledWith({
        relations: ['resources']
      });
    });
  });

  describe('findOne', () => {
    it('devrait retourner un membre par son uuid', async () => {
      mockMembersRepository.findOne.mockResolvedValue(mockMember);

      const result = await service.findOne(mockMember.uuidMember);

      expect(result).toEqual(mockMember);
      expect(mockMembersRepository.findOne).toHaveBeenCalledWith({
        where: { uuidMember: mockMember.uuidMember },
        relations: ['resources']
      });
    });

    it('devrait lancer une erreur si le membre n\'est pas trouvé', async () => {
      mockMembersRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-uuid'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un membre', async () => {
      const updateMemberDto = {
        guild_username: 'UpdatedUser',
        status: 'Inactive'
      };
      const updatedMember = { ...mockMember, ...updateMemberDto };

      mockMembersRepository.findOne.mockResolvedValue(mockMember);
      mockMembersRepository.save.mockResolvedValue(updatedMember);

      const result = await service.update(mockMember.uuidMember, updateMemberDto);

      expect(result).toEqual(updatedMember);
      expect(mockMembersRepository.save).toHaveBeenCalled();
    });

    it('devrait lancer une erreur si le membre à mettre à jour n\'existe pas', async () => {
      mockMembersRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent-uuid', {}))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('devrait supprimer un membre', async () => {
      mockMembersRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(mockMember.uuidMember);

      expect(mockMembersRepository.delete).toHaveBeenCalledWith({ uuidMember: mockMember.uuidMember });
    });

    it('devrait lancer une erreur si le membre à supprimer n\'existe pas', async () => {
      mockMembersRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('non-existent-uuid'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
