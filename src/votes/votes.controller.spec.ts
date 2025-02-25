import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Vote, VoteType } from './entities/vote.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('VotesController', () => {
  let controller: VotesController;
  let service: VotesService;

  const mockMember = {
    uuidMember: '123e4567-e89b-12d3-a456-426614174000',
    guildUsername: 'TestUser',
    communityRole: 'Member',
  };

  const mockResource = {
    uuidResource: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Test Resource',
  };

  const mockVote: Vote = {
    uuidVote: '123e4567-e89b-12d3-a456-426614174003',
    voteType: VoteType.UPVOTE,
    member: mockMember,
    resource: mockResource,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Vote;

  const mockCreateVoteDto: CreateVoteDto = {
    uuidMember: mockMember.uuidMember,
    voteType: VoteType.UPVOTE,
    uuidResource: mockResource.uuidResource,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotesController],
      providers: [
        {
          provide: VotesService,
          useValue: {
            create: vi.fn().mockResolvedValue(mockVote),
            findAll: vi.fn().mockResolvedValue([mockVote]),
            findOne: vi.fn().mockResolvedValue(mockVote),
            remove: vi.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<VotesController>(VotesController);
    service = module.get<VotesService>(VotesService);
  });

  describe('create', () => {
    it('devrait créer un vote avec succès', async () => {
      const result = await controller.create(mockCreateVoteDto);
      expect(result).toEqual(mockVote);
      expect(service.create).toHaveBeenCalledWith(mockCreateVoteDto);
    });

    it('devrait gérer les erreurs lors de la création', async () => {
      vi.spyOn(service, 'create').mockRejectedValueOnce(new Error());
      await expect(controller.create(mockCreateVoteDto)).rejects.toThrow(
        new HttpException('Erreur lors de la création du vote', HttpStatus.BAD_REQUEST)
      );
    });
  });

  describe('findAll', () => {
    it('devrait retourner tous les votes', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockVote]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('devrait gérer les erreurs lors de la récupération', async () => {
      vi.spyOn(service, 'findAll').mockRejectedValueOnce(new Error());
      await expect(controller.findAll()).rejects.toThrow(
        new HttpException('Erreur lors de la récupération des votes', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });

  describe('findOne', () => {
    it('devrait retourner un vote spécifique', async () => {
      const result = await controller.findOne(mockVote.uuidVote);
      expect(result).toEqual(mockVote);
      expect(service.findOne).toHaveBeenCalledWith(mockVote.uuidVote);
    });

    it('devrait gérer les votes non trouvés', async () => {
      vi.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      await expect(controller.findOne('invalid-uuid')).rejects.toThrow(
        new HttpException('Vote non trouvé', HttpStatus.NOT_FOUND)
      );
    });

    it('devrait gérer les erreurs lors de la récupération', async () => {
      vi.spyOn(service, 'findOne').mockRejectedValueOnce(new Error());
      await expect(controller.findOne(mockVote.uuidVote)).rejects.toThrow(
        new HttpException('Erreur lors de la récupération du vote', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });

  describe('remove', () => {
    it('devrait supprimer un vote', async () => {
      await controller.remove(mockVote.uuidVote);
      expect(service.remove).toHaveBeenCalledWith(mockVote.uuidVote);
    });

    it('devrait gérer les votes non trouvés', async () => {
      vi.spyOn(service, 'remove').mockResolvedValueOnce(false);
      await expect(controller.remove('invalid-uuid')).rejects.toThrow(
        new HttpException('Vote non trouvé', HttpStatus.NOT_FOUND)
      );
    });

    it('devrait gérer les erreurs lors de la suppression', async () => {
      vi.spyOn(service, 'remove').mockRejectedValueOnce(new Error());
      await expect(controller.remove(mockVote.uuidVote)).rejects.toThrow(
        new HttpException('Erreur lors de la suppression du vote', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });
});
