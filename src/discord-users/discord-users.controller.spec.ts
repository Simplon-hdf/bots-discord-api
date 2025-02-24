import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DiscordUsersController } from './discord-users.controller';
import { DiscordUsersService } from './discord-users.service';
import { CreateDiscordUserDto } from './dto/create-discord-user.dto';
import { UpdateDiscordUserDto } from './dto/update-discord-user.dto';
import { NotFoundException } from '@nestjs/common';

const mockDiscordUsersService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

describe('DiscordUsersController', () => {
  let controller: DiscordUsersController;

  beforeEach(() => {
    controller = new DiscordUsersController(mockDiscordUsersService as unknown as DiscordUsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new discord user', async () => {
    const dto: CreateDiscordUserDto = {
      uuidDiscord: '123456789012345678',
      discordUsername: 'JohnDoe#1234',
      discriminator: '1234',
    };
    mockDiscordUsersService.create.mockResolvedValue(dto);
    expect(await controller.create(dto)).toEqual(dto);
    expect(mockDiscordUsersService.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of discord users', async () => {
    const result = [{ uuidDiscord: '123456789012345678', discordUsername: 'JohnDoe#1234', discriminator: '1234' }];
    mockDiscordUsersService.findAll.mockResolvedValue(result);
    expect(await controller.findAll()).toEqual(result);
    expect(mockDiscordUsersService.findAll).toHaveBeenCalled();
  });

  it('should return a single discord user', async () => {
    const result = { uuidDiscord: '123456789012345678', discordUsername: 'JohnDoe#1234', discriminator: '1234' };
    mockDiscordUsersService.findOne.mockResolvedValue(result);
    expect(await controller.findOne('123456789012345678')).toEqual(result);
    expect(mockDiscordUsersService.findOne).toHaveBeenCalledWith('123456789012345678');
  });

  it('should update a discord user', async () => {
    const dto: UpdateDiscordUserDto = {
      discordUsername: 'UpdatedJohnDoe#1234',
      discriminator: '4321',
    };
    const result = {
      uuidDiscord: '123456789012345678',
      ...dto,
    };
    mockDiscordUsersService.update.mockResolvedValue(result);
    expect(await controller.update('123456789012345678', dto)).toEqual(result);
    expect(mockDiscordUsersService.update).toHaveBeenCalledWith('123456789012345678', dto);
  });

  it('should throw NotFoundException when updating non-existent user', async () => {
    const dto: UpdateDiscordUserDto = {
      discordUsername: 'UpdatedJohnDoe#1234',
      discriminator: '4321',
    };
    mockDiscordUsersService.update.mockResolvedValue(null);
    
    await expect(controller.update('123456789012345678', dto)).rejects.toThrow(NotFoundException);
    expect(mockDiscordUsersService.update).toHaveBeenCalledWith('123456789012345678', dto);
  });

  it('should delete a discord user', async () => {
    const result = { affected: 1 };
    mockDiscordUsersService.remove.mockResolvedValue(result);
    expect(await controller.remove('123456789012345678')).toEqual(result);
    expect(mockDiscordUsersService.remove).toHaveBeenCalledWith('123456789012345678');
  });
}); 