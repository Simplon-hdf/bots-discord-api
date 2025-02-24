import { Test, TestingModule } from '@nestjs/testing';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { CreateAnswerQuestionDto } from './dto/create-answer-question.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AnswersController', () => {
  let controller: AnswersController;
  let service: AnswersService;

  const mockAnswersService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswersController],
      providers: [
        {
          provide: AnswersService,
          useValue: mockAnswersService,
        },
      ],
    }).compile();

    controller = module.get<AnswersController>(AnswersController);
    service = module.get<AnswersService>(AnswersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new answer', async () => {
      const createAnswerQuestionDto: CreateAnswerQuestionDto = {
        content: 'Test answer',
        uuidQuestion: 'test-question-uuid'
      };
      const expectedResult = { uuid: 'test-uuid', ...createAnswerQuestionDto };

      mockAnswersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createAnswerQuestionDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createAnswerQuestionDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of answers', async () => {
      const expectedResult = [
        { uuid: 'uuid1', content: 'Answer 1', uuidQuestion: 'q-uuid1' },
        { uuid: 'uuid2', content: 'Answer 2', uuidQuestion: 'q-uuid2' }
      ];

      mockAnswersService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single answer', async () => {
      const uuid = 'test-uuid';
      const expectedResult = {
        uuid,
        content: 'Test answer',
        uuidQuestion: 'q-uuid'
      };

      mockAnswersService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(uuid);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(uuid);
    });
  });

  describe('update', () => {
    it('should update an answer', async () => {
      const uuid = 'test-uuid';
      const updateAnswerDto: UpdateAnswerDto = {
        content: 'Updated answer'
      };
      const expectedResult = {
        uuid,
        ...updateAnswerDto,
        uuidQuestion: 'q-uuid'
      };

      mockAnswersService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(uuid, updateAnswerDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(uuid, updateAnswerDto);
    });

    it('should throw NotFoundException when answer not found', async () => {
      const uuid = 'non-existent-uuid';
      const updateAnswerDto: UpdateAnswerDto = {
        content: 'Updated answer'
      };

      mockAnswersService.update.mockResolvedValue(null);

      await expect(controller.update(uuid, updateAnswerDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(uuid, updateAnswerDto);
    });
  });

  describe('remove', () => {
    it('should remove an answer', async () => {
      const uuid = 'test-uuid';
      const expectedResult = { deleted: true };

      mockAnswersService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(uuid);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(uuid);
    });
  });
});
