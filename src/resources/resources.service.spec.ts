import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourcesService } from './resources.service';
import { Resource } from './entities/resource.entity';
import { Member } from '../members/entities/member.entity';
import { Comment } from '../comments/entities/comment.entity';
import { CreateResourceDto } from './dto/create-resource.dto';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ResourcesService', () => {
  let service: ResourcesService;
  let resourceRepository: Repository<Resource>;
  let memberRepository: Repository<Member>;
  let commentRepository: Repository<Comment>;

  const mockResourceRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
  };

  const mockMemberRepository = {
    findOne: vi.fn(),
  };

  const mockCommentRepository = {
    find: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourcesService,
        {
          provide: getRepositoryToken(Resource),
          useValue: mockResourceRepository,
        },
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository,
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
    resourceRepository = module.get<Repository<Resource>>(getRepositoryToken(Resource));
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));

    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a resource', async () => {
      // Arrange
      const mockMember = {
        uuidMember: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        status: 'active',
      };

      const createResourceDto: CreateResourceDto = {
        title: 'Test Resource',
        description: 'Test Description',
        content: 'Test Content',
        status: 'active',
        uuidMember: mockMember.uuidMember,
      };

      const mockCreatedResource = {
        uuidResource: '123e4567-e89b-12d3-a456-426614174001',
        ...createResourceDto,
        creator: mockMember,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMemberRepository.findOne.mockResolvedValue(mockMember);
      mockResourceRepository.create.mockReturnValue(mockCreatedResource);
      mockResourceRepository.save.mockResolvedValue(mockCreatedResource);
      mockResourceRepository.findOne.mockResolvedValue({
        ...mockCreatedResource,
        comments: [],
        votes: [],
        reports: [],
      });

      // Act
      const result = await service.create(createResourceDto);

      // Assert
      expect(mockMemberRepository.findOne).toHaveBeenCalledWith({
        where: { uuidMember: createResourceDto.uuidMember },
      });
      expect(mockResourceRepository.create).toHaveBeenCalledWith({
        title: createResourceDto.title,
        description: createResourceDto.description,
        content: createResourceDto.content,
        status: createResourceDto.status,
        creator: mockMember,
        creatorUuid: mockMember.uuidMember,
      });
      expect(mockResourceRepository.save).toHaveBeenCalledWith(mockCreatedResource);
      expect(result).toBeDefined();
      expect(result.title).toBe(createResourceDto.title);
    });

    it('should throw error when creator does not exist', async () => {
      // Arrange
      const createResourceDto: CreateResourceDto = {
        title: 'Test Resource',
        description: 'Test Description',
        content: 'Test Content',
        status: 'active',
        uuidMember: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockMemberRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createResourceDto)).rejects.toThrow(
        `Member with UUID ${createResourceDto.uuidMember} not found`
      );
      expect(mockMemberRepository.findOne).toHaveBeenCalledWith({
        where: { uuidMember: createResourceDto.uuidMember },
      });
      expect(mockResourceRepository.create).not.toHaveBeenCalled();
      expect(mockResourceRepository.save).not.toHaveBeenCalled();
    });
  });
}); 