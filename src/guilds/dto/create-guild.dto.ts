import { IsString, IsInt, MaxLength, IsObject, Min, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGuildDto {
  @ApiProperty({
    description: 'ID Discord du serveur',
    example: '123456789012345678'
  })
  @IsString()
  @Length(17, 19)
  uuid: string;

  @ApiProperty({
    description: 'Nom du serveur',
    example: 'Simplon Server'
  })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Nombre de membres dans le serveur',
    example: 100
  })
  @IsInt()
  @Min(0)
  memberCount: number;

  @ApiProperty({
    description: 'Configuration du serveur',
    example: { welcomeChannel: '123456789012345678', prefix: '!' },
    required: false
  })
  @IsObject()
  configuration?: Record<string, any>;
}
