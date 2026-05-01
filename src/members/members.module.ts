import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { RolesModule } from 'src/roles/roles.module';
import { IMembersServiceToken } from './interfaces/member.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), RolesModule],
  controllers: [MembersController],
  providers: [
    {
      provide: IMembersServiceToken,
      useClass: MembersService,
    },
  ],
  exports: [IMembersServiceToken],
})
export class MembersModule {}
