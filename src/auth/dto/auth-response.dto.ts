import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT token pour authentifier les requêtes ultérieures',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  token: string;

  @ApiProperty({
    description: 'Informations sur l\'utilisateur authentifié',
    example: {
      id: '123456789012345678',
      username: 'discord_user',
      roles: ['member', 'moderator']
    }
  })
  user: {
    id: string;
    username: string;
    roles: string[];
  };

  @ApiProperty({
    description: 'Message de confirmation ou d\'erreur',
    example: 'Authentification réussie'
  })
  message: string;
} 