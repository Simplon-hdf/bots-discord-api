import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampusesService } from './campuses.service';
import { CampusesController } from './campuses.controller';
import { Campus } from './entities/campus.entity';
import { RolesModule } from 'src/roles/roles.module';
import { ICampusesServiceToken } from './interfaces/campus.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Campus]), RolesModule],
  controllers: [CampusesController],
  providers: [
    {
      provide: ICampusesServiceToken,
      useClass: CampusesService,
    },
  ],
  exports: [ICampusesServiceToken],
})
export class CampusesModule {}
