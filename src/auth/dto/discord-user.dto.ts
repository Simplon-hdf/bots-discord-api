import { ApiProperty } from '@nestjs/swagger';

export class DiscordUserDto {
  @ApiProperty({
    description: 'ID unique de l\'utilisateur Discord',
    example: '123456789012345678'
  })
  id: string;

  @ApiProperty({
    description: 'Nom d\'utilisateur Discord',
    example: 'discord_user'
  })
  username: string;

  @ApiProperty({
    description: 'Discriminateur Discord (tag)',
    example: '1234'
  })
  discriminator: string;

  @ApiProperty({
    description: 'Hash de l\'avatar Discord',
    example: 'a1b2c3d4e5f6g7h8i9j0'
  })
  avatar: string;

  @ApiProperty({
    description: 'Email de l\'utilisateur (si disponible)',
    example: 'user@example.com',
    required: false
  })
  email?: string;

  @ApiProperty({
    description: 'Indique si l\'email est vérifié',
    example: true,
    required: false
  })
  verified?: boolean;
}

export class DiscordGuildDto {
  @ApiProperty({
    description: 'ID unique de la guilde Discord',
    example: '123456789012345678'
  })
  id: string;

  @ApiProperty({
    description: 'Nom de la guilde',
    example: 'Serveur Discord'
  })
  name: string;

  @ApiProperty({
    description: 'Hash de l\'icône de la guilde',
    example: 'a1b2c3d4e5f6g7h8i9j0'
  })
  icon: string;

  @ApiProperty({
    description: 'Indique si l\'utilisateur est propriétaire de la guilde',
    example: false
  })
  owner: boolean;

  @ApiProperty({
    description: 'Permissions de l\'utilisateur dans la guilde',
    example: 104324161
  })
  permissions: number;

  @ApiProperty({
    description: 'Fonctionnalités activées dans la guilde',
    example: ['WELCOME_SCREEN', 'COMMUNITY']
  })
  features: string[];
}

export class DiscordGuildMemberDto {
  @ApiProperty({
    description: 'Informations sur l\'utilisateur',
    type: DiscordUserDto
  })
  user: DiscordUserDto;

  @ApiProperty({
    description: 'Surnom de l\'utilisateur dans la guilde',
    example: 'Surnom',
    nullable: true
  })
  nick: string | null;

  @ApiProperty({
    description: 'IDs des rôles de l\'utilisateur dans la guilde',
    example: ['123456789012345678', '234567890123456789']
  })
  roles: string[];
} 