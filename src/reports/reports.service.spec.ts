import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportsService } from './reports.service';
import { Report, ReportType, ReportCategory } from './entities/report.entity';
import { Member } from '../members/entities/member.entity';
import { Resource } from '../resources/entities/resource.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ReportsService', () => {
  let service: ReportsService;
  let reportsRepository: Repository<Report>;
  let membersRepository: Repository<Member>;
  let resourcesRepository: Repository<Resource>;

  const mockReportsRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(),
    remove: vi.fn(),
  };

  const mockMembersRepository = {
    findOne: vi.fn(),
  };

  const mockResourcesRepository = {
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useValue: mockReportsRepository,
        },
        {
          provide: getRepositoryToken(Member),
          useValue: mockMembersRepository,
        },
        {
          provide: getRepositoryToken(Resource),
          useValue: mockResourcesRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    reportsRepository = module.get<Repository<Report>>(getRepositoryToken(Report));
    membersRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    resourcesRepository = module.get<Repository<Resource>>(getRepositoryToken(Resource));

    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('create', () => {
    describe('Resource Report', () => {
      it('should successfully create a resource report', async () => {
        // Arrange
        const mockReporter = {
          uuidMember: '123e4567-e89b-12d3-a456-426614174000',
          guildUsername: 'reporter',
          status: 'active',
        };

        const mockResource = {
          uuidResource: '123e4567-e89b-12d3-a456-426614174001',
          title: 'Reported Resource',
          status: 'active',
        };

        const createReportDto: CreateReportDto = {
          type: ReportType.RESOURCE,
          category: ReportCategory.INAPPROPRIATE,
          reason: 'Test reason',
          uuidReporter: mockReporter.uuidMember,
          uuidResource: mockResource.uuidResource,
        };

        const mockReport = {
          uuidReport: '123e4567-e89b-12d3-a456-426614174002',
          type: ReportType.RESOURCE,
          category: ReportCategory.INAPPROPRIATE,
          reason: 'Test reason',
          status: 'pending',
          reporter: mockReporter,
          resource: mockResource,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Mock repository responses
        mockMembersRepository.findOne.mockResolvedValue(mockReporter);
        mockResourcesRepository.findOne.mockResolvedValue(mockResource);
        mockReportsRepository.create.mockReturnValue({
          ...mockReport,
          reporter: mockReporter,
          resource: mockResource,
        });
        mockReportsRepository.save.mockResolvedValue({
          ...mockReport,
          reporter: mockReporter,
          resource: mockResource,
        });
        mockReportsRepository.findOne
          .mockResolvedValueOnce(null) // Pas de rapport existant
          .mockResolvedValueOnce({
            ...mockReport,
            reporter: mockReporter,
            resource: mockResource,
          }); // Rapport créé avec relations

        // Act
        const result = await service.create(createReportDto);

        // Assert
        expect(mockMembersRepository.findOne).toHaveBeenCalledWith({
          where: { uuidMember: mockReporter.uuidMember }
        });
        expect(mockResourcesRepository.findOne).toHaveBeenCalledWith({
          where: { uuidResource: mockResource.uuidResource }
        });
        expect(mockReportsRepository.findOne).toHaveBeenCalledWith({
          where: {
            reporter: { uuidMember: mockReporter.uuidMember },
            resource: { uuidResource: mockResource.uuidResource }
          },
          relations: ['reporter', 'resource', 'reportedMember']
        });
        expect(mockReportsRepository.save).toHaveBeenCalled();
        expect(result).toBeDefined();
        expect(result.type).toBe(ReportType.RESOURCE);
        expect(result.category).toBe(ReportCategory.INAPPROPRIATE);
        expect(result.status).toBe('pending');
        expect(result.reporter).toBeDefined();
        expect(result.reporter.uuidMember).toBe(mockReporter.uuidMember);
        expect(result.resource).toBeDefined();
        expect(result.resource.uuidResource).toBe(mockResource.uuidResource);
      });

      it('should throw BadRequestException when creating resource report without uuidResource', async () => {
        // Arrange
        const createReportDto: CreateReportDto = {
          type: ReportType.RESOURCE,
          category: ReportCategory.INAPPROPRIATE,
          reason: 'Test reason',
          uuidReporter: '123e4567-e89b-12d3-a456-426614174000',
        };

        // Act & Assert
        await expect(service.create(createReportDto)).rejects.toThrow(
          new BadRequestException('UUID de la ressource requis pour un signalement de ressource')
        );
        expect(mockMembersRepository.findOne).not.toHaveBeenCalled();
        expect(mockResourcesRepository.findOne).not.toHaveBeenCalled();
        expect(mockReportsRepository.save).not.toHaveBeenCalled();
      });

      it('should throw BadRequestException when creating resource report with uuidReportedMember', async () => {
        // Arrange
        const createReportDto: CreateReportDto = {
          type: ReportType.RESOURCE,
          category: ReportCategory.INAPPROPRIATE,
          reason: 'Test reason',
          uuidReporter: '123e4567-e89b-12d3-a456-426614174000',
          uuidResource: '123e4567-e89b-12d3-a456-426614174001',
          uuidReportedMember: '123e4567-e89b-12d3-a456-426614174002',
        };

        // Act & Assert
        await expect(service.create(createReportDto)).rejects.toThrow(
          new BadRequestException('UUID du membre signalé non autorisé pour un signalement de ressource')
        );
        expect(mockMembersRepository.findOne).not.toHaveBeenCalled();
        expect(mockResourcesRepository.findOne).not.toHaveBeenCalled();
        expect(mockReportsRepository.save).not.toHaveBeenCalled();
      });

      it('should throw NotFoundException when reporter does not exist', async () => {
        // Arrange
        const createReportDto: CreateReportDto = {
          type: ReportType.RESOURCE,
          category: ReportCategory.INAPPROPRIATE,
          reason: 'Test reason',
          uuidReporter: '123e4567-e89b-12d3-a456-426614174000',
          uuidResource: '123e4567-e89b-12d3-a456-426614174001',
        };

        mockMembersRepository.findOne.mockResolvedValue(null);

        // Act & Assert
        await expect(service.create(createReportDto)).rejects.toThrow(
          new NotFoundException(`Reporter with UUID ${createReportDto.uuidReporter} not found`)
        );
        expect(mockMembersRepository.findOne).toHaveBeenCalledWith({
          where: { uuidMember: createReportDto.uuidReporter }
        });
        expect(mockResourcesRepository.findOne).not.toHaveBeenCalled();
        expect(mockReportsRepository.save).not.toHaveBeenCalled();
      });

      it('should throw NotFoundException when resource does not exist', async () => {
        // Arrange
        const mockReporter = {
          uuidMember: '123e4567-e89b-12d3-a456-426614174000',
          guildUsername: 'reporter',
          status: 'active',
        };

        const createReportDto: CreateReportDto = {
          type: ReportType.RESOURCE,
          category: ReportCategory.INAPPROPRIATE,
          reason: 'Test reason',
          uuidReporter: mockReporter.uuidMember,
          uuidResource: '123e4567-e89b-12d3-a456-426614174001',
        };

        mockMembersRepository.findOne.mockResolvedValue(mockReporter);
        mockResourcesRepository.findOne.mockResolvedValue(null);

        // Act & Assert
        await expect(service.create(createReportDto)).rejects.toThrow(
          new NotFoundException(`Resource with UUID ${createReportDto.uuidResource} not found`)
        );
        expect(mockMembersRepository.findOne).toHaveBeenCalledWith({
          where: { uuidMember: createReportDto.uuidReporter }
        });
        expect(mockResourcesRepository.findOne).toHaveBeenCalledWith({
          where: { uuidResource: createReportDto.uuidResource }
        });
        expect(mockReportsRepository.save).not.toHaveBeenCalled();
      });

      it('should throw ConflictException when report already exists', async () => {
        // Arrange
        const mockReporter = {
          uuidMember: '123e4567-e89b-12d3-a456-426614174000',
          guildUsername: 'reporter',
          status: 'active',
        };

        const mockResource = {
          uuidResource: '123e4567-e89b-12d3-a456-426614174001',
          title: 'Reported Resource',
          status: 'active',
        };

        const existingReport = {
          uuidReport: '123e4567-e89b-12d3-a456-426614174002',
          type: ReportType.RESOURCE,
          category: ReportCategory.INAPPROPRIATE,
          reason: 'Existing report',
          status: 'pending',
          reporter: mockReporter,
          resource: mockResource,
        };

        const createReportDto: CreateReportDto = {
          type: ReportType.RESOURCE,
          category: ReportCategory.INAPPROPRIATE,
          reason: 'Test reason',
          uuidReporter: mockReporter.uuidMember,
          uuidResource: mockResource.uuidResource,
        };

        mockMembersRepository.findOne.mockResolvedValue(mockReporter);
        mockResourcesRepository.findOne.mockResolvedValue(mockResource);
        mockReportsRepository.findOne.mockResolvedValue(existingReport);

        // Act & Assert
        await expect(service.create(createReportDto)).rejects.toThrow(
          new ConflictException(
            `Un signalement existe déjà pour cet élément par ce membre (UUID: ${existingReport.uuidReport})`
          )
        );
        expect(mockMembersRepository.findOne).toHaveBeenCalled();
        expect(mockResourcesRepository.findOne).toHaveBeenCalled();
        expect(mockReportsRepository.save).not.toHaveBeenCalled();
      });
    });

    describe('Member Report', () => {
      it('should successfully create a member report', async () => {
        // Arrange
        const mockReporter = {
          uuidMember: '123e4567-e89b-12d3-a456-426614174000',
          guildUsername: 'reporter',
          status: 'active',
        };

        const mockReportedMember = {
          uuidMember: '123e4567-e89b-12d3-a456-426614174001',
          guildUsername: 'reported',
          status: 'active',
        };

        const createReportDto: CreateReportDto = {
          type: ReportType.MEMBER,
          category: ReportCategory.HARASSMENT,
          reason: 'Test reason',
          uuidReporter: mockReporter.uuidMember,
          uuidReportedMember: mockReportedMember.uuidMember,
        };

        const mockReport = {
          uuidReport: '123e4567-e89b-12d3-a456-426614174002',
          type: ReportType.MEMBER,
          category: ReportCategory.HARASSMENT,
          reason: 'Test reason',
          status: 'pending',
          reporter: mockReporter,
          reportedMember: mockReportedMember,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Mock repository responses
        mockMembersRepository.findOne
          .mockResolvedValueOnce(mockReporter) // Pour le reporter
          .mockResolvedValueOnce(mockReportedMember); // Pour le membre signalé
        mockReportsRepository.create.mockReturnValue({
          ...mockReport,
          reporter: mockReporter,
          reportedMember: mockReportedMember,
        });
        mockReportsRepository.save.mockResolvedValue({
          ...mockReport,
          reporter: mockReporter,
          reportedMember: mockReportedMember,
        });
        mockReportsRepository.findOne
          .mockResolvedValueOnce(null) // Pas de rapport existant
          .mockResolvedValueOnce({
            ...mockReport,
            reporter: mockReporter,
            reportedMember: mockReportedMember,
          }); // Rapport créé avec relations

        // Act
        const result = await service.create(createReportDto);

        // Assert
        expect(mockMembersRepository.findOne).toHaveBeenNthCalledWith(1, {
          where: { uuidMember: mockReporter.uuidMember }
        });
        expect(mockMembersRepository.findOne).toHaveBeenNthCalledWith(2, {
          where: { uuidMember: mockReportedMember.uuidMember }
        });
        expect(mockReportsRepository.findOne).toHaveBeenCalledWith({
          where: {
            reporter: { uuidMember: mockReporter.uuidMember },
            reportedMember: { uuidMember: mockReportedMember.uuidMember }
          },
          relations: ['reporter', 'resource', 'reportedMember']
        });
        expect(mockReportsRepository.save).toHaveBeenCalled();
        expect(result).toBeDefined();
        expect(result.type).toBe(ReportType.MEMBER);
        expect(result.category).toBe(ReportCategory.HARASSMENT);
        expect(result.status).toBe('pending');
        expect(result.reporter).toBeDefined();
        expect(result.reporter.uuidMember).toBe(mockReporter.uuidMember);
        expect(result.reportedMember).toBeDefined();
        expect(result.reportedMember.uuidMember).toBe(mockReportedMember.uuidMember);
      });

      it('should throw BadRequestException when creating member report without uuidReportedMember', async () => {
        // Arrange
        const createReportDto: CreateReportDto = {
          type: ReportType.MEMBER,
          category: ReportCategory.HARASSMENT,
          reason: 'Test reason',
          uuidReporter: '123e4567-e89b-12d3-a456-426614174000',
        };

        // Act & Assert
        await expect(service.create(createReportDto)).rejects.toThrow(
          new BadRequestException('UUID du membre signalé requis pour un signalement de membre')
        );
        expect(mockMembersRepository.findOne).not.toHaveBeenCalled();
        expect(mockReportsRepository.save).not.toHaveBeenCalled();
      });

      it('should throw BadRequestException when creating member report with uuidResource', async () => {
        // Arrange
        const createReportDto: CreateReportDto = {
          type: ReportType.MEMBER,
          category: ReportCategory.HARASSMENT,
          reason: 'Test reason',
          uuidReporter: '123e4567-e89b-12d3-a456-426614174000',
          uuidReportedMember: '123e4567-e89b-12d3-a456-426614174001',
          uuidResource: '123e4567-e89b-12d3-a456-426614174002',
        };

        // Act & Assert
        await expect(service.create(createReportDto)).rejects.toThrow(
          new BadRequestException('UUID de la ressource non autorisé pour un signalement de membre')
        );
        expect(mockMembersRepository.findOne).not.toHaveBeenCalled();
        expect(mockReportsRepository.save).not.toHaveBeenCalled();
      });

      it('should throw NotFoundException when reporter does not exist', async () => {
        // Arrange
        const createReportDto: CreateReportDto = {
          type: ReportType.MEMBER,
          category: ReportCategory.HARASSMENT,
          reason: 'Test reason',
          uuidReporter: '123e4567-e89b-12d3-a456-426614174000',
          uuidReportedMember: '123e4567-e89b-12d3-a456-426614174001',
        };

        mockMembersRepository.findOne.mockResolvedValue(null);

        // Act & Assert
        await expect(service.create(createReportDto)).rejects.toThrow(
          new NotFoundException(`Reporter with UUID ${createReportDto.uuidReporter} not found`)
        );
        expect(mockMembersRepository.findOne).toHaveBeenCalledWith({
          where: { uuidMember: createReportDto.uuidReporter }
        });
        expect(mockReportsRepository.save).not.toHaveBeenCalled();
      });

      it('should throw NotFoundException when reported member does not exist', async () => {
        // Arrange
        const mockReporter = {
          uuidMember: '123e4567-e89b-12d3-a456-426614174000',
          guildUsername: 'reporter',
          status: 'active',
        };

        const createReportDto: CreateReportDto = {
          type: ReportType.MEMBER,
          category: ReportCategory.HARASSMENT,
          reason: 'Test reason',
          uuidReporter: mockReporter.uuidMember,
          uuidReportedMember: '123e4567-e89b-12d3-a456-426614174001',
        };

        mockMembersRepository.findOne
          .mockResolvedValueOnce(mockReporter) // Pour le reporter
          .mockResolvedValueOnce(null); // Pour le membre signalé

        // Act & Assert
        await expect(service.create(createReportDto)).rejects.toThrow(
          new NotFoundException(`Member with UUID ${createReportDto.uuidReportedMember} not found`)
        );
        expect(mockMembersRepository.findOne).toHaveBeenNthCalledWith(1, {
          where: { uuidMember: createReportDto.uuidReporter }
        });
        expect(mockMembersRepository.findOne).toHaveBeenNthCalledWith(2, {
          where: { uuidMember: createReportDto.uuidReportedMember }
        });
        expect(mockReportsRepository.save).not.toHaveBeenCalled();
      });

      it('should throw ConflictException when report already exists', async () => {
        // Arrange
        const mockReporter = {
          uuidMember: '123e4567-e89b-12d3-a456-426614174000',
          guildUsername: 'reporter',
          status: 'active',
        };

        const mockReportedMember = {
          uuidMember: '123e4567-e89b-12d3-a456-426614174001',
          guildUsername: 'reported',
          status: 'active',
        };

        const existingReport = {
          uuidReport: '123e4567-e89b-12d3-a456-426614174002',
          type: ReportType.MEMBER,
          category: ReportCategory.HARASSMENT,
          reason: 'Existing report',
          status: 'pending',
          reporter: mockReporter,
          reportedMember: mockReportedMember,
        };

        const createReportDto: CreateReportDto = {
          type: ReportType.MEMBER,
          category: ReportCategory.HARASSMENT,
          reason: 'Test reason',
          uuidReporter: mockReporter.uuidMember,
          uuidReportedMember: mockReportedMember.uuidMember,
        };

        mockMembersRepository.findOne
          .mockResolvedValueOnce(mockReporter)
          .mockResolvedValueOnce(mockReportedMember);
        mockReportsRepository.findOne.mockResolvedValue(existingReport);

        // Act & Assert
        await expect(service.create(createReportDto)).rejects.toThrow(
          new ConflictException(
            `Un signalement existe déjà pour cet élément par ce membre (UUID: ${existingReport.uuidReport})`
          )
        );
        expect(mockMembersRepository.findOne).toHaveBeenCalled();
        expect(mockReportsRepository.save).not.toHaveBeenCalled();
      });
    });
  });
}); 