import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { Promotion } from './entities/promotion.entity';
import { RolesModule } from 'src/roles/roles.module';
import { Member } from 'src/members/entities/member.entity';
import { IPromotionsServiceToken } from './interfaces/promotion.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion, Member]), RolesModule],
  controllers: [PromotionsController],
  providers: [
    {
      provide: IPromotionsServiceToken,
      useClass: PromotionsService,
    },
  ],
  exports: [IPromotionsServiceToken],
})
export class PromotionsModule {}
