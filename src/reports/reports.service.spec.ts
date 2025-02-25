import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportsService } from './reports.service';
import { Report, ReportType, ReportCategory } from './entities/report.entity';
import { Member } from '../members/entities/member.entity';
import { Resource } from '../resources/entities/resource.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { BadRequestException, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
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
        if (result.resource) {
          expect(result.resource.uuidResource).toBe(mockResource.uuidResource);
        }
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
        if (result.reportedMember) {
          expect(result.reportedMember.uuidMember).toBe(mockReportedMember.uuidMember);
        }
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

  describe('findAll', () => {
    it('should return all reports with their relations', async () => {
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

      const mockReportedMember = {
        uuidMember: '123e4567-e89b-12d3-a456-426614174002',
        guildUsername: 'reported',
        status: 'active',
      };

      const mockReports = [
        {
          uuidReport: '123e4567-e89b-12d3-a456-426614174003',
          type: ReportType.RESOURCE,
          category: ReportCategory.INAPPROPRIATE,
          reason: 'Resource report',
          status: 'pending',
          reporter: mockReporter,
          resource: mockResource,
          createdAt: new Date('2024-03-15'),
          updatedAt: new Date('2024-03-15'),
        },
        {
          uuidReport: '123e4567-e89b-12d3-a456-426614174004',
          type: ReportType.MEMBER,
          category: ReportCategory.HARASSMENT,
          reason: 'Member report',
          status: 'pending',
          reporter: mockReporter,
          reportedMember: mockReportedMember,
          createdAt: new Date('2024-03-14'),
          updatedAt: new Date('2024-03-14'),
        },
      ];

      mockReportsRepository.find.mockResolvedValue(mockReports);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockReportsRepository.find).toHaveBeenCalledWith({
        relations: ['reporter', 'resource', 'reportedMember'],
      });
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);

      // Vérifier le signalement de ressource
      expect(result[0].type).toBe(ReportType.RESOURCE);
      expect(result[0].reporter).toBeDefined();
      expect(result[0].reporter.uuidMember).toBe(mockReporter.uuidMember);
      expect(result[0].resource).toBeDefined();
      if (result[0].resource) {
        expect(result[0].resource.uuidResource).toBe(mockResource.uuidResource);
      }
      expect(result[0].reportedMember).toBeUndefined();

      // Vérifier le signalement de membre
      expect(result[1].type).toBe(ReportType.MEMBER);
      expect(result[1].reporter).toBeDefined();
      expect(result[1].reporter.uuidMember).toBe(mockReporter.uuidMember);
      expect(result[1].reportedMember).toBeDefined();
      if (result[1].reportedMember) {
        expect(result[1].reportedMember.uuidMember).toBe(mockReportedMember.uuidMember);
      }
      expect(result[1].resource).toBeUndefined();
    });

    it('should return empty array when no reports exist', async () => {
      // Arrange
      mockReportsRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockReportsRepository.find).toHaveBeenCalledWith({
        relations: ['reporter', 'resource', 'reportedMember'],
      });
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return a report with all its relations', async () => {
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

      mockReportsRepository.findOne.mockResolvedValue(mockReport);

      // Act
      const result = await service.findOne(mockReport.uuidReport);

      // Assert
      expect(mockReportsRepository.findOne).toHaveBeenCalledWith({
        where: { uuidReport: mockReport.uuidReport },
        relations: ['reporter', 'resource', 'reportedMember']
      });
      expect(result).toBeDefined();
      expect(result.uuidReport).toBe(mockReport.uuidReport);
      expect(result.type).toBe(ReportType.RESOURCE);
      expect(result.reporter).toBeDefined();
      expect(result.reporter.uuidMember).toBe(mockReporter.uuidMember);
      expect(result.resource).toBeDefined();
      if (result.resource) {
        expect(result.resource.uuidResource).toBe(mockResource.uuidResource);
      }
    });

    it('should throw NotFoundException when report does not exist', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      mockReportsRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(uuid)).rejects.toThrow(
        new NotFoundException(`Report with UUID ${uuid} not found`)
      );
      expect(mockReportsRepository.findOne).toHaveBeenCalledWith({
        where: { uuidReport: uuid },
        relations: ['reporter', 'resource', 'reportedMember']
      });
    });
  });

  describe('update', () => {
    it('should update a report with modifiable fields only', async () => {
      // Arrange
      const mockReporter = {
        uuidMember: '123e4567-e89b-12d3-a456-426614174000',
        username: 'reporter',
        status: 'active',
      };

      const mockResource = {
        uuidResource: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Test Resource',
        status: 'active',
      };

      const existingReport = {
        uuidReport: '123e4567-e89b-12d3-a456-426614174002',
        type: ReportType.RESOURCE,
        category: ReportCategory.INAPPROPRIATE,
        reason: 'Test reason',
        status: 'pending',
        reporter: mockReporter,
        resource: mockResource,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15'),
      };

      const updateReportDto = {
        category: ReportCategory.HARASSMENT,
        reason: 'Updated reason',
        status: 'resolved',
      };

      const updatedReport = {
        ...existingReport,
        ...updateReportDto,
        updatedAt: new Date(),
      };

      mockReportsRepository.findOne
        .mockResolvedValueOnce(existingReport)
        .mockResolvedValueOnce(updatedReport);
      mockReportsRepository.save.mockResolvedValue(updatedReport);

      // Act
      const result = await service.update(existingReport.uuidReport, updateReportDto);

      // Assert
      expect(mockReportsRepository.findOne).toHaveBeenNthCalledWith(1, {
        where: { uuidReport: existingReport.uuidReport },
        relations: ['reporter', 'resource', 'reportedMember']
      });

      expect(mockReportsRepository.save).toHaveBeenCalledWith({
        ...existingReport,
        ...updateReportDto
      });

      expect(mockReportsRepository.findOne).toHaveBeenNthCalledWith(2, {
        where: { uuidReport: updatedReport.uuidReport },
        relations: ['reporter', 'resource', 'reportedMember']
      });

      // Verify only modifiable fields are updated
      expect(result.category).toBe(updateReportDto.category);
      expect(result.reason).toBe(updateReportDto.reason);
      expect(result.status).toBe(updateReportDto.status);

      // Verify immutable fields remain unchanged
      expect(result.type).toBe(existingReport.type);
      expect(result.reporter.uuidMember).toBe(existingReport.reporter.uuidMember);
      expect(result.resource?.uuidResource).toBe(existingReport.resource.uuidResource);
    });

    it('should throw NotFoundException when report does not exist', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      const updateReportDto = {
        category: ReportCategory.HARASSMENT,
        reason: 'Updated reason',
        status: 'resolved',
      };

      mockReportsRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(uuid, updateReportDto)).rejects.toThrow(
        new NotFoundException(`Report with UUID ${uuid} not found`)
      );

      expect(mockReportsRepository.findOne).toHaveBeenCalledWith({
        where: { uuidReport: uuid },
        relations: ['reporter', 'resource', 'reportedMember']
      });
      expect(mockReportsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should successfully remove a report when user is the creator', async () => {
      // Arrange
      const mockReporter = {
        uuidMember: '123e4567-e89b-12d3-a456-426614174000',
        guildUsername: 'testuser',
        communityRole: 'Member',
      };

      const mockResource = {
        uuidResource: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Test Resource',
        status: 'active',
      };

      const existingReport = {
        uuidReport: '123e4567-e89b-12d3-a456-426614174002',
        type: ReportType.RESOURCE,
        category: ReportCategory.INAPPROPRIATE,
        reason: 'Test reason',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReportsRepository.findOne
        .mockResolvedValueOnce({
          ...existingReport,
          reporter: mockReporter,
          resource: mockResource,
        })
        .mockResolvedValueOnce({
          ...existingReport,
          reporter: mockReporter,
          resource: mockResource,
        });

      mockReportsRepository.remove.mockResolvedValue(undefined);

      // Act
      await service.remove(existingReport.uuidReport, mockReporter.uuidMember);

      // Assert
      expect(mockReportsRepository.findOne).toHaveBeenCalledWith({
        where: { uuidReport: existingReport.uuidReport },
        relations: ['reporter', 'resource', 'reportedMember']
      });
      expect(mockReportsRepository.remove).toHaveBeenCalledWith({
        ...existingReport,
        reporter: mockReporter,
        resource: mockResource,
      });
    });

    it('should throw NotFoundException when report does not exist', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const currentUserId = '123e4567-e89b-12d3-a456-426614174001';

      mockReportsRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(uuid, currentUserId)).rejects.toThrow(
        new NotFoundException(`Report with UUID ${uuid} not found`)
      );
      expect(mockReportsRepository.findOne).toHaveBeenCalledWith({
        where: { uuidReport: uuid },
        relations: ['reporter', 'resource', 'reportedMember']
      });
      expect(mockReportsRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not the creator', async () => {
      // Arrange
      const mockReporter = {
        uuidMember: '123e4567-e89b-12d3-a456-426614174000',
        guildUsername: 'testuser',
        communityRole: 'Member',
      };

      const mockResource = {
        uuidResource: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Test Resource',
        status: 'active',
      };

      const existingReport = {
        uuidReport: '123e4567-e89b-12d3-a456-426614174002',
        type: ReportType.RESOURCE,
        category: ReportCategory.INAPPROPRIATE,
        reason: 'Test reason',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const currentUserId = '123e4567-e89b-12d3-a456-426614174999'; // Different user

      mockReportsRepository.findOne.mockResolvedValue({
        ...existingReport,
        reporter: mockReporter,
        resource: mockResource,
      });

      // Act & Assert
      await expect(service.remove(existingReport.uuidReport, currentUserId)).rejects.toThrow(
        new ForbiddenException('Vous ne pouvez supprimer que vos propres signalements')
      );
      expect(mockReportsRepository.findOne).toHaveBeenCalledWith({
        where: { uuidReport: existingReport.uuidReport },
        relations: ['reporter', 'resource', 'reportedMember']
      });
      expect(mockReportsRepository.remove).not.toHaveBeenCalled();
    });
  });
}); 