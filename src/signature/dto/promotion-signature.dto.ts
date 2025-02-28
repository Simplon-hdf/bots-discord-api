import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty({ 
    example: '1344616774402052126', 
    description: 'ID du rôle Discord'
  })
  id: string;

  @ApiProperty({ 
    example: 'apprenant', 
    description: 'Nom du rôle Discord'
  })
  nom: string;
}

export class ChannelDto {
  @ApiProperty({ 
    example: '123456789012345678', 
    description: 'ID (snowflake) du channel Discord'
  })
  snowflake: string;

  @ApiProperty({ 
    example: 'forum-dev-web', 
    description: 'Nom du channel Discord'
  })
  nom: string;
}

export class MembreDto {
  @ApiProperty({ 
    example: '123456789012345678', 
    description: 'ID (snowflake) du membre Discord'
  })
  snowflake: string;

  @ApiProperty({ 
    example: 'Alice Martin', 
    description: 'Nom du membre Discord dans la guilde'
  })
  nom: string;

  @ApiProperty({ 
    type: [RoleDto],
    description: 'Liste des rôles du membre'
  })
  roles: RoleDto[];
}

export class PromotionSignatureDto {
  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000', 
    description: 'Identifiant unique (UUID) de la promotion'
  })
  uuid: string;

  @ApiProperty({ 
    example: 'Développeur Web 2024', 
    description: 'Nom de la promotion'
  })
  nom: string;

  @ApiProperty({
    description: 'Informations sur le channel associé',
    type: ChannelDto
  })
  channel: ChannelDto;

  @ApiProperty({
    description: 'Informations sur le chargé de projet',
    type: MembreDto
  })
  chargeDeProjet: MembreDto;

  @ApiProperty({ 
    type: [MembreDto],
    description: 'Liste des formateurs associés à la promotion'
  })
  formateurs: MembreDto[];

  @ApiProperty({ 
    type: [MembreDto],
    description: 'Liste des apprenants associés à la promotion'
  })
  apprenants: MembreDto[];
}

export class PromotionsSignatureResponseDto {
  @ApiProperty({
    type: [PromotionSignatureDto],
    description: 'Liste des promotions avec leurs signatures'
  })
  promotions: PromotionSignatureDto[];
} 