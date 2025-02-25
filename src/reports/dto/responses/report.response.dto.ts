import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ReportType, ReportCategory } from '../../entities/report.entity';

export class ReportMemberResponseDto {
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

export class ReportResponseDto {
  @ApiProperty({
    description: 'UUID du signalement',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
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
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour',
    example: '2024-02-22T12:00:00Z'
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    description: 'Membre qui a fait le signalement',
    type: () => ReportMemberResponseDto
  })
  @Expose()
  @Type(() => ReportMemberResponseDto)
  reporter: ReportMemberResponseDto;

  @ApiProperty({
    description: 'Membre signalé (uniquement si type = member)',
    type: () => ReportMemberResponseDto,
    required: false
  })
  @Expose()
  @Type(() => ReportMemberResponseDto)
  reportedMember?: ReportMemberResponseDto;
} 