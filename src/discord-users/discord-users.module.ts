import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordUsersService } from './discord-users.service';
import { DiscordUsersController } from './discord-users.controller';
import { DiscordUser } from './entities/discord-user.entity';
import { IDiscordUsersServiceToken } from './interfaces/discord-user.interface';

@Module({
  imports: [TypeOrmModule.forFeature([DiscordUser])],
  controllers: [DiscordUsersController],
  providers: [
    {
      provide: IDiscordUsersServiceToken,
      useClass: DiscordUsersService,
    },
  ],
  exports: [IDiscordUsersServiceToken],
})
export class DiscordUsersModule {}
