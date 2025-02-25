import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Report } from '../../reports/entities/report.entity';
import { Member } from '../../members/entities/member.entity';
import { Resource } from '../../resources/entities/resource.entity';
import { Comment } from '../../comments/entities/comment.entity';

export enum ActionType {
  WARNING = 'warning',
  BAN = 'ban',
  CONTENT_REMOVAL = 'content_removal',
  RESOLVED = 'resolved',
  REJECTED = 'rejected'
}

@Entity('moderator_actions')
export class ModeratorAction {
  @ApiProperty({
    description: 'UUID unique de l\'action de modération',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid', { name: 'uuid_moderation' })
  uuidModeration: string;

  @ApiProperty({
    description: 'Type d\'action prise',
    enum: ActionType,
    example: ActionType.WARNING
  })
  @Column({
    type: 'enum',
    enum: ActionType,
    name: 'action_type'
  })
  actionType: ActionType;

  @ApiProperty({
    description: 'Raison de l\'action',
    example: 'Contenu inapproprié'
  })
  @Column({ type: 'varchar', length: 255, name: 'action_reason' })
  actionReason: string;

  @ApiProperty({
    description: 'Date de création de l\'action',
    example: '2024-03-14T12:00:00Z'
  })
  @CreateDateColumn({ name: 'action_created_at' })
  actionCreatedAt: Date;

  // Relation avec le modérateur
  @ManyToOne(() => Member)
  @JoinColumn({ name: 'moderator_uuid' })
  moderator: Member;

  @ApiProperty({
    description: 'UUID du modérateur',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Column({ type: 'uuid', name: 'moderator_uuid' })
  moderatorUuid: string;

  // Relation avec le signalement
  @ManyToOne(() => Report)
  @JoinColumn({ name: 'report_uuid' })
  report: Report;

  @ApiProperty({
    description: 'UUID du signalement',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Column({ type: 'uuid', name: 'report_uuid' })
  reportUuid: string;

  // Relations avec les cibles possibles
  @ManyToOne(() => Resource, { nullable: true })
  @JoinColumn({ name: 'resource_uuid' })
  resource?: Resource;

  @Column({ type: 'uuid', name: 'resource_uuid', nullable: true })
  resourceUuid?: string;

  @ManyToOne(() => Member, { nullable: true })
  @JoinColumn({ name: 'target_member_uuid' })
  targetMember?: Member;

  @Column({ type: 'uuid', name: 'target_member_uuid', nullable: true })
  targetMemberUuid?: string;

  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({ name: 'comment_uuid' })
  comment?: Comment;

  @Column({ type: 'uuid', name: 'comment_uuid', nullable: true })
  commentUuid?: string;

  @ApiProperty({
    description: 'Date de dernière modification de l\'action',
    example: '2024-01-01T00:00:00Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
