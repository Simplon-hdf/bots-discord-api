import { Module } from '@nestjs/common';
import { MemberInformation } from './entities/member-information.entity';
import { MembersInformationsService } from './members-informations.service';
import { MembersInformationsController } from './members-informations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IMembersInformationsServiceToken } from './interfaces/member-information.interface';

@Module({
  imports: [TypeOrmModule.forFeature([MemberInformation])],
  controllers: [MembersInformationsController],
  providers: [
    {
      provide: IMembersInformationsServiceToken,
      useClass: MembersInformationsService,
    },
  ],
  exports: [IMembersInformationsServiceToken],
})
export class MembersInformationsModule {}
