import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { NotFoundException } from '@nestjs/common';

describe('PollsController', () => {
  let controller: PollsController;
  let service: PollsService;

  const mockPollsService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollsController],
      providers: [
        {
          provide: PollsService,
          useValue: mockPollsService,
        },
      ],
    }).compile();

    controller = module.get<PollsController>(PollsController);
    service = module.get<PollsService>(PollsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    it('should create a new poll', async () => {
      const expectedResult = {
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        ...createPollDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPollsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createPollDto);

      expect(result).toEqual(expectedResult);
      expect(mockPollsService.create).toHaveBeenCalledWith(createPollDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of polls', async () => {
      const expectedResult = [
        {
          uuid: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Poll 1',
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

      mockPollsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockPollsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';

    it('should return a single poll', async () => {
      const expectedResult = {
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

      mockPollsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(uuid);

      expect(result).toEqual(expectedResult);
      expect(mockPollsService.findOne).toHaveBeenCalledWith(uuid);
    });

    it('should throw NotFoundException when poll is not found', async () => {
      mockPollsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(uuid)).rejects.toThrow(NotFoundException);
      expect(mockPollsService.findOne).toHaveBeenCalledWith(uuid);
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
      const expectedResult = {
        uuid,
        ...updatePollDto,
        uuidMessage: '12345678901234567',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPollsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(uuid, updatePollDto);

      expect(result).toEqual(expectedResult);
      expect(mockPollsService.update).toHaveBeenCalledWith(uuid, updatePollDto);
    });

    it('should throw NotFoundException when poll to update is not found', async () => {
      mockPollsService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(uuid, updatePollDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPollsService.update).toHaveBeenCalledWith(uuid, updatePollDto);
    });
  });

  describe('remove', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';

    it('should delete a poll', async () => {
      const expectedResult = { affected: 1, raw: [] };

      mockPollsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(uuid);

      expect(result).toEqual(expectedResult);
      expect(mockPollsService.remove).toHaveBeenCalledWith(uuid);
    });

    it('should throw NotFoundException when poll to delete is not found', async () => {
      mockPollsService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove(uuid)).rejects.toThrow(NotFoundException);
      expect(mockPollsService.remove).toHaveBeenCalledWith(uuid);
    });
  });
});
