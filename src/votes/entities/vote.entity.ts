import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../../members/entities/member.entity';
import { Resource } from '../../resources/entities/resource.entity';
import { Comment } from '../../comments/entities/comment.entity';

export enum VoteType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote'
}

/**
 * Entité représentant un vote dans le système
 */
@Entity('votes')
@Unique(['member', 'resource']) // Un membre ne peut voter qu'une fois pour une ressource
@Unique(['member', 'comment']) // Un membre ne peut voter qu'une fois pour un commentaire
export class Vote {
  @ApiProperty({
    description: 'UUID unique du vote',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid', { name: 'uuid_vote' })
  uuidVote: string;

  @ApiProperty({
    description: 'Type de vote (upvote ou downvote)',
    enum: VoteType,
    example: VoteType.UPVOTE
  })
  @Column({
    type: 'enum',
    enum: VoteType,
    name: 'type'
  })
  voteType: VoteType;

  @ApiProperty({
    description: 'Date de création du vote',
    example: '2024-03-14T12:00:00Z'
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour du vote',
    example: '2024-03-14T12:00:00Z'
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Le membre qui a voté',
    type: () => Member
  })
  @ManyToOne(() => Member)
  @JoinColumn({ name: 'uuid_member' })
  member: Member;

  @ApiProperty({
    description: 'La ressource votée (si le vote concerne une ressource)',
    type: () => Resource,
    required: false
  })
  @ManyToOne(() => Resource, resource => resource.votes, { nullable: true })
  @JoinColumn({ name: 'uuid_resource' })
  resource?: Resource;

  @ApiProperty({
    description: 'Le commentaire voté (si le vote concerne un commentaire)',
    type: () => Comment,
    required: false
  })
  @ManyToOne(() => Comment, comment => comment.votes, { nullable: true })
  @JoinColumn({ name: 'uuid_comment' })
  comment?: Comment;
}
