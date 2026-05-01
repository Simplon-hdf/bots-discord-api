import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Course } from '../entities/course.entity';

export interface ICoursesService {
  create(createCourseDto: CreateCourseDto): Promise<Course>;
  findAll(): Promise<Course[]>;
  getByUUID(uuid: string): Promise<Course>;
  updateByUUID(uuid: string, updateCourseDto: UpdateCourseDto): Promise<Course>;
  deleteByUUID(uuid: string): Promise<void>;
}

export const ICoursesServiceToken = Symbol('ICoursesService');
