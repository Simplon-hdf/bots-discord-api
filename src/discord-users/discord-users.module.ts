import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordUsersService } from './discord-users.service';
import { DiscordUsersController } from './discord-users.controller';
import { DiscordUser } from './entities/discord-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiscordUser])],
  controllers: [DiscordUsersController],
  providers: [DiscordUsersService],
  exports: [DiscordUsersService]
})
export class DiscordUsersModule {} 