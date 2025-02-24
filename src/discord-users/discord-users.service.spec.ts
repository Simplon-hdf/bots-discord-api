import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DiscordUsersService } from './discord-users.service';
import { Repository } from 'typeorm';
import { DiscordUser } from './entities/discord-user.entity';
import { CreateDiscordUserDto } from './dto/create-discord-user.dto';
import { UpdateDiscordUserDto } from './dto/update-discord-user.dto';

const mockRepository = {
  create: vi.fn(),
  save: vi.fn(),
  find: vi.fn(),
  findOneBy: vi.fn(),
  delete: vi.fn(),
};

describe('DiscordUsersService', () => {
  let service: DiscordUsersService;

  beforeEach(() => {
    service = new DiscordUsersService(mockRepository as unknown as Repository<DiscordUser>);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new discord user', async () => {
    const dto: CreateDiscordUserDto = {
      uuidDiscord: '123456789012345678',
      discordUsername: 'JohnDoe#1234',
      discriminator: '1234',
    };
    const entity = { ...dto };
    mockRepository.create.mockReturnValue(entity);
    mockRepository.save.mockResolvedValue(entity);

    expect(await service.create(dto)).toEqual(entity);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
    expect(mockRepository.save).toHaveBeenCalledWith(entity);
  });

  it('should return an array of discord users', async () => {
    const result = [{ uuidDiscord: '123456789012345678', discordUsername: 'JohnDoe#1234', discriminator: '1234' }];
    mockRepository.find.mockResolvedValue(result);
    expect(await service.findAll()).toEqual(result);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should return a single discord user', async () => {
    const result = { uuidDiscord: '123456789012345678', discordUsername: 'JohnDoe#1234', discriminator: '1234' };
    mockRepository.findOneBy.mockResolvedValue(result);
    expect(await service.findOne('123456789012345678')).toEqual(result);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuidDiscord: '123456789012345678' });
  });

  it('should update a discord user', async () => {
    const dto: UpdateDiscordUserDto = {
      discordUsername: 'UpdatedJohnDoe#1234',
      discriminator: '4321',
    };
    const existingUser = {
      uuidDiscord: '123456789012345678',
      discordUsername: 'JohnDoe#1234',
      discriminator: '1234',
      updatedAt: new Date(),
    };
    const updatedUser = { ...existingUser, ...dto };
    mockRepository.findOneBy.mockResolvedValue(existingUser);
    mockRepository.save.mockResolvedValue(updatedUser);

    expect(await service.update('123456789012345678', dto)).toEqual(updatedUser);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuidDiscord: '123456789012345678' });
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should delete a discord user', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });
    expect(await service.remove('123456789012345678')).toEqual({ affected: 1 });
    expect(mockRepository.delete).toHaveBeenCalledWith({ uuidDiscord: '123456789012345678' });
  });
}); 