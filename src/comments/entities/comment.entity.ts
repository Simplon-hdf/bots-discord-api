import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Comments')
export class Comment {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryColumn('uuid', { name: 'comment_uuid' })
  uuid: string;

  @ApiProperty({ example: 'Contenu du commentaire' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ example: 'active', enum: ['active', 'inactive', 'deleted'] })
  @Column({ type: 'varchar', length: 50 })
  status: string;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  @CreateDateColumn({ type: 'timestamp', name: 'comment_createdAt' })
  createdAt: Date;

  @Column('uuid')
  uuidMember: string;

  @Column('uuid')
  resource_uuid: string;

  @Column('uuid')
  user_uuid: string;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'uuidMember' })
  member: Member;
}
