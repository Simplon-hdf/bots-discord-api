import { ApiProperty } from '@nestjs/swagger';

export class ForumDto {
  @ApiProperty({ 
    example: '123456789012345678', 
    description: 'Identifiant Discord (snowflake) du forum'
  })
  snowflake: string;

  @ApiProperty({ 
    example: 'Forum de la Promotion 2023', 
    description: 'Nom du forum de la promotion'
  })
  nom: string;
}

export class MemberDto {
  @ApiProperty({ 
    example: '987654321098765432', 
    description: 'Identifiant Discord (snowflake) du membre'
  })
  snowflake: string;

  @ApiProperty({ 
    example: 'Jean Dupont', 
    description: 'Nom complet du membre'
  })
  nom: string;

  @ApiProperty({ 
    example: ['cdp', 'cda-p4-vals'], 
    description: 'Liste des rôles associés au membre'
  })
  roles: string[];
}

export class PromotionSignatureDto {
  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000', 
    description: 'Identifiant unique (UUID) de la promotion'
  })
  uuid: string;

  @ApiProperty({ 
    example: 'Promotion 2023', 
    description: 'Nom de la promotion'
  })
  nom: string;

  @ApiProperty({
    description: 'Informations sur le forum associé à la promotion',
    type: ForumDto
  })
  forum: ForumDto;

  @ApiProperty({
    description: 'Informations sur le chargé de projet de la promotion',
    type: MemberDto
  })
  chargeDeProjet: MemberDto;

  @ApiProperty({ 
    type: [MemberDto],
    description: 'Liste des formateurs associés à la promotion'
  })
  formateurs: MemberDto[];

  @ApiProperty({ 
    type: [MemberDto],
    description: 'Liste des apprenants associés à la promotion'
  })
  apprenants: MemberDto[];
} 