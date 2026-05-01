import { UpdateDiscordUserDto } from '../dto/update-discord-user.dto';
import { CreateDiscordUserDto } from '../dto/create-discord-user.dto';

export interface IDiscordUsersService {
  create(createDiscordUserDto: CreateDiscordUserDto);
  findAll();
  findOne(uuid: string);
  update(uuid: string, updateDiscordUserDto: UpdateDiscordUserDto);
  remove(uuid: string);
}

export const IDiscordUsersServiceToken = Symbol('IDiscordUsersService');
