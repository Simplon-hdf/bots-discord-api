import { IsString, MaxLength, IsObject, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGuildDto {
  @ApiProperty({
    description: 'ID Discord du serveur',
    example: '123456789012345678'
  })
  @IsString()
  @Length(17, 19)
  uuid: string; // uuid_guild dans le MCD

  @ApiProperty({
    description: 'Nom du serveur',
    example: 'Simplon Server'
  })
  @IsString()
  @MaxLength(50)
  name: string; // name_guild dans le MCD

  @ApiProperty({
    description: 'Nombre de membres dans le serveur',
    example: '100'
  })
  @IsString()
  @MaxLength(50)
  memberCount: string; // member_count_guild dans le MCD

  @ApiProperty({
    description: 'Configuration du serveur',
    example: { welcomeChannel: '123456789012345678', prefix: '!' },
    required: false
  })
  @IsObject()
  configuration?: Record<string, any>;
}
