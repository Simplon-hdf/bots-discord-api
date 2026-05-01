import { CreateGuildDto } from '../dto/create-guild.dto';
import { UpdateGuildDto } from '../dto/update-guild.dto';

export interface IGuildsService {
  create(createGuildDto: CreateGuildDto);
  findAll();
  findOne(uuid: string);
  update(uuid: string, updateGuildDto: UpdateGuildDto);
  remove(uuid: string);
}

export const IGuildsServiceToken = Symbol('IGuildsService');
