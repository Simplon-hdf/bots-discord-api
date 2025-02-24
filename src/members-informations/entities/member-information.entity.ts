import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Member } from 'src/members/entities/member.entity';

@Entity('members_informations')
export class MemberInformation {
  @ApiProperty({
    description: 'UUID unique des informations du membre',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid', { name: 'uuid_members_infos' })
  uuid: string;

  @ApiProperty({
    description: 'Prénom du membre',
    example: 'John'
  })
  @Column({ name: 'firstname', type: 'varchar', length: 50 })
  firstName: string;

  @ApiProperty({
    description: 'Nom du membre',
    example: 'Doe'
  })
  @Column({ name: 'lastname', type: 'varchar', length: 50 })
  lastName: string;

  @ApiProperty({
    description: 'Email du membre',
    example: 'john.doe@example.com'
  })
  @Column({ type: 'varchar', length: 100 })
  email: string;

  @ApiProperty({
    description: 'Date de création'
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour'
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Member, (member) => member.memberInformations)
  @JoinColumn({ name: 'uuidMember' })
  member: Member;

} 