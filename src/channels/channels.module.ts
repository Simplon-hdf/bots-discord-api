import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { Channel } from './entities/channel.entity';
import { IChannelsServiceToken } from './interfaces/channel.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Channel])],
  controllers: [ChannelsController],
  providers: [
    {
      provide: IChannelsServiceToken,
      useClass: ChannelsService,
    },
  ],
  exports: [IChannelsServiceToken],
})
export class ChannelsModule {}
