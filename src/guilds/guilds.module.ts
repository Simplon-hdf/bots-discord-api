import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuildsService } from './guilds.service';
import { GuildsController } from './guilds.controller';
import { Guild } from './entities/guild.entity';
import { IGuildsServiceToken } from './interfaces/guild.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Guild])],
  controllers: [GuildsController],
  providers: [
    {
      provide: IGuildsServiceToken,
      useClass: GuildsService,
    },
  ],
  exports: [IGuildsServiceToken],
})
export class GuildsModule {}
