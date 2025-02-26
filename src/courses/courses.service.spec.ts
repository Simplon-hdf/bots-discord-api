import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateCourseDto } from './dto/create-course.dto';

describe('CoursesService', () => {
  let service: CoursesService;
  let repository: Repository<Course>;

  const mockCourse = {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Développeur web',
    isCertified: true,
    createdAt: new Date(),
    updatedAt: null,
    uuidCategory: '123456789012345678',
    uuidGuild: '123456789012345678',
  };

  const mockRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    repository = module.get<Repository<Course>>(getRepositoryToken(Course));
  });

  describe('create', () => {
    it('should create a course without role', async () => {
      const dto = {
          name: 'Développeur web',
          isCertified: true,
          uuidCategory: '123456789012345678',
          uuidGuild: '123456789012345678',
          uuidRole: ''
      };  

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockCourse);
      mockRepository.save.mockResolvedValue(mockCourse);

      const result = await service.create(dto);
      expect(result).toEqual(mockCourse);
  });

  it('should create a course with role', async () => {
      const dto = {
          name: 'Développeur web',
          isCertified: true,
          uuidCategory: '123456789012345678',
          uuidGuild: '123456789012345678',
          uuidRole: '123456789012345678'
      } as CreateCourseDto;  // Utiliser type assertion

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockCourse);
      mockRepository.save.mockResolvedValue(mockCourse);

      const result = await service.create(dto);
      expect(result).toEqual(mockCourse);
    });

    it('should throw ConflictException if course name exists', async () => {
      const dto = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Développeur web',
        uuidCategory: '123456789012345678',
        uuidGuild: '123456789012345678',
        isCertified: true,
        uuidRole: '123456789012345678'
      };

      mockRepository.findOne.mockResolvedValue(mockCourse);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const courses = [mockCourse, { ...mockCourse, uuid: '456' }];
      mockRepository.find.mockResolvedValue(courses);

      const result = await service.findAll();

      expect(result).toEqual(courses);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['category', 'guild', 'roles', 'promotions', 'channels']
      });
    });

    it('should return empty array when no courses exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['category', 'guild', 'roles', 'promotions', 'channels']
      });
    });
  });

  describe('getByUUID', () => {
    it('should return a course', async () => {
      mockRepository.findOne.mockResolvedValue(mockCourse);

      const result = await service.getByUUID(mockCourse.uuid);

      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException when course not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getByUUID('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateByUUID', () => {
    it('should update a course', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto = {
        name: 'updated-course',
        isCertified: false
      };
      const updatedCourse = { ...mockCourse, ...updateDto };

      mockRepository.findOne.mockResolvedValue({
        ...mockCourse,
        relations: ['category', 'guild', 'roles', 'promotions', 'channels']
      });
      mockRepository.save.mockResolvedValue(updatedCourse);

      const result = await service.updateByUUID(uuid, updateDto);

      expect(result).toEqual(updatedCourse);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: uuid },
        relations: ['category', 'guild', 'roles', 'promotions', 'channels']
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockCourse,
        ...updateDto,
        relations: ['category', 'guild', 'roles', 'promotions', 'channels']
      });
    });

    it('should throw NotFoundException when updating non-existent course', async () => {
      const uuid = 'non-existent';
      const updateDto = { name: 'updated-course' };

      mockRepository.findOne.mockReset();
      mockRepository.save.mockReset();

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateByUUID(uuid, updateDto))
        .rejects
        .toThrow(NotFoundException);
      
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: uuid },
        relations: ['category', 'guild', 'roles', 'promotions', 'channels']
      });

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when updating to existing course name', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto = { name: 'existing-course' };

      mockRepository.findOne.mockReset();

      mockRepository.findOne
      .mockResolvedValueOnce({
          ...mockCourse,
          category: {},
          guild: {},
          roles: [],
          promotions: [],
          channels: []
      })
      .mockResolvedValueOnce({ 
        ...mockCourse, 
        uuid: 'different-uuid',
        name: 'existing-course' 
      }); 

      await expect(service.updateByUUID(uuid, updateDto))
        .rejects
        .toThrow(ConflictException);
        
      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);    
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should load all relations when updating', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto = { name: 'updated-course' };
      
      const courseWithRelations = {
          ...mockCourse,
          category: { id: 1 },
          guild: { id: 1 },
          roles: [{ id: 1 }],
          promotions: [{ id: 1 }],
          channels: [{ id: 1 }]
      };
  
      mockRepository.findOne.mockResolvedValue(courseWithRelations);
      mockRepository.save.mockResolvedValue({ ...courseWithRelations, ...updateDto });
  
      const result = await service.updateByUUID(uuid, updateDto);
  
      expect(result.category).toBeDefined();
      expect(result.guild).toBeDefined();
      expect(result.roles).toBeDefined();
      expect(result.promotions).toBeDefined();
      expect(result.channels).toBeDefined();
    });
  });

  describe('deleteByUUID', () => {
    it('should delete a course', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      
      mockRepository.findOne.mockResolvedValue(mockCourse);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteByUUID(uuid);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: uuid }
      });
      expect(mockRepository.delete).toHaveBeenCalledWith({ uuid: uuid });
    });

    it('should throw NotFoundException when deleting non-existent course', async () => {
      const uuid = 'non-existent';

      mockRepository.findOne.mockReset();
      mockRepository.delete.mockReset();

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteByUUID(uuid))
        .rejects
        .toThrow(NotFoundException);

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: uuid }
      });
      
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if delete operation fails', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';

      mockRepository.findOne.mockReset();
      mockRepository.delete.mockReset();
      
      mockRepository.findOne.mockResolvedValue(mockCourse);
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteByUUID(uuid))
        .rejects
        .toThrow('Failed to delete course');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: uuid }
      });

      expect(mockRepository.delete).toHaveBeenCalledWith({ uuid: uuid });
    });
  });
});