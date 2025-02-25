import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../../members/entities/member.entity';

export enum XpTransactionType {
  GAIN = 'GAIN',
  LOSS = 'LOSS'
}

export enum XpTransactionSource {
  VOTE = 'VOTE',
  DOWNVOTE = 'DOWNVOTE',
  RESOURCE_CREATION = 'RESOURCE_CREATION',
  RESOURCE_DELETION = 'RESOURCE_DELETION',
  REPORT = 'REPORT',
  MANUAL = 'MANUAL',
  OTHER = 'OTHER'
}

export enum ReferenceType {
  RESOURCE = 'resource',
  VOTE = 'vote',
  REPORT = 'report',
  COMMENT = 'comment',
  ANSWER = 'answer',
  POLL = 'poll',
  POLL_VOTE = 'poll_vote'
}

@Entity('xp_transactions')
export class XpTransaction {
  @ApiProperty({
    description: 'UUID unique de la transaction XP',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @PrimaryGeneratedColumn('uuid', { name: 'uuid_xp_transaction' })
  uuidXpTransaction: string;

  @ApiProperty({
    description: 'Type de la transaction (GAIN ou LOSS)',
    enum: XpTransactionType,
    example: XpTransactionType.GAIN
  })
  @Column({
    type: 'enum',
    enum: XpTransactionType,
    name: 'transaction_type'
  })
  transactionType: XpTransactionType;

  @ApiProperty({
    description: 'Source de la transaction',
    enum: XpTransactionSource,
    example: XpTransactionSource.VOTE
  })
  @Column({
    type: 'enum',
    enum: XpTransactionSource,
    name: 'source'
  })
  source: XpTransactionSource;

  @ApiProperty({
    description: 'Valeur de la transaction XP',
    example: '100.00'
  })
  @Column({ 
    type: 'decimal', 
    precision: 15, 
    scale: 2,
    name: 'transaction_value'
  })
  transactionValue: string;

  @ApiProperty({
    description: 'Raison de la transaction',
    example: 'Vote positif sur une ressource'
  })
  @Column({ 
    type: 'varchar', 
    length: 200,
    name: 'reason'
  })
  reason: string;

  @ApiProperty({
    description: 'Notes additionnelles (optionnel)',
    example: 'Ressource particulièrement utile',
    required: false
  })
  @Column({ 
    type: 'varchar', 
    length: 500, 
    nullable: true,
    name: 'notes'
  })
  notes?: string;

  @ApiProperty({
    description: 'Type de l\'objet référencé',
    enum: ReferenceType,
    example: ReferenceType.RESOURCE,
    required: false
  })
  @Column({
    type: 'enum',
    enum: ReferenceType,
    nullable: true,
    name: 'reference_type'
  })
  referenceType?: ReferenceType;

  @ApiProperty({
    description: 'UUID de l\'objet référencé',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @Column({ 
    type: 'uuid', 
    nullable: true,
    name: 'reference_uuid'
  })
  referenceUuid?: string;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-03-14T12:00:00Z'
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Le membre concerné par la transaction',
    type: () => Member
  })
  @ManyToOne(() => Member, member => member.xpTransactions)
  @JoinColumn({ name: 'uuid_member' })
  member: Member;
}
