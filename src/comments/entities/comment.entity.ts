import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { Resource } from '../../resources/entities/resource.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Vote } from '../../votes/entities/vote.entity';

@Entity('comments')
export class Comment {
  @ApiProperty({
    description: 'UUID unique du commentaire',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid', { name: 'uuid_comment' })
  uuidComment: string;

  @ApiProperty({
    description: 'Contenu du commentaire',
    example: 'Contenu du commentaire'
  })
  @Column({ type: 'text', name: 'content' })
  content: string;

  @ApiProperty({
    description: 'Statut du commentaire',
    example: 'active',
    enum: ['active', 'inactive', 'deleted']
  })
  @Column({ type: 'varchar', length: 50, name: 'status' })
  status: string;

  @ApiProperty({
    description: 'Date de création du commentaire',
    example: '2024-03-20T10:00:00Z'
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'UUID du membre qui a créé le commentaire',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Column({ type: 'uuid', name: 'uuid_member' })
  uuidMember: string;

  @ApiProperty({
    description: 'UUID de la ressource commentée',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Column({ type: 'uuid', name: 'uuid_resource' })
  uuidResource: string;

  @ApiProperty({
    description: 'Le membre qui a créé le commentaire',
    type: () => Member
  })
  @ManyToOne(() => Member, member => member.comments)
  @JoinColumn({ name: 'uuid_member' })
  member: Member;

  @ApiProperty({
    description: 'La ressource commentée',
    type: () => Resource
  })
  @ManyToOne(() => Resource, resource => resource.comments)
  @JoinColumn({ name: 'uuid_resource' })
  resource: Resource;

  @ApiProperty({
    description: 'Les votes du commentaire',
    type: () => [Vote]
  })
  @OneToMany(() => Vote, vote => vote.comment)
  votes: Vote[];
}
