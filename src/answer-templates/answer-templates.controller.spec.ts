import { Test, TestingModule } from '@nestjs/testing';
import { AnswerTemplatesController } from './answer-templates.controller';
import { AnswerTemplatesService } from './answer-templates.service';
import { CreateAnswerQuestionTemplateDto } from './dto/create-answer-question-template.dto';
import { UpdateAnswerTemplateDto } from './dto/update-answer-template.dto';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AnswerTemplatesController', () => {
  let controller: AnswerTemplatesController;
  let service: AnswerTemplatesService;

  const mockAnswersService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerTemplatesController],
      providers: [
        {
          provide: AnswerTemplatesService,
          useValue: mockAnswersService,
        },
      ],
    }).compile();

    controller = module.get<AnswerTemplatesController>(AnswerTemplatesController);
    service = module.get<AnswerTemplatesService>(AnswerTemplatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new answer', async () => {
      const createAnswerQuestionDto: CreateAnswerQuestionTemplateDto = {
        content: 'Test answer',
        uuidQuestionTemplate: 'test-question-uuid'
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
        { uuid: 'uuid1', content: 'Answer 1', uuidQuestionTemplate: 'q-uuid1' },
        { uuid: 'uuid2', content: 'Answer 2', uuidQuestionTemplate: 'q-uuid2' }
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
        uuidQuestionTemplate: 'q-uuid'
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
      const updateAnswerDto: UpdateAnswerTemplateDto = {
        content: 'Updated answer'
      };
      const expectedResult = {
        uuid,
        ...updateAnswerDto,
        uuidQuestionTemplate: 'q-uuid'
      };

      mockAnswersService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(uuid, updateAnswerDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(uuid, updateAnswerDto);
    });

    it('should throw NotFoundException when answer not found', async () => {
      const uuid = 'non-existent-uuid';
      const updateAnswerDto: UpdateAnswerTemplateDto = {
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
