import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModeratorActionsService } from './moderator-actions.service';
import { ModeratorAction } from './entities/moderator-action.entity';
import { Report } from '../reports/entities/report.entity';
import { Member } from '../members/entities/member.entity';
import { CreateModeratorActionDto, ActionType } from './dto/create-moderator-action.dto';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ModeratorActionsService', () => {
  let service: ModeratorActionsService;
  let moderatorActionRepository: Repository<ModeratorAction>;
  let reportRepository: Repository<Report>;
  let memberRepository: Repository<Member>;

  const mockModeratorAction = {
    uuidModeration: '123e4567-e89b-12d3-a456-426614174000',
    actionType: 'warning',
    actionReason: 'Test reason',
    moderatorUuid: '123e4567-e89b-12d3-a456-426614174001',
    reportUuid: '123e4567-e89b-12d3-a456-426614174002',
  };

  const mockReport = {
    uuidReport: '123e4567-e89b-12d3-a456-426614174002',
    status: 'pending',
    save: vi.fn(),
  };

  const mockModerator: Partial<Member> = {
    uuidMember: '123e4567-e89b-12d3-a456-426614174001',
    communityRole: 'Moderator',
  };

  const mockCreateDto: CreateModeratorActionDto = {
    uuidMember: mockModerator.uuidMember!,
    uuidReport: mockReport.uuidReport,
    type: ActionType.WARN,
    reason: 'Test reason',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModeratorActionsService,
        {
          provide: getRepositoryToken(ModeratorAction),
          useValue: {
            create: vi.fn().mockReturnValue(mockModeratorAction),
            save: vi.fn().mockResolvedValue(mockModeratorAction),
            find: vi.fn().mockResolvedValue([mockModeratorAction]),
            findOne: vi.fn().mockResolvedValue(mockModeratorAction),
          },
        },
        {
          provide: getRepositoryToken(Report),
          useValue: {
            findOne: vi.fn().mockResolvedValue(mockReport),
            save: vi.fn().mockResolvedValue({ ...mockReport, status: 'resolved' }),
          },
        },
        {
          provide: getRepositoryToken(Member),
          useValue: {
            findOne: vi.fn().mockResolvedValue(mockModerator),
          },
        },
      ],
    }).compile();

    service = module.get<ModeratorActionsService>(ModeratorActionsService);
    moderatorActionRepository = module.get<Repository<ModeratorAction>>(
      getRepositoryToken(ModeratorAction),
    );
    reportRepository = module.get<Repository<Report>>(
      getRepositoryToken(Report),
    );
    memberRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
  });

  describe('create', () => {
    it('devrait créer une nouvelle action de modération', async () => {
      const result = await service.create(mockCreateDto);
      expect(result).toEqual(mockModeratorAction);
    });

    it('devrait lever une exception si le membre n\'existe pas', async () => {
      vi.spyOn(memberRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.create(mockCreateDto)).rejects.toThrow(NotFoundException);
    });

    it('devrait lever une exception si le membre n\'est pas modérateur', async () => {
      vi.spyOn(memberRepository, 'findOne').mockResolvedValueOnce({
        ...mockModerator,
        communityRole: 'User',
      } as Member);
      await expect(service.create(mockCreateDto)).rejects.toThrow(ForbiddenException);
    });

    it('devrait lever une exception si le signalement n\'existe pas', async () => {
      vi.spyOn(reportRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.create(mockCreateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('devrait retourner toutes les actions de modération', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockModeratorAction]);
    });

    it('devrait gérer les erreurs de base de données', async () => {
      vi.spyOn(moderatorActionRepository, 'find').mockRejectedValueOnce(new Error());
      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('devrait retourner une action de modération spécifique', async () => {
      const result = await service.findOne(mockModeratorAction.uuidModeration);
      expect(result).toEqual(mockModeratorAction);
    });

    it('devrait lever une exception si l\'action n\'existe pas', async () => {
      vi.spyOn(moderatorActionRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne('invalid-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByReport', () => {
    it('devrait retourner les actions de modération pour un signalement', async () => {
      const result = await service.findByReport(mockReport.uuidReport);
      expect(result).toEqual([mockModeratorAction]);
    });

    it('devrait gérer les erreurs de base de données', async () => {
      vi.spyOn(moderatorActionRepository, 'find').mockRejectedValueOnce(new Error());
      await expect(service.findByReport(mockReport.uuidReport)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('devrait lever une exception car la suppression n\'est pas autorisée', async () => {
      await expect(service.remove(mockModeratorAction.uuidModeration)).rejects.toThrow(BadRequestException);
    });
  });
}); 