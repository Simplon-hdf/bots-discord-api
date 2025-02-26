import { Test, TestingModule } from '@nestjs/testing';
import { AnswersService } from './answers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Repository } from 'typeorm';
import { CreateAnswerQuestionDto } from './dto/create-answer-question.dto';

describe('AnswersService', () => {
  let service: AnswersService;
  let repository: Repository<Answer>;

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
        AnswersService,
        {
          provide: getRepositoryToken(Answer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AnswersService>(AnswersService);
    repository = module.get<Repository<Answer>>(getRepositoryToken(Answer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new answer', async () => {
      const createAnswerQuestionDto: CreateAnswerQuestionDto = {
        content: 'Test answer',
        uuidQuestion: '123e4567-e89b-12d3-a456-426614174000'
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
