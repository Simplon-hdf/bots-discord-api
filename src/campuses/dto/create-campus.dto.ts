import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { PickableDtoFields } from 'src/utils/pickable-dto-fields';
import { PickableDiscordUUIDFields } from 'src/utils/pickable-discord-uuid-fields';
import { IsNotEmpty, Length, Matches } from 'class-validator';
import { IsString } from 'class-validator';

export class CreateCampusDto extends PickType(IntersectionType(PickableDtoFields, PickableDiscordUUIDFields), [
  'name',
  'uuidRole',
  'uuidGuild'
]) { 
  @ApiProperty({
    description: 'ID Discord du campus',
    example: '123456789012345678',
  })
  @IsNotEmpty()
  @IsString()
  @Length(17, 19)
  @Matches(/^\d+$/)
  uuid: string;
}
