import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../../members/entities/member.entity';
import { Resource } from '../../resources/entities/resource.entity';

export enum ReportType {
  RESOURCE = 'resource',
  MEMBER = 'member'
}

export enum ReportCategory {
  SPAM = 'spam',
  HARASSMENT = 'harassment',
  INAPPROPRIATE = 'inappropriate',
  OTHER = 'other'
}

@Entity('reports')
@Unique(['reporter', 'resource', 'reportedMember'])
export class Report {
  @ApiProperty({
    description: 'UUID unique du signalement',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  uuidReport: string;

  @ApiProperty({
    description: 'Type de l\'élément signalé (ressource ou membre)',
    enum: ReportType,
    example: ReportType.RESOURCE
  })
  @Column({
    type: 'enum',
    enum: ReportType
  })
  type: ReportType;

  @ApiProperty({
    description: 'Catégorie du signalement',
    enum: ReportCategory,
    example: ReportCategory.INAPPROPRIATE
  })
  @Column({
    type: 'enum',
    enum: ReportCategory
  })
  category: ReportCategory;

  @ApiProperty({
    description: 'Raison détaillée du signalement',
    example: 'Contenu offensant envers la communauté'
  })
  @Column({ type: 'varchar', length: 50 })
  reason: string;

  @ApiProperty({
    description: 'Statut actuel du signalement (pending, resolved, rejected)',
    example: 'pending'
  })
  @Column({ type: 'varchar', length: 50 })
  status: string;

  @ApiProperty({
    description: 'Date de création du signalement',
    example: '2024-02-22T16:05:01.484Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour du signalement',
    example: '2024-02-22T16:05:01.484Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'reporter_uuid' })
  @ApiProperty({ 
    description: 'Membre qui a effectué le signalement',
    type: () => Member
  })
  reporter: Member;

  @ManyToOne(() => Resource, resource => resource.reports)
  @JoinColumn({ name: 'resource_uuid' })
  @ApiProperty({ 
    description: 'Ressource signalée (uniquement si type = resource)',
    type: () => Resource,
    required: false
  })
  resource?: Resource;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'reported_member_uuid' })
  @ApiProperty({ 
    description: 'Membre signalé (uniquement si type = member)',
    type: () => Member,
    required: false
  })
  reportedMember?: Member;
} 