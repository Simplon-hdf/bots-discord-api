import { Test, TestingModule } from '@nestjs/testing';
import { AnswerTemplatesService } from './answer-templates.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnswerTemplate } from './entities/answer-template.entity';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Repository } from 'typeorm';
import { CreateAnswerQuestionTemplateDto } from './dto/create-answer-question-template.dto';

describe('AnswersService', () => {
  let service: AnswerTemplatesService;
  let repository: Repository<AnswerTemplate>;

  const mockRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOneBy: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerTemplatesService,
        {
          provide: getRepositoryToken(AnswerTemplate),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AnswerTemplatesService>(AnswerTemplatesService);
    repository = module.get<Repository<AnswerTemplate>>(getRepositoryToken(AnswerTemplate));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new answer', async () => {
      const createAnswerQuestionDto: CreateAnswerQuestionTemplateDto = {
        content: 'Test answer',
        uuidQuestionTemplate: '123e4567-e89b-12d3-a456-426614174000'
      };

      const answer = { uuid: 'test-uuid', ...createAnswerQuestionDto };
      mockRepository.create.mockReturnValue(answer);
      mockRepository.save.mockResolvedValue(answer);

      const result = await service.create(createAnswerQuestionDto);

      expect(result).toEqual(answer);
      expect(mockRepository.create).toHaveBeenCalledWith(createAnswerQuestionDto);
      expect(mockRepository.save).toHaveBeenCalledWith(answer);
    });
  });

  describe('findAll', () => {
    it('should return an array of answers', async () => {
      const answers = [
        { uuid: '1', content: 'Answer 1' },
        { uuid: '2', content: 'Answer 2' },
      ];
      mockRepository.find.mockResolvedValue(answers);

      const result = await service.findAll();

      expect(result).toEqual(answers);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single answer', async () => {
      const answer = { uuid: 'test-uuid', content: 'Test answer' };
      mockRepository.findOneBy.mockResolvedValue(answer);

      const result = await service.findOne('test-uuid');

      expect(result).toEqual(answer);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuid: 'test-uuid' });
    });
  });
});
