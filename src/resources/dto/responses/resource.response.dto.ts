import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ReportType, ReportCategory } from '../../../reports/entities/report.entity';
import { VoteType } from '../../../votes/entities/vote.entity';

export class ResourceCreatorResponseDto {
  @ApiProperty({
    description: 'UUID du membre',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  uuidMember: string;

  @ApiProperty({
    description: 'Nom d\'utilisateur sur le serveur',
    example: 'User2'
  })
  @Expose()
  guildUsername: string;

  @ApiProperty({
    description: 'Rôle dans la communauté',
    example: 'Member'
  })
  @Expose()
  communityRole: string;

  // On exclut les autres champs du membre
  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  level: number;

  @Exclude()
  status: string;

  @Exclude()
  uuidDiscord: string;

  @Exclude()
  uuidGuild: string;

  @Exclude()
  xp: string;
}

export class ResourceReportResponseDto {
  @ApiProperty({
    description: 'UUID du signalement',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose({ name: 'uuid_report' })
  uuidReport: string;

  @ApiProperty({
    description: 'Type de signalement',
    enum: ReportType,
    example: ReportType.RESOURCE
  })
  @Expose()
  type: ReportType;

  @ApiProperty({
    description: 'Catégorie du signalement',
    enum: ReportCategory,
    example: ReportCategory.INAPPROPRIATE
  })
  @Expose()
  category: ReportCategory;

  @ApiProperty({
    description: 'Raison détaillée du signalement',
    example: 'Contenu offensant envers la communauté'
  })
  @Expose()
  reason: string;

  @ApiProperty({
    description: 'Statut du signalement',
    example: 'pending'
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-02-22T12:00:00Z'
  })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Membre qui a fait le signalement',
    type: () => ResourceCreatorResponseDto
  })
  @Expose()
  @Type(() => ResourceCreatorResponseDto)
  reporter: ResourceCreatorResponseDto;
}

export class ResourceVoteResponseDto {
  @ApiProperty({
    description: 'UUID du vote',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  uuidVote: string;

  @ApiProperty({
    description: 'Type de vote',
    enum: VoteType,
    example: VoteType.UPVOTE
  })
  @Expose()
  voteType: VoteType;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-02-22T12:00:00Z'
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Statut actif du vote',
    example: true
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: 'Membre qui a voté',
    type: () => ResourceCreatorResponseDto
  })
  @Expose()
  @Type(() => ResourceCreatorResponseDto)
  member: ResourceCreatorResponseDto;
}

export class ResourceCommentResponseDto {
  @ApiProperty({
    description: 'UUID du commentaire',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  uuidComment: string;

  @ApiProperty({
    description: 'Contenu du commentaire',
    example: 'Très bon travail sur ce projet !'
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: 'Statut du commentaire',
    example: 'active'
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-02-22T12:00:00Z'
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Membre qui a commenté',
    type: () => ResourceCreatorResponseDto
  })
  @Expose()
  @Type(() => ResourceCreatorResponseDto)
  member: ResourceCreatorResponseDto;

  @ApiProperty({
    description: 'Votes du commentaire',
    type: () => [ResourceVoteResponseDto]
  })
  @Expose()
  @Type(() => ResourceVoteResponseDto)
  votes: ResourceVoteResponseDto[];
}

export class ResourceResponseDto {
  @ApiProperty({
    description: 'UUID de la ressource',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  uuidResource: string;

  @ApiProperty({
    description: 'Titre de la ressource',
    example: 'Guide de démarrage'
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Description de la ressource',
    example: 'Un guide complet pour démarrer avec le bot'
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Contenu de la ressource',
    example: 'Voici les étapes pour configurer le bot...'
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: 'Statut de la ressource',
    example: 'active'
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'UUID du créateur',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  creatorUuid: string;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-02-22T12:00:00Z'
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Date de mise à jour',
    example: '2024-02-22T12:00:00Z'
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    description: 'Créateur de la ressource',
    type: () => ResourceCreatorResponseDto
  })
  @Expose()
  @Type(() => ResourceCreatorResponseDto)
  creator: ResourceCreatorResponseDto;

  @ApiProperty({
    description: 'Signalements de la ressource',
    type: () => [ResourceReportResponseDto]
  })
  @Expose()
  @Type(() => ResourceReportResponseDto)
  reports: ResourceReportResponseDto[];

  @ApiProperty({
    description: 'Votes de la ressource',
    type: () => [ResourceVoteResponseDto]
  })
  @Expose()
  @Type(() => ResourceVoteResponseDto)
  votes: ResourceVoteResponseDto[];

  @ApiProperty({
    description: 'Commentaires de la ressource',
    type: () => [ResourceCommentResponseDto]
  })
  @Expose()
  @Type(() => ResourceCommentResponseDto)
  comments: ResourceCommentResponseDto[];
} 