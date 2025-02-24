import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { Guild } from '../guilds/entities/guild.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('MembersService', () => {
  let service: MembersService;
  let repository: Repository<Member>;

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
    guild: mockGuild
  };

  const mockRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOneBy: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    repository = mockRepository as unknown as Repository<Member>;
    service = new MembersService(repository);
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

      mockRepository.create.mockReturnValue(mockMember);
      mockRepository.save.mockResolvedValue(mockMember);

      const result = await service.create(createMemberDto);

      expect(result).toEqual(mockMember);
      expect(mockRepository.create).toHaveBeenCalledWith(createMemberDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockMember);
    });
  });

  describe('findAll', () => {
    it('devrait retourner un tableau de membres', async () => {
      const members = [mockMember];
      mockRepository.find.mockResolvedValue(members);

      const result = await service.findAll();

      expect(result).toEqual(members);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devrait retourner un membre par son uuid', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockMember);

      const result = await service.findOne(mockMember.uuidMember);

      expect(result).toEqual(mockMember);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuid: mockMember.uuidMember });
    });

    it('devrait lancer une erreur si le membre n\'est pas trouvé', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

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

      mockRepository.findOneBy.mockResolvedValue(mockMember);
      mockRepository.save.mockResolvedValue(updatedMember);

      const result = await service.update(mockMember.uuidMember, updateMemberDto);

      expect(result).toEqual(updatedMember);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('devrait lancer une erreur si le membre à mettre à jour n\'existe pas', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update('non-existent-uuid', {}))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('devrait supprimer un membre', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(mockMember.uuidMember);

      expect(mockRepository.delete).toHaveBeenCalledWith({ uuid: mockMember.uuidMember });
    });

    it('devrait lancer une erreur si le membre à supprimer n\'existe pas', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('non-existent-uuid'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
