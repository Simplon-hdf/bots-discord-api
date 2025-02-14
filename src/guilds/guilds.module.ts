import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuildService } from './guilds.service';
import { GuildController } from './guilds.controller';
import { Guild } from './entities/guild.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guild])],
  controllers: [GuildController],
  providers: [GuildService],
})
export class GuildModule {}
