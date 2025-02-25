import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GuildsService } from './guilds.service';
import { Repository } from 'typeorm';
import { Guild } from './entities/guild.entity';
import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';
import { Course } from '../courses/entities/course.entity';
import { Member } from '../members/entities/member.entity';
import { Role } from '../roles/entities/role.entity';
import { Channel } from '../channels/entities/channel.entity';
import { Category } from '../categories/entities/category.entity';
import { Campus } from '../campuses/entities/campus.entity';
import { Promotion } from '../promotions/entities/promotion.entity';
import { GuildTemplate } from '../guilds-templates/entities/guild-template.entity';

const mockRepository = {
  create: vi.fn(),
  save: vi.fn(),
  find: vi.fn(),
  findOneBy: vi.fn(),
  findOne: vi.fn(),
  delete: vi.fn(),
};

describe('GuildsService', () => {
  let service: GuildsService;

  const mockGuild = {
    uuid: '123456789012345678',
    name: 'Test Guild',
    memberCount: '10',
    configuration: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCourse = {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Course',
    isCertified: true,
  };

  const mockMember = {
    uuidMember: '123e4567-e89b-12d3-a456-426614174001',
    guildUsername: 'TestUser',
    xp: '100.00',
    level: 1,
  };

  const mockRole = {
    uuidRole: '234567890123456789',
    name: 'Test Role',
    memberCount: 1,
  };

  beforeEach(() => {
    service = new GuildsService(mockRepository as unknown as Repository<Guild>);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new guild', async () => {
      const dto: CreateGuildDto = {
        uuid: '123456789012345678',
        name: 'Test Guild',
        memberCount: '10',
        configuration: {},
      };
      const entity = { ...dto };
      mockRepository.create.mockReturnValue(entity);
      mockRepository.save.mockResolvedValue(entity);

      expect(await service.create(dto)).toEqual(entity);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(entity);
    });
  });

  describe('findAll', () => {
    it('should return an array of guilds with relations', async () => {
      const guildWithRelations = {
        ...mockGuild,
        course: mockCourse,
        members: [mockMember],
        roles: [mockRole],
      };
      mockRepository.find.mockResolvedValue([guildWithRelations]);
      
      const result = await service.findAll();
      
      expect(result).toEqual([guildWithRelations]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['course', 'members', 'roles', 'channels', 'categories', 'campus', 'promotions', 'template']
      });
    });
  });

  describe('findOne', () => {
    it('should return a single guild with relations', async () => {
      const guildWithRelations = {
        ...mockGuild,
        course: mockCourse,
        members: [mockMember],
        roles: [mockRole],
      };
      mockRepository.findOne.mockResolvedValue(guildWithRelations);

      const result = await service.findOne('123456789012345678');

      expect(result).toEqual(guildWithRelations);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: '123456789012345678' },
        relations: ['course', 'members', 'roles', 'channels', 'categories', 'campus', 'promotions', 'template']
      });
    });
  });

  describe('update', () => {
    it('should update a guild and maintain relations', async () => {
      const dto: UpdateGuildDto = {
        name: 'Updated Guild',
        memberCount: '15',
        configuration: { setting: true },
      };
      const existingGuild = {
        ...mockGuild,
        course: mockCourse,
        members: [mockMember],
        roles: [mockRole],
      };
      const updatedGuild = { ...existingGuild, ...dto };

      mockRepository.findOne.mockResolvedValue(existingGuild);
      mockRepository.save.mockResolvedValue(updatedGuild);

      const result = await service.update('123456789012345678', dto);

      expect(result).toEqual(updatedGuild);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: '123456789012345678' },
        relations: ['course', 'members', 'roles', 'channels', 'categories', 'campus', 'promotions', 'template']
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedGuild);
    });
  });

  describe('remove', () => {
    it('should delete a guild and cascade delete related entities', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove('123456789012345678');
      expect(mockRepository.delete).toHaveBeenCalledWith({ uuid: '123456789012345678' });
    });
  });
});
