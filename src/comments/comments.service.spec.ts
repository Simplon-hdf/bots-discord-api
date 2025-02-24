import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CommentsService', () => {
  let service: CommentsService;
  let repository: Repository<Comment>;

  const mockComment = {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    content: 'Test comment',
    member: { uuid: '123', username: 'testUser' }
  };

  const mockRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  describe('create', () => {
    it('devrait créer un nouveau commentaire', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
        comment_status: 'active',
        uuidMember: '123',
        resource_uuid: '123e4567-e89b-12d3-a456-426614174000',
        user_uuid: '123e4567-e89b-12d3-a456-426614174000'
      };

      mockRepository.create.mockReturnValue(mockComment);
      mockRepository.save.mockResolvedValue(mockComment);

      const result = await service.create(createCommentDto);

      expect(result).toEqual(mockComment);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('devrait retourner un tableau de commentaires', async () => {
      mockRepository.find.mockResolvedValue([mockComment]);

      const result = await service.findAll();

      expect(result).toEqual([mockComment]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['member']
      });
    });
  });

  describe('findOne', () => {
    it('devrait retourner un commentaire par uuid', async () => {
      mockRepository.findOne.mockResolvedValue(mockComment);

      const result = await service.findOne(mockComment.uuid);

      expect(result).toEqual(mockComment);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: mockComment.uuid },
        relations: ['member']
      });
    });

    it('devrait lever une exception si le commentaire n\'est pas trouvé', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existant')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un commentaire', async () => {
      const updateCommentDto: UpdateCommentDto = {
        content: 'Updated content'
      };

      mockRepository.findOne.mockResolvedValue(mockComment);
      mockRepository.save.mockResolvedValue({ ...mockComment, ...updateCommentDto });

      const result = await service.update(mockComment.uuid, updateCommentDto);

      expect(result).toEqual({ ...mockComment, ...updateCommentDto });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('devrait lever une exception si le commentaire à mettre à jour n\'existe pas', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existant', { content: 'test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('devrait supprimer un commentaire', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(mockComment.uuid);

      expect(mockRepository.delete).toHaveBeenCalledWith(mockComment.uuid);
    });

    it('devrait lever une exception si le commentaire à supprimer n\'existe pas', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('non-existant')).rejects.toThrow(NotFoundException);
    });
  });
}); 