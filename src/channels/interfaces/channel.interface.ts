import { CreateChannelDto } from '../dto/create-channel.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';

export interface IChannelsService {
  create(createChannelDto: CreateChannelDto);
  findAll();
  findOne(uuid: string);
  update(uuid: string, updateChannelDto: UpdateChannelDto);
  remove(uuid: string);
}

export const IChannelsServiceToken = Symbol('IChannelsService');
