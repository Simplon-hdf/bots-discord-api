import { IntersectionType, PickType } from '@nestjs/swagger';
import { PickableDtoFields } from 'src/utils/pickable-dto-fields';
import { PickableDiscordUUIDFields } from 'src/utils/pickable-discord-uuid-fields';

export class CreateCampusDto extends PickType(IntersectionType(PickableDtoFields, PickableDiscordUUIDFields), [
  'name',
  'uuidRole',
  'uuidGuild'
]) { 
}
