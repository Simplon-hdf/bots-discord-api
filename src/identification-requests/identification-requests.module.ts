import { Module } from '@nestjs/common';
import { IdentificationRequestsService } from './identification-requests.service';
import { IdentificationRequestsController } from './identification-requests.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentificationRequest } from './entities/identification-request.entity';
import { IIdentificationRequestsServiceToken } from './interfaces/identification-request.interface';

@Module({
  imports: [TypeOrmModule.forFeature([IdentificationRequest])],
  controllers: [IdentificationRequestsController],
  providers: [
    {
      provide: IIdentificationRequestsServiceToken,
      useClass: IdentificationRequestsService,
    },
  ],
  exports: [IIdentificationRequestsServiceToken],
})
export class IdentificationRequestsModule {}
