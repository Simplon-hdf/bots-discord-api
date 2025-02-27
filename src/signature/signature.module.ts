import { Module } from '@nestjs/common';
import { SignatureController } from './signature.controller';
import { SignatureService } from './signature.service';
import { PromotionsModule } from '../promotions/promotions.module';
import { MembersModule } from '../members/members.module';
import { RolesModule } from '../roles/roles.module';
import { GuildsModule } from '../guilds/guilds.module';
import { ChannelsModule } from '../channels/channels.module';

@Module({
  imports: [
    PromotionsModule,
    MembersModule,
    RolesModule,
    GuildsModule,
    ChannelsModule
  ],
  controllers: [SignatureController],
  providers: [SignatureService],
  exports: [SignatureService]
})
export class SignatureModule {} 