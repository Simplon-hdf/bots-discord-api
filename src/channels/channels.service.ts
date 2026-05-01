import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';
import { IChannelsService } from './interfaces/channel.interface';

@Injectable()
export class ChannelsService implements IChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  create(createChannelDto: CreateChannelDto) {
    const channel = this.channelRepository.create(createChannelDto);
    return this.channelRepository.save(channel);
  }

  findAll() {
    return this.channelRepository.find({
      relations: ['guild', 'category'],
    });
  }

  findOne(uuid: string) {
    return this.channelRepository.findOne({
      where: { uuid },
      relations: ['guild', 'category'],
    });
  }

  async update(uuid: string, updateChannelDto: UpdateChannelDto) {
    const channel = await this.channelRepository.findOneBy({ uuid });
    if (!channel) {
      return null;
    }

    // Mise à jour des champs autorisés uniquement
    const { name, type, channelPosition, uuidCategory } = updateChannelDto;
    if (name !== undefined) channel.name = name;
    if (type !== undefined) channel.type = type;
    if (channelPosition !== undefined)
      channel.channelPosition = channelPosition;
    if (uuidCategory !== undefined) channel.uuidCategory = uuidCategory;

    channel.updatedAt = new Date();
    return this.channelRepository.save(channel);
  }

  remove(uuid: string) {
    return this.channelRepository.delete({ uuid });
  }
}
