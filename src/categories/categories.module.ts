import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ICategoriesServiceToken } from './interfaces/category.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [
    {
      provide: ICategoriesServiceToken,
      useClass: CategoriesService,
    },
  ],
  exports: [ICategoriesServiceToken],
})
export class CategoriesModule {}
