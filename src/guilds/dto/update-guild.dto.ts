import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateGuildDto } from './create-guild.dto';

export class UpdateGuildDto extends PartialType(
  OmitType(CreateGuildDto, ['uuid'] as const),
) {}
