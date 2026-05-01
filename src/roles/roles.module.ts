import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { IRolesServicesToken } from './interfaces/role.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [
    {
      provide: IRolesServicesToken,
      useClass: RolesService,
    },
  ],
  exports: [TypeOrmModule, IRolesServicesToken],
})
export class RolesModule {}
