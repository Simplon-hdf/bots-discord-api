import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { GuildModule } from './guilds/guilds.module';
import { CampusModule } from './campuses/campuses.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    GuildModule,
    CampusModule,
    MembersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
