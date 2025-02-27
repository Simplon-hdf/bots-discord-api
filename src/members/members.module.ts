import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), RolesModule],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService]
})
export class MembersModule {}
