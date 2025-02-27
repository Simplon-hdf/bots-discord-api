import { ApiProperty } from '@nestjs/swagger';

export class ChannelDto {
  @ApiProperty({ 
    example: '1343858509615464449', 
    description: 'Identifiant Discord (snowflake) du channel'
  })
  snowflake: string;

  @ApiProperty({ 
    example: 'Forum de la Cda P4 Vals', 
    description: 'Nom du forum de la promotion'
  })
  nom: string;
}

export class RoleDto {
  @ApiProperty({ 
    example: '1344616774402052127', 
    description: 'Identifiant Discord du rôle'
  })
  id: string;

  @ApiProperty({ 
    example: 'cdp', 
    description: 'Nom du rôle'
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
    type: [RoleDto],
    description: 'Liste des rôles associés au membre'
  })
  roles: RoleDto[];
}

export class PromotionSignatureDto {
  @ApiProperty({ 
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 
    description: 'Identifiant unique (UUID) de la promotion'
  })
  uuid: string;

  @ApiProperty({ 
    example: 'Cda P4 Vals', 
    description: 'Nom de la promotion'
  })
  nom: string;

  @ApiProperty({
    description: 'Informations sur le channel associé à la promotion',
    type: ChannelDto
  })
  channel: ChannelDto;

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

export class PromotionsSignatureResponseDto {
  @ApiProperty({
    type: [PromotionSignatureDto],
    description: 'Liste des promotions avec leurs signatures'
  })
  promotions: PromotionSignatureDto[];
} 