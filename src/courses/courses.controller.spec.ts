import { Test } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  const mockCourse = {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Développeur web',
    isCertified: true,
    uuidCategory: '123456789012345678',
    uuidGuild: '123456789012345678',
    createdAt: new Date(),
    updatedAt: null,
  };

  const mockService = {
    create: vi.fn(),
    findAll: vi.fn(),
    getByUUID: vi.fn(),
    updateByUUID: vi.fn(),
    deleteByUUID: vi.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  describe('create', () => {
    it('should create a course', async () => {
      const dto: CreateCourseDto = {
        name: 'Développeur web',
        isCertified: true,
        uuidCategory: '123456789012345678',
        uuidGuild: '123456789012345678',
        uuidRole: ''
      };

      mockService.create.mockResolvedValue({
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        ...dto,
        createdAt: expect.any(Date),
        updatedAt: null
    });

      const result = await controller.create(dto);

      expect(result).toHaveProperty('uuid');
      expect(result.name).toBe(dto.name);
      expect(result.isCertified).toBe(dto.isCertified);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const courses = [mockCourse, { ...mockCourse, uuid: '456' }];
      mockService.findAll.mockResolvedValue(courses);

      const result = await controller.findAll();

      expect(result).toEqual(courses);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('getByUUID', () => {
    it('should return a course', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      mockService.getByUUID.mockResolvedValue(mockCourse);

      const result = await controller.getByUUID(uuid);

      expect(result).toEqual(mockCourse);
      expect(mockService.getByUUID).toHaveBeenCalledWith(uuid);
    });
  });

  describe('updateByUUID', () => {
    it('should update a course', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCourseDto = {
        name: 'updated-course'
      };
      const updatedCourse = { ...mockCourse, ...updateDto };
      mockService.updateByUUID.mockResolvedValue(updatedCourse);

      const result = await controller.updateByUUID(uuid, updateDto);

      expect(result).toEqual(updatedCourse);
      expect(mockService.updateByUUID).toHaveBeenCalledWith(uuid, updateDto);
    });
  });

  describe('deleteByUUID', () => {
    it('should delete a course', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      mockService.deleteByUUID.mockResolvedValue(undefined);

      await controller.deleteByUUID(uuid);

      expect(mockService.deleteByUUID).toHaveBeenCalledWith(uuid);
    });
  });
});