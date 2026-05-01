import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { Category } from '../categories/entities/category.entity';
import { Guild } from '../guilds/entities/guild.entity';
import { RolesModule } from '../roles/roles.module';
import { ICoursesServiceToken } from './interfaces/course.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Category, Guild]), RolesModule],
  controllers: [CoursesController],
  providers: [
    {
      provide: ICoursesServiceToken,
      useClass: CoursesService,
    },
  ],
  exports: [ICoursesServiceToken],
})
export class CoursesModule {}
