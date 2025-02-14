import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';
import { Guild } from './entities/guild.entity';

@Injectable()
export class GuildService {
  constructor(
    @InjectRepository(Guild)
    private guildRepository: Repository<Guild>,
  ) {}

  // Créer une nouvelle guild
  create(createGuildDto: CreateGuildDto) {
    const guild = this.guildRepository.create(createGuildDto);
    return this.guildRepository.save(guild);
  }

  // Récupérer toutes les guilds
  findAll() {
    return this.guildRepository.find();
  }

  // Récupérer une guild par son uuid
  findOne(uuid: string) {
    return this.guildRepository.findOneBy({ uuid });
  }

  // Mettre à jour une guild
  async update(uuid: string, updateGuildDto: UpdateGuildDto) {
    const guild = await this.guildRepository.findOneBy({ uuid });
    if (!guild) {
      return null;
    }
    Object.assign(guild, updateGuildDto);
    guild.updatedAt = new Date();
    return this.guildRepository.save(guild);
  }

  // Supprimer une guild
  remove(uuid: string) {
    return this.guildRepository.delete({ uuid });
  }
}
