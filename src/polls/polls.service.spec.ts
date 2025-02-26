import { Test, TestingModule } from '@nestjs/testing';
import { PollsService } from './polls.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { Repository } from 'typeorm';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('PollsService', () => {
  let service: PollsService;
  let repository: Repository<Poll>;

  const mockPollRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOneBy: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsService,
        {
          provide: getRepositoryToken(Poll),
          useValue: mockPollRepository,
        },
      ],
    }).compile();

    service = module.get<PollsService>(PollsService);
    repository = module.get<Repository<Poll>>(getRepositoryToken(Poll));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPollDto: CreatePollDto = {
      title: 'Test Poll',
      uuidMessage: '12345678901234567',
      isAnonymous: false,
      isClosed: false,
      duration: 24,
      questions: [
        {
          content: 'Test Question',
          isMultipleAnswer: false,
          answers: [
            { content: 'Answer 1' },
            { content: 'Answer 2' }
          ]
        }
      ]
    };

    it('should successfully create a poll', async () => {
      const expectedPoll = {
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        ...createPollDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPollRepository.create.mockReturnValue(expectedPoll);
      mockPollRepository.save.mockResolvedValue(expectedPoll);

      const result = await service.create(createPollDto);

      expect(result).toEqual(expectedPoll);
      expect(mockPollRepository.create).toHaveBeenCalledWith(createPollDto);
      expect(mockPollRepository.save).toHaveBeenCalledWith(expectedPoll);
    });
  });

  describe('findAll', () => {
    it('should return an array of polls', async () => {
      const expectedPolls = [
        {
          uuid: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Test Poll 1',
          uuidMessage: '12345678901234567',
          isTemplate: false,
          isAnonymous: false,
          isClosed: false,
          duration: 24,
          questions: [
            {
              content: 'Question 1',
              isMultipleAnswer: false,
              answers: [
                { content: 'Answer 1' },
                { content: 'Answer 2' }
              ]
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockPollRepository.find.mockResolvedValue(expectedPolls);

      const result = await service.findAll();

      expect(result).toEqual(expectedPolls);
      expect(mockPollRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';

    it('should return a single poll', async () => {
      const expectedPoll = {
        uuid,
        title: 'Test Poll',
        uuidMessage: '12345678901234567',
        isTemplate: false,
        isAnonymous: false,
        isClosed: false,
        duration: 24,
        questions: [
          {
            content: 'Test Question',
            isMultipleAnswer: false,
            answers: [
              { content: 'Answer 1' },
              { content: 'Answer 2' }
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPollRepository.findOneBy.mockResolvedValue(expectedPoll);

      const result = await service.findOne(uuid);

      expect(result).toEqual(expectedPoll);
      expect(mockPollRepository.findOneBy).toHaveBeenCalledWith({ uuid });
    });

    it('should throw NotFoundException when poll is not found', async () => {
      mockPollRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(uuid)).rejects.toThrow(
        new NotFoundException(`The poll with UUID "${uuid}" was not found`),
      );
      expect(mockPollRepository.findOneBy).toHaveBeenCalledWith({ uuid });
    });
  });

  describe('update', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const updatePollDto: UpdatePollDto = {
      title: 'Updated Poll',
      isAnonymous: true,
      isClosed: false,
      duration: 48,
      questions: [
        {
          content: 'Updated Question',
          isMultipleAnswer: true,
          answers: [
            { content: 'New Answer 1' },
            { content: 'New Answer 2' }
          ]
        }
      ]
    };

    it('should update a poll', async () => {
      const existingPoll = {
        uuid,
        title: 'Original Poll',
        uuidMessage: '12345678901234567',
        isTemplate: false,
        isAnonymous: false,
        isClosed: false,
        duration: 24,
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedPoll = {
        ...existingPoll,
        ...updatePollDto,
        updatedAt: new Date(),
      };

      mockPollRepository.findOneBy.mockResolvedValue(existingPoll);
      mockPollRepository.save.mockResolvedValue(updatedPoll);

      const result = await service.update(uuid, updatePollDto);

      expect(result).toEqual(updatedPoll);
      expect(mockPollRepository.findOneBy).toHaveBeenCalledWith({ uuid });
      expect(mockPollRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...existingPoll,
        ...updatePollDto,
      }));
    });

    it('should throw NotFoundException when poll to update is not found', async () => {
      mockPollRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(uuid, updatePollDto)).rejects.toThrow(
        new NotFoundException(`The poll with UUID "${uuid}" was not found`),
      );
      expect(mockPollRepository.findOneBy).toHaveBeenCalledWith({ uuid });
    });
  });

  describe('remove', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';

    it('should delete a poll', async () => {
      const existingPoll = {
        uuid,
        title: 'Poll to Delete',
        uuidMessage: '12345678901234567',
        isTemplate: false,
        isAnonymous: false,
        isClosed: false,
        duration: 24,
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const deleteResult = { affected: 1, raw: [] };

      mockPollRepository.findOneBy.mockResolvedValue(existingPoll);
      mockPollRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(uuid);

      expect(result).toEqual(deleteResult);
      expect(mockPollRepository.findOneBy).toHaveBeenCalledWith({ uuid });
      expect(mockPollRepository.delete).toHaveBeenCalledWith({ uuid });
    });

    it('should throw NotFoundException when poll to delete is not found', async () => {
      mockPollRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(uuid)).rejects.toThrow(
        new NotFoundException(`The poll with UUID "${uuid}" was not found`),
      );
      expect(mockPollRepository.findOneBy).toHaveBeenCalledWith({ uuid });
    });
  });
});
