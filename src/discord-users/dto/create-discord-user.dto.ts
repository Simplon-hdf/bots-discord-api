import { IsString, Length } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { PickableDiscordUUIDFields } from 'src/utils/pickable-discord-uuid-fields';

export class CreateDiscordUserDto extends PickType(PickableDiscordUUIDFields, [
  'uuidDiscord'
]) {
  
  uuidDiscord: string;

  @ApiProperty({
    description: 'Nom d\'utilisateur Discord',
    example: 'JohnDoe#1234'
  })
  @IsString()
  @Length(2, 50)
  discordUsername: string;

  @ApiProperty({
    description: 'Discriminateur Discord',
    example: '1234'
  })
  @IsString()
  @Length(1, 50)
  discriminator: string;
} 