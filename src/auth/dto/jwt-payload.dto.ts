import { ApiProperty } from '@nestjs/swagger';

export class JwtPayloadDto {
  @ApiProperty({
    description: 'ID unique de l\'utilisateur Discord (subject)',
    example: '123456789012345678'
  })
  sub: string;

  @ApiProperty({
    description: 'Nom d\'utilisateur Discord',
    example: 'discord_user'
  })
  username: string;

  @ApiProperty({
    description: 'Rôles de l\'utilisateur dans la guilde',
    example: ['member', 'moderator']
  })
  roles: string[];

  @ApiProperty({
    description: 'ID de la guilde Discord autorisée',
    example: '123456789012345678'
  })
  guildId: string;
} 