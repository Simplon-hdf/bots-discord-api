import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { Guild } from '../guilds/entities/guild.entity';

describe('MembersController', () => {
  let controller: MembersController;
  let membersService: MembersService;

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
    guild: mockGuild,
    roles: []
  };

  beforeEach(() => {
    membersService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    } as unknown as MembersService;

    controller = new MembersController(membersService);
  });

  describe('create', () => {
    it('devrait créer un nouveau membre', async () => {
      const createMemberDto: CreateMemberDto = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        guildUsername: 'TestUser',
        xp: '100.00',
        level: 1,
        communityRole: 'Member',
        status: 'Active',
        uuidGuild: '123e4567-e89b-12d3-a456-426614174001',
        uuidDiscord: '123e4567-e89b-12d3-a456-426614174002'
      };

      vi.mocked(membersService.create).mockResolvedValue(mockMember);

      const result = await controller.create(createMemberDto);

      expect(result).toEqual(mockMember);
      expect(membersService.create).toHaveBeenCalledWith(createMemberDto);
    });
  });

  describe('findAll', () => {
    it('devrait retourner un tableau de membres', async () => {
      const members = [mockMember];
      vi.mocked(membersService.findAll).mockResolvedValue(members);

      const result = await controller.findAll();

      expect(result).toEqual(members);
      expect(membersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devrait retourner un membre par son uuid', async () => {
      vi.mocked(membersService.findOne).mockResolvedValue(mockMember);

      const result = await controller.findOne(mockMember.uuid);

      expect(result).toEqual(mockMember);
      expect(membersService.findOne).toHaveBeenCalledWith(mockMember.uuid);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un membre', async () => {
      const updateMemberDto: UpdateMemberDto = {
        guildUsername: 'UpdatedUser',
        status: 'Inactive'
      };
      const updatedMember = { ...mockMember, ...updateMemberDto };

      vi.mocked(membersService.update).mockResolvedValue(updatedMember);

      const result = await controller.update(mockMember.uuid, updateMemberDto);

      expect(result).toEqual(updatedMember);
      expect(membersService.update).toHaveBeenCalledWith(mockMember.uuid, updateMemberDto);
    });
  });

  describe('remove', () => {
    it('devrait supprimer un membre', async () => {
      vi.mocked(membersService.remove).mockResolvedValue(undefined);

      const result = await controller.remove(mockMember.uuid);

      expect(result).toBeUndefined();
      expect(membersService.remove).toHaveBeenCalledWith(mockMember.uuid);
    });
  });
});
