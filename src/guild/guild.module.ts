import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuildService } from './guild.service';
import { GuildController } from './guild.controller';
import { Guild } from './entities/guild.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guild])],
  controllers: [GuildController],
  providers: [GuildService],
})
export class GuildModule {}
