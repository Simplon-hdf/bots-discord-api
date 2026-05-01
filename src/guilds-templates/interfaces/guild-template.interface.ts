import { CreateGuildTemplateDto } from '../dto/create-guild-template.dto';
import { UpdateGuildTemplateDto } from '../dto/update-guild-template.dto';

export interface IGuildsTemplatesService {
  create(createGuildTemplateDto: CreateGuildTemplateDto);
  findAll();
  findOne(uuid: string);
  update(uuid: string, updateGuildTemplateDto: UpdateGuildTemplateDto);
  remove(uuid: string);
}

export const IGuildsTemplatesServiceToken = Symbol('IGuildsTemplatesService');
