import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';

describe('ResourcesController', () => {
  let controller: ResourcesController;
  let service: ResourcesService;

  const mockResourcesService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    findComments: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourcesController],
      providers: [
        {
          provide: ResourcesService,
          useValue: mockResourcesService,
        },
      ],
    }).compile();

    controller = module.get<ResourcesController>(ResourcesController);
    service = module.get<ResourcesService>(ResourcesService);

    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new resource', async () => {
      // Arrange
      const createResourceDto: CreateResourceDto = {
        title: 'Test Resource',
        description: 'Test Description',
        content: 'Test Content',
        status: 'active',
        uuidMember: '123e4567-e89b-12d3-a456-426614174000',
      };

      const expectedResult = {
        uuidResource: '123e4567-e89b-12d3-a456-426614174001',
        ...createResourceDto,
        creator: {
          uuidMember: createResourceDto.uuidMember,
          username: 'testuser',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockResourcesService.create.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(createResourceDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(createResourceDto);
      expect(result).toBe(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of resources', async () => {
      // Arrange
      const expectedResult = [
        {
          uuidResource: '123e4567-e89b-12d3-a456-426614174001',
          title: 'First Resource',
          description: 'First Description',
          content: 'First Content',
          status: 'active',
          creator: {
            uuidMember: '123e4567-e89b-12d3-a456-426614174000',
            username: 'testuser',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuidResource: '123e4567-e89b-12d3-a456-426614174002',
          title: 'Second Resource',
          description: 'Second Description',
          content: 'Second Content',
          status: 'active',
          creator: {
            uuidMember: '123e4567-e89b-12d3-a456-426614174000',
            username: 'testuser',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockResourcesService.findAll.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single resource', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      const expectedResult = {
        uuidResource: uuid,
        title: 'Test Resource',
        description: 'Test Description',
        content: 'Test Content',
        status: 'active',
        creator: {
          uuidMember: '123e4567-e89b-12d3-a456-426614174000',
          username: 'testuser',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockResourcesService.findOne.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findOne(uuid);

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(uuid);
      expect(result).toBe(expectedResult);
    });

    it('should throw NotFoundException when resource does not exist', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      mockResourcesService.findOne.mockRejectedValue(
        new NotFoundException(`Resource with UUID ${uuid} not found`)
      );

      // Act & Assert
      await expect(controller.findOne(uuid)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(uuid);
    });
  });

  describe('update', () => {
    it('should update a resource', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      const updateResourceDto: UpdateResourceDto = {
        title: 'Updated Resource',
        description: 'Updated Description',
      };

      const expectedResult = {
        uuidResource: uuid,
        ...updateResourceDto,
        content: 'Original Content',
        status: 'active',
        creator: {
          uuidMember: '123e4567-e89b-12d3-a456-426614174000',
          username: 'testuser',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockResourcesService.update.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.update(uuid, updateResourceDto);

      // Assert
      expect(service.update).toHaveBeenCalledWith(uuid, updateResourceDto);
      expect(result).toBe(expectedResult);
    });

    it('should throw NotFoundException when updating non-existent resource', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      const updateResourceDto: UpdateResourceDto = {
        title: 'Updated Resource',
      };

      mockResourcesService.update.mockRejectedValue(
        new NotFoundException(`Resource with UUID ${uuid} not found`)
      );

      // Act & Assert
      await expect(controller.update(uuid, updateResourceDto)).rejects.toThrow(
        NotFoundException
      );
      expect(service.update).toHaveBeenCalledWith(uuid, updateResourceDto);
    });
  });

  describe('remove', () => {
    it('should remove a resource', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      mockResourcesService.remove.mockResolvedValue(undefined);

      // Act
      await controller.remove(uuid);

      // Assert
      expect(service.remove).toHaveBeenCalledWith(uuid);
    });

    it('should throw NotFoundException when removing non-existent resource', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      mockResourcesService.remove.mockRejectedValue(
        new NotFoundException(`Resource with UUID ${uuid} not found`)
      );

      // Act & Assert
      await expect(controller.remove(uuid)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(uuid);
    });
  });

  describe('findComments', () => {
    it('should return comments for a resource', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      const expectedResult = [
        {
          uuidComment: '123e4567-e89b-12d3-a456-426614174002',
          content: 'First Comment',
          member: {
            uuidMember: '123e4567-e89b-12d3-a456-426614174000',
            username: 'testuser',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuidComment: '123e4567-e89b-12d3-a456-426614174003',
          content: 'Second Comment',
          member: {
            uuidMember: '123e4567-e89b-12d3-a456-426614174000',
            username: 'testuser',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockResourcesService.findComments.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findComments(uuid);

      // Assert
      expect(service.findComments).toHaveBeenCalledWith(uuid);
      expect(result).toBe(expectedResult);
    });

    it('should throw NotFoundException when resource does not exist', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      mockResourcesService.findComments.mockRejectedValue(
        new NotFoundException(`Resource with UUID ${uuid} not found`)
      );

      // Act & Assert
      await expect(controller.findComments(uuid)).rejects.toThrow(NotFoundException);
      expect(service.findComments).toHaveBeenCalledWith(uuid);
    });

    it('should return empty array when resource has no comments', async () => {
      // Arrange
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      mockResourcesService.findComments.mockResolvedValue([]);

      // Act
      const result = await controller.findComments(uuid);

      // Assert
      expect(service.findComments).toHaveBeenCalledWith(uuid);
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });
}); 