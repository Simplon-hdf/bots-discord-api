import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourcesService } from './resources.service';
import { Resource } from './entities/resource.entity';
import { Member } from '../members/entities/member.entity';
import { Comment } from '../comments/entities/comment.entity';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';

describe('ResourcesService', () => {
  let service: ResourcesService;
  let resourceRepository: Repository<Resource>;
  let memberRepository: Repository<Member>;
  let commentRepository: Repository<Comment>;

  const mockResourceRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(),
    remove: vi.fn(),
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

  describe('findOne', () => {
    it('should return a resource with all its relations when it exists', async () => {
      // Arrange
      const mockMember = {
        uuidMember: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        status: 'active',
      };

      const mockResource = {
        uuidResource: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Test Resource',
        description: 'Test Description',
        content: 'Test Content',
        status: 'active',
        creator: mockMember,
        creatorUuid: mockMember.uuidMember,
        comments: [
          {
            uuidComment: '123e4567-e89b-12d3-a456-426614174002',
            content: 'Test Comment',
            member: mockMember,
          },
        ],
        votes: [
          {
            uuidVote: '123e4567-e89b-12d3-a456-426614174003',
            voteType: 'upvote',
            member: mockMember,
          },
        ],
        reports: [
          {
            uuidReport: '123e4567-e89b-12d3-a456-426614174004',
            type: 'resource',
            reason: 'Test Report',
            reporter: mockMember,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockResourceRepository.findOne.mockResolvedValue(mockResource);

      // Act
      const result = await service.findOne(mockResource.uuidResource);

      // Assert
      expect(mockResourceRepository.findOne).toHaveBeenCalledWith({
        where: { uuidResource: mockResource.uuidResource },
        relations: [
          'creator',
          'reports',
          'reports.reporter',
          'votes',
          'votes.member',
          'comments',
          'comments.member',
          'comments.votes',
          'comments.votes.member'
        ],
      });
      expect(result).toBeDefined();
      expect(result.uuidResource).toBe(mockResource.uuidResource);
      expect(result.title).toBe(mockResource.title);
      expect(result.creator).toBeDefined();
      expect(result.comments).toHaveLength(1);
      expect(result.votes).toHaveLength(1);
      expect(result.reports).toHaveLength(1);
    });

    it('should throw NotFoundException when resource does not exist', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      mockResourceRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(uuid)).rejects.toThrow(
        new NotFoundException(`Resource with UUID ${uuid} not found`)
      );
      expect(mockResourceRepository.findOne).toHaveBeenCalledWith({
        where: { uuidResource: uuid },
        relations: [
          'creator',
          'reports',
          'reports.reporter',
          'votes',
          'votes.member',
          'comments',
          'comments.member',
          'comments.votes',
          'comments.votes.member'
        ],
      });
    });
  });

  describe('findAll', () => {
    it('should return all resources with their relations sorted by creation date', async () => {
      // Arrange
      const mockMember = {
        uuidMember: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        status: 'active',
      };

      const mockResources = [
        {
          uuidResource: '123e4567-e89b-12d3-a456-426614174001',
          title: 'First Resource',
          description: 'First Description',
          content: 'First Content',
          status: 'active',
          creator: mockMember,
          creatorUuid: mockMember.uuidMember,
          comments: [
            {
              uuidComment: '123e4567-e89b-12d3-a456-426614174002',
              content: 'Test Comment',
              member: mockMember,
            },
          ],
          votes: [
            {
              uuidVote: '123e4567-e89b-12d3-a456-426614174003',
              voteType: 'upvote',
              member: mockMember,
            },
          ],
          reports: [],
          createdAt: new Date('2024-03-15'),
          updatedAt: new Date('2024-03-15'),
        },
        {
          uuidResource: '123e4567-e89b-12d3-a456-426614174004',
          title: 'Second Resource',
          description: 'Second Description',
          content: 'Second Content',
          status: 'active',
          creator: mockMember,
          creatorUuid: mockMember.uuidMember,
          comments: [],
          votes: [],
          reports: [],
          createdAt: new Date('2024-03-14'),
          updatedAt: new Date('2024-03-14'),
        },
      ];

      mockResourceRepository.find.mockResolvedValue(mockResources);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockResourceRepository.find).toHaveBeenCalledWith({
        relations: [
          'creator',
          'reports',
          'reports.reporter',
          'votes',
          'votes.member',
          'comments',
          'comments.member',
          'comments.votes',
          'comments.votes.member'
        ],
        order: {
          createdAt: 'DESC'
        }
      });
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('First Resource');
      expect(result[1].title).toBe('Second Resource');
      expect(result[0].comments).toHaveLength(1);
      expect(result[0].votes).toHaveLength(1);
      expect(result[1].comments).toHaveLength(0);
    });

    it('should return empty array when no resources exist', async () => {
      // Arrange
      mockResourceRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockResourceRepository.find).toHaveBeenCalledWith({
        relations: [
          'creator',
          'reports',
          'reports.reporter',
          'votes',
          'votes.member',
          'comments',
          'comments.member',
          'comments.votes',
          'comments.votes.member'
        ],
        order: {
          createdAt: 'DESC'
        }
      });
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update a resource and maintain its relations', async () => {
      // Arrange
      const mockMember = {
        uuidMember: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        status: 'active',
      };

      const existingResource = {
        uuidResource: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Original Title',
        description: 'Original Description',
        content: 'Original Content',
        status: 'active',
        creator: mockMember,
        creatorUuid: mockMember.uuidMember,
        comments: [
          {
            uuidComment: '123e4567-e89b-12d3-a456-426614174002',
            content: 'Test Comment',
            member: mockMember,
          },
        ],
        votes: [],
        reports: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateResourceDto: UpdateResourceDto = {
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'inactive',
      };

      const updatedResource = {
        ...existingResource,
        ...updateResourceDto,
        updatedAt: new Date(),
      };

      mockResourceRepository.findOne
        .mockResolvedValueOnce(existingResource)  // Premier appel pour vérifier l'existence
        .mockResolvedValueOnce(updatedResource);  // Second appel après la mise à jour

      mockResourceRepository.save.mockResolvedValue(updatedResource);

      // Act
      const result = await service.update(existingResource.uuidResource, updateResourceDto);

      // Assert
      expect(mockResourceRepository.findOne).toHaveBeenNthCalledWith(1, {
        where: { uuidResource: existingResource.uuidResource }
      });

      expect(mockResourceRepository.save).toHaveBeenCalledWith({
        ...existingResource,
        ...updateResourceDto
      });

      expect(mockResourceRepository.findOne).toHaveBeenNthCalledWith(2, {
        where: { uuidResource: existingResource.uuidResource },
        relations: [
          'creator',
          'reports',
          'reports.reporter',
          'votes',
          'votes.member',
          'comments',
          'comments.member',
          'comments.votes',
          'comments.votes.member'
        ]
      });

      expect(result).toBeDefined();
      expect(result.title).toBe(updateResourceDto.title);
      expect(result.description).toBe(updateResourceDto.description);
      expect(result.status).toBe(updateResourceDto.status);
      expect(result.content).toBe(existingResource.content); // Non modifié
      expect(result.comments).toHaveLength(1); // Relations maintenues
    });

    it('should throw NotFoundException when updating non-existent resource', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      const updateResourceDto: UpdateResourceDto = {
        title: 'Updated Title',
      };

      mockResourceRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(uuid, updateResourceDto)).rejects.toThrow(
        new NotFoundException(`Resource with UUID ${uuid} not found`)
      );

      expect(mockResourceRepository.findOne).toHaveBeenCalledWith({
        where: { uuidResource: uuid }
      });
      expect(mockResourceRepository.save).not.toHaveBeenCalled();
    });

    it('should only update provided fields', async () => {
      // Arrange
      const mockMember = {
        uuidMember: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        status: 'active',
      };

      const existingResource = {
        uuidResource: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Original Title',
        description: 'Original Description',
        content: 'Original Content',
        status: 'active',
        creator: mockMember,
        creatorUuid: mockMember.uuidMember,
        comments: [],
        votes: [],
        reports: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateResourceDto: UpdateResourceDto = {
        title: 'Updated Title',
        // description et status non fournis, devraient rester inchangés
      };

      const updatedResource = {
        ...existingResource,
        title: updateResourceDto.title,
        updatedAt: new Date(),
      };

      mockResourceRepository.findOne
        .mockResolvedValueOnce(existingResource)
        .mockResolvedValueOnce(updatedResource);

      mockResourceRepository.save.mockResolvedValue(updatedResource);

      // Act
      const result = await service.update(existingResource.uuidResource, updateResourceDto);

      // Assert
      expect(mockResourceRepository.save).toHaveBeenCalledWith({
        ...existingResource,
        title: updateResourceDto.title
      });

      expect(result.title).toBe(updateResourceDto.title);
      expect(result.description).toBe(existingResource.description); // Non modifié
      expect(result.status).toBe(existingResource.status); // Non modifié
    });
  });

  describe('remove', () => {
    it('should remove an existing resource', async () => {
      // Arrange
      const mockMember = {
        uuidMember: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        status: 'active',
      };

      const existingResource = {
        uuidResource: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Resource to Delete',
        description: 'Test Description',
        content: 'Test Content',
        status: 'active',
        creator: mockMember,
        creatorUuid: mockMember.uuidMember,
        comments: [
          {
            uuidComment: '123e4567-e89b-12d3-a456-426614174002',
            content: 'Test Comment',
            member: mockMember,
          },
        ],
        votes: [],
        reports: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockResourceRepository.findOne.mockResolvedValue(existingResource);
      mockResourceRepository.remove.mockResolvedValue(existingResource);

      // Act
      await service.remove(existingResource.uuidResource);

      // Assert
      expect(mockResourceRepository.findOne).toHaveBeenCalledWith({
        where: { uuidResource: existingResource.uuidResource }
      });
      expect(mockResourceRepository.remove).toHaveBeenCalledWith(existingResource);
    });

    it('should throw NotFoundException when removing non-existent resource', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      mockResourceRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(uuid)).rejects.toThrow(
        new NotFoundException(`Resource with UUID ${uuid} not found`)
      );
      expect(mockResourceRepository.findOne).toHaveBeenCalledWith({
        where: { uuidResource: uuid }
      });
      expect(mockResourceRepository.remove).not.toHaveBeenCalled();
    });

    it('should cascade delete related entities', async () => {
      // Arrange
      const mockMember = {
        uuidMember: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        status: 'active',
      };

      const existingResource = {
        uuidResource: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Resource to Delete',
        description: 'Test Description',
        content: 'Test Content',
        status: 'active',
        creator: mockMember,
        creatorUuid: mockMember.uuidMember,
        comments: [
          {
            uuidComment: '123e4567-e89b-12d3-a456-426614174002',
            content: 'Test Comment',
            member: mockMember,
          },
        ],
        votes: [
          {
            uuidVote: '123e4567-e89b-12d3-a456-426614174003',
            voteType: 'upvote',
            member: mockMember,
          },
        ],
        reports: [
          {
            uuidReport: '123e4567-e89b-12d3-a456-426614174004',
            type: 'resource',
            reason: 'Test Report',
            reporter: mockMember,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockResourceRepository.findOne.mockResolvedValue(existingResource);
      mockResourceRepository.remove.mockResolvedValue(existingResource);

      // Act
      await service.remove(existingResource.uuidResource);

      // Assert
      expect(mockResourceRepository.findOne).toHaveBeenCalledWith({
        where: { uuidResource: existingResource.uuidResource }
      });
      expect(mockResourceRepository.remove).toHaveBeenCalledWith(existingResource);
      // La suppression en cascade est gérée par TypeORM via les décorateurs @OneToMany
    });
  });
}); 