import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { MembersService } from './members.service';
import { getRepositoryToken } from '@nestjs/typeorm';
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
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    guildUsername: 'TestUser',
    xp: '100.00',
    level: 1,
    communityRole: 'Member',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
    uuidGuild: '123e4567-e89b-12d3-a456-426614174001',
    uuidDiscord: '123e4567-e89b-12d3-a456-426614174002',
    guild: null,
    roles: []
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
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    repository = module.get<Repository<Member>>(getRepositoryToken(Member));
  });

  describe('create', () => {
    it('devrait créer un nouveau membre', async () => {
      const createMemberDto = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        guildUsername: 'TestUser',
        xp: '100.00',
        level: 1,
        communityRole: 'Member',
        status: 'Active',
        uuidGuild: '123e4567-e89b-12d3-a456-426614174001',
        uuidDiscord: '123e4567-e89b-12d3-a456-426614174002'
      };

      mockRepository.create.mockReturnValue(mockMember);
      mockRepository.save.mockResolvedValue(mockMember);

      const result = await service.create(createMemberDto);

      expect(result).toEqual(mockMember);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createMemberDto,
        guild_username: createMemberDto.guildUsername,
        community_role: createMemberDto.communityRole,
        uuid_guild: createMemberDto.uuidGuild,
        uuid_discord: createMemberDto.uuidDiscord
      });
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

      const result = await service.findOne(mockMember.uuid);

      expect(result).toEqual(mockMember);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuid: mockMember.uuid });
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
        guildUsername: 'UpdatedUser',
        status: 'Inactive'
      };
      const updatedMember = { ...mockMember, ...updateMemberDto };

      mockRepository.findOneBy.mockResolvedValue(mockMember);
      mockRepository.save.mockResolvedValue(updatedMember);

      const result = await service.update(mockMember.uuid, updateMemberDto);

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

      await service.remove(mockMember.uuid);

      expect(mockRepository.delete).toHaveBeenCalledWith({ uuid: mockMember.uuid });
    });

    it('devrait lancer une erreur si le membre à supprimer n\'existe pas', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('non-existent-uuid'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
