import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ChannelsService', () => {
  let service: ChannelsService;
  let repository: Repository<Channel>;

  const mockChannel: Channel = {
    uuid: '123456789012345678',
    name: 'test-channel',
    type: 'text',
    channelPosition: 1,
    uuidCategory: '234567890123456789',
    uuidGuild: '345678901234567890',
    createdAt: new Date(),
    updatedAt: new Date(),
    category: null,
    course: null,
    guild: null
  };

  const mockRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    findOneBy: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    repository = mockRepository as unknown as Repository<Channel>;
    service = new ChannelsService(repository);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('devrait créer un nouveau channel', async () => {
      const createChannelDto = {
        uuid: '123456789012345678',
        name: 'test-channel',
        type: 'text',
        channelPosition: 1,
        uuidCategory: '234567890123456789',
        uuidGuild: '345678901234567890'
      };

      mockRepository.create.mockReturnValue(mockChannel);
      mockRepository.save.mockResolvedValue(mockChannel);

      const result = await service.create(createChannelDto);

      expect(result).toEqual(mockChannel);
      expect(mockRepository.create).toHaveBeenCalledWith(createChannelDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockChannel);
    });
  });

  describe('findAll', () => {
    it('devrait retourner un tableau de channels', async () => {
      const channels = [mockChannel];
      mockRepository.find.mockResolvedValue(channels);

      const result = await service.findAll();

      expect(result).toEqual(channels);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['guild', 'category']
      });
    });
  });

  describe('findOne', () => {
    it('devrait retourner un channel par son uuid', async () => {
      mockRepository.findOne.mockResolvedValue(mockChannel);

      const result = await service.findOne(mockChannel.uuid);

      expect(result).toEqual(mockChannel);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: mockChannel.uuid },
        relations: ['guild', 'category']
      });
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un channel', async () => {
      const updateChannelDto = {
        name: 'updated-channel',
        type: 'voice',
        channelPosition: 2
      };
      const updatedChannel = { ...mockChannel, ...updateChannelDto };

      mockRepository.findOneBy.mockResolvedValue(mockChannel);
      mockRepository.save.mockResolvedValue(updatedChannel);

      const result = await service.update(mockChannel.uuid, updateChannelDto);

      expect(result).toEqual(updatedChannel);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuid: mockChannel.uuid });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('devrait retourner null si le channel à mettre à jour n\'existe pas', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.update('non-existent-uuid', {});

      expect(result).toBeNull();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuid: 'non-existent-uuid' });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('devrait supprimer un channel', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(mockChannel.uuid);

      expect(mockRepository.delete).toHaveBeenCalledWith({ uuid: mockChannel.uuid });
    });
  });
}); 