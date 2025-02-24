import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class PickableInternUUIDFields {

  @ApiProperty({
    description: 'Identifiant unique du membre',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })  
  @IsUUID()
  uuidMember: string;

  @ApiProperty({
    description: 'Identifiant unique des informations du membre',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidMemberInfos: string;

  @ApiProperty({
    description: 'Identifiant unique du compte du dashboard',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidDashboardAccount: string;

  @ApiProperty({
    description: 'Identifiant unique de la demande d\'identification',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidIdentificationRequest: string;

  @ApiProperty({
    description: 'Identifiant unique du template de serveur',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidGuildTemplate: string;

  @ApiProperty({
    description: 'Identifiant unique du campus',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidCampus: string;

  @ApiProperty({
    description: 'Identifiant unique de la formation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidCourse: string;

  @ApiProperty({
    description: 'Identifiant unique de la promotion',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidPromotion: string;

  @ApiProperty({
    description: 'Identifiant unique de la ressource',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidResource: string;

  @ApiProperty({
    description: 'Identifiant unique du commentaire',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidComment: string;

  @ApiProperty({
    description: 'Identifiant unique de la transaction',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidXpTransaction: string;

  @ApiProperty({
    description: 'Identifiant unique du vote',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidVote: string;

  @ApiProperty({
    description: 'Identifiant unique du rapport',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidReport: string;

  @ApiProperty({
    description: 'Identifiant unique du membre qui a fait le signalement',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuid_reporter: string;

  @ApiProperty({
    description: 'Identifiant unique du membre signalé',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuid_reported_member: string;

  @ApiProperty({
    description: 'Identifiant unique de l\'action de modération',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidModerationAction: string;

  @ApiProperty({
    description: 'Identifiant unique de la question',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidQuestion: string;

  @ApiProperty({
    description: 'Identifiant unique de la résponse',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidAnswer: string;

  @ApiProperty({
    description: 'Identifiant unique du sondage',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidPoll: string;

  @ApiProperty({
    description: 'Identifiant unique du template du sondage',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  uuidPollTemplate: string;

}