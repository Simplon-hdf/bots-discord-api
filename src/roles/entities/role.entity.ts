import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { Guild } from '../../guilds/entities/guild.entity';
import { Member } from '../../members/entities/member.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('roles')
export class Role {
  @ApiProperty({
    description: 'UUID unique du rôle',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryColumn('uuid', { name: 'uuid_role' })
  uuid: string;

  @ApiProperty({
    description: 'Nom du rôle',
    example: 'Modérateur',
    maxLength: 50
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Nombre de membres ayant ce rôle',
    example: '10'
  })
  @Column({ type: 'varchar', length: 50, nullable: false, name: 'member_count' })
  memberCount: string;

  @ApiProperty({
    description: 'Position du rôle dans la hiérarchie',
    example: '1'
  })
  @Column({ type: 'varchar', length: 50, nullable: false, name: 'role_position' })
  rolePosition: string;

  @ApiProperty({
    description: 'Indique si le rôle est affiché séparément dans la liste des membres',
    example: true
  })
  @Column({ type: 'boolean', nullable: false, default: false })
  hoist: boolean;

  @ApiProperty({
    description: 'Couleur du rôle en format hexadécimal',
    example: '#FF0000'
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  color: string;

  @ApiProperty({
    description: 'Date de création du rôle',
    example: '2024-02-18T10:00:00Z'
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour du rôle',
    example: '2024-02-18T10:00:00Z'
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'UUID de la guilde à laquelle appartient le rôle',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @Column('uuid', { nullable: false, name: 'uuid_guild' })
  uuidGuild: string;

  @ApiProperty({
    description: 'Relation avec la guilde',
    type: () => Guild
  })
  @ManyToOne(() => Guild, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uuid_guild' })
  guild: Guild;

  @ApiProperty({
    description: 'Membres ayant ce rôle',
    type: () => [Member]
  })
  @ManyToMany(() => Member, member => member.roles)
  members: Member[];
}