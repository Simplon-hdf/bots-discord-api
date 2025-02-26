import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockComment = {
    uuidComment: '123e4567-e89b-12d3-a456-426614174000',
    content: 'Test comment',
    status: 'active',
    createdAt: new Date(),
    uuidMember: '123e4567-e89b-12d3-a456-426614174001',
    uuidResource: '123e4567-e89b-12d3-a456-426614174002'
  } as Comment;

  const mockCreateDto: CreateCommentDto = {
    content: 'Test comment',
    status: 'active',
    uuidMember: '123e4567-e89b-12d3-a456-426614174001',
    uuidResource: '123e4567-e89b-12d3-a456-426614174002'
  };

  const mockUpdateDto: UpdateCommentDto = {
    content: 'Updated test comment',
    status: 'inactive'
  };

  const mockCommentsService = {
    create: vi.fn().mockResolvedValue(mockComment),
    findAll: vi.fn().mockResolvedValue([mockComment]),
    findOne: vi.fn().mockResolvedValue(mockComment),
    update: vi.fn().mockResolvedValue({ ...mockComment, ...mockUpdateDto }),
    remove: vi.fn().mockResolvedValue(undefined),
    findByResource: vi.fn().mockResolvedValue([mockComment])
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

    // Reset des mocks après chaque test
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('devrait créer un nouveau commentaire', async () => {
      const result = await controller.create(mockCreateDto);

      expect(result).toEqual(mockComment);
      expect(service.create).toHaveBeenCalledWith(mockCreateDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('devrait rejeter un commentaire avec un contenu vide', async () => {
      const invalidDto = { ...mockCreateDto, content: '' };
      vi.spyOn(service, 'create').mockRejectedValueOnce(new BadRequestException());

      await expect(controller.create(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('devrait rejeter un commentaire avec un statut invalide', async () => {
      const invalidDto = { ...mockCreateDto, status: 'invalid_status' };
      vi.spyOn(service, 'create').mockRejectedValueOnce(new BadRequestException());

      await expect(controller.create(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('devrait rejeter un commentaire avec un UUID membre invalide', async () => {
      const invalidDto = { ...mockCreateDto, uuidMember: 'invalid-uuid' };
      vi.spyOn(service, 'create').mockRejectedValueOnce(new BadRequestException());

      await expect(controller.create(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('devrait retourner un tableau de commentaires', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([mockComment]);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('devrait retourner un tableau vide s\'il n\'y a pas de commentaires', async () => {
      vi.spyOn(service, 'findAll').mockResolvedValueOnce([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('devrait retourner les commentaires triés par date de création', async () => {
      const mockComments = [
        { ...mockComment, createdAt: new Date('2024-03-01') },
        { ...mockComment, uuidComment: '456', createdAt: new Date('2024-03-02') }
      ];
      vi.spyOn(service, 'findAll').mockResolvedValueOnce(mockComments);

      const result = await controller.findAll();

      expect(result).toEqual(mockComments);
      expect(result[0].createdAt).toEqual(new Date('2024-03-01'));
      expect(result[1].createdAt).toEqual(new Date('2024-03-02'));
    });
  });

  describe('findOne', () => {
    it('devrait retourner un commentaire par uuid', async () => {
      const result = await controller.findOne(mockComment.uuidComment);

      expect(result).toEqual(mockComment);
      expect(service.findOne).toHaveBeenCalledWith(mockComment.uuidComment);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('devrait lever une exception si le commentaire n\'existe pas', async () => {
      vi.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findOne('non-existant')).rejects.toThrow(NotFoundException);
    });

    it('devrait rejeter un UUID invalide', async () => {
      vi.spyOn(service, 'findOne').mockRejectedValueOnce(new BadRequestException());

      await expect(controller.findOne('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un commentaire', async () => {
      const updatedComment = { ...mockComment, ...mockUpdateDto } as Comment;
      vi.spyOn(service, 'update').mockResolvedValueOnce(updatedComment);

      const result = await controller.update(mockComment.uuidComment, mockUpdateDto);

      expect(result).toEqual(updatedComment);
      expect(service.update).toHaveBeenCalledWith(mockComment.uuidComment, mockUpdateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('devrait lever une exception si le commentaire à mettre à jour n\'existe pas', async () => {
      vi.spyOn(service, 'update').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.update('non-existant', mockUpdateDto)).rejects.toThrow(NotFoundException);
    });

    it('devrait permettre une mise à jour partielle', async () => {
      const partialUpdate = { content: 'Updated content only' };
      const updatedComment = { ...mockComment, ...partialUpdate } as Comment;
      vi.spyOn(service, 'update').mockResolvedValueOnce(updatedComment);

      const result = await controller.update(mockComment.uuidComment, partialUpdate);

      expect(result.content).toBe(partialUpdate.content);
      expect(result.status).toBe(mockComment.status);
    });

    it('devrait rejeter une mise à jour avec un statut invalide', async () => {
      const invalidUpdate = { status: 'invalid_status' };
      vi.spyOn(service, 'update').mockRejectedValueOnce(new BadRequestException());

      await expect(controller.update(mockComment.uuidComment, invalidUpdate)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('devrait supprimer un commentaire', async () => {
      await controller.remove(mockComment.uuidComment);

      expect(service.remove).toHaveBeenCalledWith(mockComment.uuidComment);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('devrait lever une exception si le commentaire à supprimer n\'existe pas', async () => {
      vi.spyOn(service, 'remove').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.remove('non-existant')).rejects.toThrow(NotFoundException);
    });

    it('devrait rejeter un UUID invalide', async () => {
      vi.spyOn(service, 'remove').mockRejectedValueOnce(new BadRequestException());

      await expect(controller.remove('invalid-uuid')).rejects.toThrow();
    });

    it('devrait vérifier que le commentaire a bien été supprimé', async () => {
      await controller.remove(mockComment.uuidComment);
      
      vi.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());
      await expect(service.findOne(mockComment.uuidComment)).rejects.toThrow(NotFoundException);
    });
  });
}); 