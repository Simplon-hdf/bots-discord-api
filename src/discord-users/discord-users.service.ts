import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiscordUserDto } from './dto/create-discord-user.dto';
import { UpdateDiscordUserDto } from './dto/update-discord-user.dto';
import { DiscordUser } from './entities/discord-user.entity';

@Injectable()
export class DiscordUsersService {
  constructor(
    @InjectRepository(DiscordUser)
    private discordUserRepository: Repository<DiscordUser>,
  ) {}

  create(createDiscordUserDto: CreateDiscordUserDto) {
    const discordUser = this.discordUserRepository.create(createDiscordUserDto);
    return this.discordUserRepository.save(discordUser);
  }

  findAll() {
    return this.discordUserRepository.find();
  }

  findOne(uuidDiscord: string) {
    return this.discordUserRepository.findOneBy({ uuidDiscord });
  }

  async update(uuidDiscord: string, updateDiscordUserDto: UpdateDiscordUserDto) {
    const discordUser = await this.discordUserRepository.findOneBy({ uuidDiscord });
    if (!discordUser) {
      return null;
    }
    
    const { discordUsername, discriminator } = updateDiscordUserDto;
    if (discordUsername !== undefined) discordUser.discordUsername = discordUsername;
    if (discriminator !== undefined) discordUser.discriminator = discriminator;
    
    discordUser.updatedAt = new Date();
    return this.discordUserRepository.save(discordUser);
  }

  remove(uuidDiscord: string) {
    return this.discordUserRepository.delete({ uuidDiscord });
  }
} 