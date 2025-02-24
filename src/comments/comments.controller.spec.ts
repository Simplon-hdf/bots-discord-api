import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Member } from '../members/entities/member.entity';
import { Guild } from '../guilds/entities/guild.entity';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  // Mock des données de test
  const mockGuild: Guild = {
    uuid: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Test Guild',
    memberCount: 1,
    configuration: {},
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockMember: Member = {
    uuid: '123e4567-e89b-12d3-a456-426614174001',
    guild_username: 'TestUser',
    xp: '100.00',
    level: 1,
    community_role: 'Member',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
    uuidGuild: '123e4567-e89b-12d3-a456-426614174002',
    uuidDiscord: '123456789',
    guild: mockGuild
  };

  const mockComment: Comment = {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    content: 'Test comment',
    comment_status: 'active',
    createdAt: new Date(),
    uuidMember: '123e4567-e89b-12d3-a456-426614174001',
    resource_uuid: '123e4567-e89b-12d3-a456-426614174002',
    user_uuid: '123e4567-e89b-12d3-a456-426614174003',
    member: mockMember
  };

  const mockCreateDto: CreateCommentDto = {
    content: 'Test comment',
    comment_status: 'active',
    uuidMember: '123e4567-e89b-12d3-a456-426614174001',
    resource_uuid: '123e4567-e89b-12d3-a456-426614174002',
    user_uuid: '123e4567-e89b-12d3-a456-426614174003'
  };

  const mockUpdateDto: UpdateCommentDto = {
    content: 'Updated test comment',
    comment_status: 'inactive'
  };

  const mockCommentsService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  describe('create', () => {
    it('devrait créer un nouveau commentaire', async () => {
      mockCommentsService.create.mockResolvedValue(mockComment);

      const result = await controller.create(mockCreateDto);

      expect(result).toEqual(mockComment);
      expect(mockCommentsService.create).toHaveBeenCalledWith(mockCreateDto);
    });
  });

  describe('findAll', () => {
    it('devrait retourner un tableau de commentaires', async () => {
      mockCommentsService.findAll.mockResolvedValue([mockComment]);

      const result = await controller.findAll();

      expect(result).toEqual([mockComment]);
      expect(mockCommentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devrait retourner un commentaire par uuid', async () => {
      mockCommentsService.findOne.mockResolvedValue(mockComment);

      const result = await controller.findOne(mockComment.uuid);

      expect(result).toEqual(mockComment);
      expect(mockCommentsService.findOne).toHaveBeenCalledWith(mockComment.uuid);
    });

    it('devrait lever une exception si le commentaire n\'est pas trouvé', async () => {
      mockCommentsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('non-existant')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un commentaire', async () => {
      mockCommentsService.update.mockResolvedValue({ ...mockComment, ...mockUpdateDto });

      const result = await controller.update(mockComment.uuid, mockUpdateDto);

      expect(result).toEqual({ ...mockComment, ...mockUpdateDto });
      expect(mockCommentsService.update).toHaveBeenCalledWith(mockComment.uuid, mockUpdateDto);
    });

    it('devrait lever une exception si le commentaire à mettre à jour n\'existe pas', async () => {
      mockCommentsService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('non-existant', { content: 'test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('devrait supprimer un commentaire', async () => {
      mockCommentsService.remove.mockResolvedValue(undefined);

      await controller.remove(mockComment.uuid);

      expect(mockCommentsService.remove).toHaveBeenCalledWith(mockComment.uuid);
    });

    it('devrait lever une exception si le commentaire à supprimer n\'existe pas', async () => {
      mockCommentsService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('non-existant')).rejects.toThrow(NotFoundException);
    });
  });
}); 