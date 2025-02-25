import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository, DeleteResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CommentsService', () => {
  let service: CommentsService;
  let repository: Repository<Comment>;

  const mockCreateDto: CreateCommentDto = {
    content: 'Test comment',
    status: 'active',
    uuidMember: '123e4567-e89b-12d3-a456-426614174001',
    uuidResource: '123e4567-e89b-12d3-a456-426614174002'
  };

  const mockUpdateDto: UpdateCommentDto = {
    content: 'Updated content',
    status: 'inactive'
  };

  const mockComment = {
    uuidComment: '123e4567-e89b-12d3-a456-426614174000',
    content: 'Test comment',
    status: 'active',
    createdAt: new Date(),
    uuidMember: '123e4567-e89b-12d3-a456-426614174001',
    uuidResource: '123e4567-e89b-12d3-a456-426614174002'
  } as Comment;

  const mockDeleteResult: DeleteResult = {
    raw: [],
    affected: 1
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            create: vi.fn().mockReturnValue(mockComment),
            save: vi.fn().mockResolvedValue(mockComment),
            find: vi.fn().mockResolvedValue([mockComment]),
            findOne: vi.fn().mockResolvedValue(mockComment),
            delete: vi.fn().mockResolvedValue(mockDeleteResult)
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  describe('create', () => {
    it('devrait créer un nouveau commentaire', async () => {
      const result = await service.create(mockCreateDto);

      expect(result).toEqual(mockComment);
      expect(repository.create).toHaveBeenCalledWith(mockCreateDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('devrait retourner un tableau de commentaires', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockComment]);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['member', 'resource'],
        order: {
          createdAt: 'DESC'
        }
      });
    });
  });

  describe('findOne', () => {
    it('devrait retourner un commentaire par uuid', async () => {
      const result = await service.findOne(mockComment.uuidComment);

      expect(result).toEqual(mockComment);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { uuidComment: mockComment.uuidComment },
        relations: ['member', 'resource']
      });
    });

    it('devrait lever une exception si le commentaire n\'existe pas', async () => {
      vi.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne('non-existant')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByResource', () => {
    it('devrait retourner les commentaires d\'une ressource', async () => {
      const result = await service.findByResource(mockComment.uuidResource);

      expect(result).toEqual([mockComment]);
      expect(repository.find).toHaveBeenCalledWith({
        where: { uuidResource: mockComment.uuidResource },
        relations: ['member', 'resource'],
        order: {
          createdAt: 'DESC'
        }
      });
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un commentaire', async () => {
      const updatedComment = {
        ...mockComment,
        ...mockUpdateDto
      } as Comment;
      vi.spyOn(repository, 'save').mockResolvedValueOnce(updatedComment);

      const result = await service.update(mockComment.uuidComment, mockUpdateDto);

      expect(result).toEqual(updatedComment);
      expect(repository.save).toHaveBeenCalledWith(updatedComment);
    });

    it('devrait lever une exception si le commentaire à mettre à jour n\'existe pas', async () => {
      vi.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update('non-existant', mockUpdateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('devrait supprimer un commentaire', async () => {
      await service.remove(mockComment.uuidComment);

      expect(repository.delete).toHaveBeenCalledWith({ uuidComment: mockComment.uuidComment });
    });

    it('devrait lever une exception si le commentaire à supprimer n\'existe pas', async () => {
      vi.spyOn(repository, 'delete').mockResolvedValueOnce({ ...mockDeleteResult, affected: 0 });

      await expect(service.remove('non-existant')).rejects.toThrow(NotFoundException);
    });
  });
}); 