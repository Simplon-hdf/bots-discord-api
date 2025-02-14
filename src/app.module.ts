import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { GuildModule } from './guilds/guilds.module';
import { CampusModule } from './campuses/campuses.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    GuildModule,
    CampusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
