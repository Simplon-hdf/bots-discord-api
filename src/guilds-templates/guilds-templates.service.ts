import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGuildTemplateDto } from './dto/create-guild-template.dto';
import { UpdateGuildTemplateDto } from './dto/update-guild-template.dto';
import { GuildTemplate } from './entities/guild-template.entity';
import { IGuildsTemplatesService } from './interfaces/guild-template.interface';

@Injectable()
export class GuildsTemplatesService implements IGuildsTemplatesService {
  constructor(
    @InjectRepository(GuildTemplate)
    private guildTemplateRepository: Repository<GuildTemplate>,
  ) {}

  create(createGuildTemplateDto: CreateGuildTemplateDto) {
    const guildTemplate = this.guildTemplateRepository.create(
      createGuildTemplateDto,
    );
    return this.guildTemplateRepository.save(guildTemplate);
  }

  findAll() {
    return this.guildTemplateRepository.find({
      relations: ['guild', 'category'],
    });
  }

  findOne(uuid: string) {
    return this.guildTemplateRepository.findOne({
      where: { uuid },
      relations: ['guild', 'category'],
    });
  }

  async update(uuid: string, updateGuildTemplateDto: UpdateGuildTemplateDto) {
    const guildTemplate = await this.guildTemplateRepository.findOneBy({
      uuid,
    });
    if (!guildTemplate) {
      return null;
    }

    // Mise à jour des champs autorisés uniquement
    const { name, description, configuration, uuidCategory } =
      updateGuildTemplateDto;
    if (name !== undefined) guildTemplate.name = name;
    if (description !== undefined) guildTemplate.description = description;
    if (configuration !== undefined)
      guildTemplate.configuration = configuration;
    if (uuidCategory !== undefined) guildTemplate.uuidCategory = uuidCategory;

    guildTemplate.updatedAt = new Date();
    return this.guildTemplateRepository.save(guildTemplate);
  }

  remove(uuid: string) {
    return this.guildTemplateRepository.delete({ uuid });
  }
}
