import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GuildsController } from './guilds.controller';
import { GuildsService } from './guilds.service';
import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';

const mockGuildService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

describe('GuildController', () => {
  let controller: GuildsController;

  beforeEach(() => {
    controller = new GuildsController(mockGuildService as unknown as GuildsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new guild', async () => {
    const dto: CreateGuildDto = {
      uuid: '123456789012345678',
      name: 'Test Guild',
      memberCount: '10',
      configuration: {},
    };
    mockGuildService.create.mockResolvedValue(dto);
    expect(await controller.create(dto)).toEqual(dto);
    expect(mockGuildService.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of guilds', async () => {
    const result = [{ uuid: '123456789012345678', name: 'Test Guild', memberCount: '10', configuration: {} }];
    mockGuildService.findAll.mockResolvedValue(result);
    expect(await controller.findAll()).toEqual(result);
    expect(mockGuildService.findAll).toHaveBeenCalled();
  });

  it('should return a single guild', async () => {
    const result = { uuid: '123456789012345678', name: 'Test Guild', memberCount: '10', configuration: {} };
    mockGuildService.findOne.mockResolvedValue(result);
    expect(await controller.findOne('123456789012345678')).toEqual(result);
    expect(mockGuildService.findOne).toHaveBeenCalledWith('123456789012345678');
  });

  it('should update a guild', async () => {
    const dto: UpdateGuildDto = {
      name: 'Updated Guild',
      memberCount: '15',
      configuration: { setting: true },
    };
    const result = { uuid: '123456789012345678', name: 'Updated Guild', memberCount: '15', configuration: { setting: true } };
    mockGuildService.update.mockResolvedValue(result);
    expect(await controller.update('123456789012345678', dto)).toEqual(result);
    expect(mockGuildService.update).toHaveBeenCalledWith('123456789012345678', dto);
  });

  it('should delete a guild', async () => {
    mockGuildService.remove.mockResolvedValue({ affected: 1 });
    expect(await controller.remove('123456789012345678')).toEqual({ affected: 1 });
    expect(mockGuildService.remove).toHaveBeenCalledWith('123456789012345678');
  });
});
