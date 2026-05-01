import { IsString, IsInt, IsEnum, MaxLength, Min, Length } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { PickableDiscordUUIDFields } from 'src/utils/pickable-discord-uuid-fields';

enum ChannelType {
  TEXT = 'text',
  VOICE = 'voice',
  ANNOUNCEMENT = 'announcement'
}

export class CreateChannelDto extends PickType(PickableDiscordUUIDFields, [
  'uuidGuild',
  'uuidCategory'
]) {
  @ApiProperty({
    description: 'ID Discord du channel',
    example: '123456789012345678'
  })
  @IsString()
  @Length(17, 19)
  uuid: string; // uuid_channel dans le MCD

  @ApiProperty({
    description: 'Le nom du channel',
    example: 'général',
    maxLength: 100
  })
  @IsString()
  @MaxLength(100)
  name: string; // name_channel dans le MCD

  @ApiProperty({
    description: 'Le type de channel',
    example: 'text',
    enum: ChannelType
  })
  @IsString()
  @IsEnum(ChannelType)
  type: string;

  @ApiProperty({
    description: 'La position du channel',
    example: 1,
    minimum: 0
  })
  @IsInt()
  @Min(0)
  channelPosition: number; // position_channel dans le MCD

  uuidGuild: string;
  uuidCategory: string;
} 