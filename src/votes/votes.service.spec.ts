import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VotesService } from './votes.service';
import { Vote, VoteType } from './entities/vote.entity';
import { Member } from '../members/entities/member.entity';
import { Resource } from '../resources/entities/resource.entity';
import { Comment } from '../comments/entities/comment.entity';
import { CreateVoteDto } from './dto/create-vote.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('VotesService', () => {
  let service: VotesService;
  let voteRepository: Repository<Vote>;
  let memberRepository: Repository<Member>;
  let resourceRepository: Repository<Resource>;
  let commentRepository: Repository<Comment>;

  const mockMember = {
    uuidMember: '123e4567-e89b-12d3-a456-426614174000',
    guildUsername: 'TestUser',
    communityRole: 'Member',
  } as Member;

  const mockResource = {
    uuidResource: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Test Resource',
  } as Resource;

  const mockComment = {
    uuidComment: '123e4567-e89b-12d3-a456-426614174002',
    content: 'Test Comment',
  } as Comment;

  const mockVote = {
    uuidVote: '123e4567-e89b-12d3-a456-426614174003',
    voteType: VoteType.UPVOTE,
    member: mockMember,
    resource: mockResource,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Vote;

  const mockCreateResourceVoteDto: CreateVoteDto = {
    uuidMember: mockMember.uuidMember,
    voteType: VoteType.UPVOTE,
    uuidResource: mockResource.uuidResource,
  };

  const mockCreateCommentVoteDto: CreateVoteDto = {
    uuidMember: mockMember.uuidMember,
    voteType: VoteType.UPVOTE,
    uuidComment: mockComment.uuidComment,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: getRepositoryToken(Vote),
          useValue: {
            create: vi.fn().mockReturnValue(mockVote),
            save: vi.fn().mockResolvedValue(mockVote),
            find: vi.fn().mockResolvedValue([mockVote]),
            findOne: vi.fn().mockResolvedValue(null),
            remove: vi.fn().mockResolvedValue(true),
          },
        },
        {
          provide: getRepositoryToken(Member),
          useValue: {
            findOne: vi.fn().mockResolvedValue(mockMember),
          },
        },
        {
          provide: getRepositoryToken(Resource),
          useValue: {
            findOne: vi.fn().mockResolvedValue(mockResource),
          },
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            findOne: vi.fn().mockResolvedValue(mockComment),
          },
        },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);
    voteRepository = module.get<Repository<Vote>>(getRepositoryToken(Vote));
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    resourceRepository = module.get<Repository<Resource>>(getRepositoryToken(Resource));
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  describe('create', () => {
    describe('vote sur une ressource', () => {
      it('devrait créer un vote sur une ressource', async () => {
        vi.spyOn(voteRepository, 'findOne').mockResolvedValueOnce(null);
        const result = await service.create(mockCreateResourceVoteDto);
        expect(result).toEqual(mockVote);
      });

      it('devrait lever une exception si le membre n\'existe pas', async () => {
        vi.spyOn(memberRepository, 'findOne').mockResolvedValueOnce(null);
        await expect(service.create(mockCreateResourceVoteDto)).rejects.toThrow(NotFoundException);
      });

      it('devrait lever une exception si la ressource n\'existe pas', async () => {
        vi.spyOn(resourceRepository, 'findOne').mockResolvedValueOnce(null);
        await expect(service.create(mockCreateResourceVoteDto)).rejects.toThrow(NotFoundException);
      });

      it('devrait lever une exception si le membre a déjà voté pour la ressource', async () => {
        vi.spyOn(voteRepository, 'findOne').mockResolvedValueOnce(mockVote);
        await expect(service.create(mockCreateResourceVoteDto)).rejects.toThrow(ConflictException);
      });
    });

    describe('vote sur un commentaire', () => {
      it('devrait créer un vote sur un commentaire', async () => {
        vi.spyOn(voteRepository, 'findOne').mockResolvedValueOnce(null);
        const result = await service.create(mockCreateCommentVoteDto);
        expect(result).toEqual(mockVote);
      });

      it('devrait lever une exception si le commentaire n\'existe pas', async () => {
        vi.spyOn(commentRepository, 'findOne').mockResolvedValueOnce(null);
        await expect(service.create(mockCreateCommentVoteDto)).rejects.toThrow(NotFoundException);
      });

      it('devrait lever une exception si le membre a déjà voté pour le commentaire', async () => {
        vi.spyOn(voteRepository, 'findOne').mockResolvedValueOnce(mockVote);
        await expect(service.create(mockCreateCommentVoteDto)).rejects.toThrow(ConflictException);
      });
    });
  });

  describe('findAll', () => {
    it('devrait retourner tous les votes', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockVote]);
      expect(voteRepository.find).toHaveBeenCalledWith({
        relations: ['member', 'resource', 'comment']
      });
    });
  });

  describe('findOne', () => {
    it('devrait retourner un vote spécifique', async () => {
      vi.spyOn(voteRepository, 'findOne').mockResolvedValueOnce(mockVote);
      const result = await service.findOne(mockVote.uuidVote);
      expect(result).toEqual(mockVote);
      expect(voteRepository.findOne).toHaveBeenCalledWith({
        where: { uuidVote: mockVote.uuidVote },
        relations: ['member', 'resource', 'comment']
      });
    });

    it('devrait retourner null si le vote n\'existe pas', async () => {
      vi.spyOn(voteRepository, 'findOne').mockResolvedValueOnce(null);
      const result = await service.findOne('invalid-uuid');
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('devrait supprimer un vote', async () => {
      vi.spyOn(voteRepository, 'findOne').mockResolvedValueOnce(mockVote);
      const result = await service.remove(mockVote.uuidVote);
      expect(result).toBe(true);
    });

    it('devrait lever une exception si le vote n\'existe pas', async () => {
      vi.spyOn(voteRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.remove('invalid-uuid')).rejects.toThrow(NotFoundException);
    });
  });
});
