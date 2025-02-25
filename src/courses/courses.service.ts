import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Role } from 'src/roles/entities/role.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,

        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,

    ) {}

    async create(createCourseDto: CreateCourseDto): Promise<Course> {
        try {
            const existingCourse = await this.courseRepository.findOne({
                where: { name: createCourseDto.name },
            });
    
            if (existingCourse) {
                throw new ConflictException(`Course with name ${createCourseDto.name} already exists`);
            }

            const courseData = {
                name: createCourseDto.name,
                isCertified: createCourseDto.isCertified,
                uuidGuild: createCourseDto.uuidGuild,
                uuidCategory: createCourseDto.uuidCategory,
            };

            const newCourse = this.courseRepository.create(courseData);
            const savedCourse = await this.courseRepository.save(newCourse);

            if (createCourseDto.uuidRole) {
                const role = await this.roleRepository.findOne({
                    where: { uuidRole: createCourseDto.uuidRole }
                });

                if (role) {
                    await this.courseRepository
                        .createQueryBuilder()
                        .relation(Course, "roles")
                        .of(savedCourse)
                        .add(role.uuidRole);
                }
            }

            const courseWithRelations = await this.courseRepository.findOne({
                where: { uuid: savedCourse.uuid },
                relations: {
                    category: true,
                    guild: true,
                    roles: true,
                    promotions: true,
                    channels: true
                }
            });

            if (!courseWithRelations) {
                throw new NotFoundException(`Course with UUID ${savedCourse.uuid} not found after creation`);
            }

            return courseWithRelations;
        } catch (error) {
            throw new BadRequestException('Erreur lors de la création du cours: ' + error.message);
        }
    }    

    async findAll(): Promise<Course[]> {
        return await this.courseRepository.find({
            relations: ['category', 'guild', 'roles', 'promotions', 'channels'],
        });
    }

    async getByUUID(uuid: string): Promise<Course> {
        const course = await this.courseRepository.findOne({
            where: { uuid },
            relations: ['category', 'guild', 'roles', 'promotions', 'channels'],
        });

        if (!course) {
            throw new NotFoundException(`Course with UUID ${uuid} not found`);
        }
        return course;
    }

    async updateByUUID(uuid: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
        const course = await this.courseRepository.findOne({
            where: { uuid },
            relations: ['category', 'guild', 'roles', 'promotions', 'channels']
        });

        if (!course) {
            throw new NotFoundException(`Course with UUID ${uuid} not found`);
        }

        if (updateCourseDto.name) {
            const existingCourse = await this.courseRepository.findOne({
                where: { name: updateCourseDto.name },
            });
            if (existingCourse && existingCourse.uuid !== uuid) {
                throw new ConflictException(`Course with name ${updateCourseDto.name} already exists`);
            }
        }

        Object.assign(course, updateCourseDto);
        return await this.courseRepository.save(course);
    }

    async deleteByUUID(uuid: string): Promise<void> {
        const course = await this.courseRepository.findOne({ 
            where: { uuid } 
        });

        if (!course) {
            throw new NotFoundException(`Course with UUID ${uuid} not found`);
        }
        const result = await this.courseRepository.delete({ uuid });
        if (result.affected === 0) {
            throw new BadRequestException('Failed to delete course');
        }
    }
}
