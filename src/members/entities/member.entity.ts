import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Guild } from '../../guilds/entities/guild.entity';
import { Role } from '../../roles/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Members')
export class Member {
  @ApiProperty({
    description: 'UUID unique du membre',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryColumn('uuid', { name: 'uuid_member' })
  uuid: string;

  @ApiProperty({
    description: 'Nom d\'utilisateur du membre dans la guilde',
    example: 'JohnDoe',
    maxLength: 50
  })
  @Column({ type: 'varchar', length: 50, name: 'guild_username' })
  guildUsername: string;

  @ApiProperty({
    description: 'Points d\'expérience du membre',
    example: '100.00'
  })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  xp: string;

  @ApiProperty({
    description: 'Niveau du membre',
    example: 1
  })
  @Column({ type: 'int' })
  level: number;

  @ApiProperty({
    description: 'Rôle communautaire du membre',
    example: 'Member'
  })
  @Column({ type: 'varchar', length: 50, name: 'community_role' })
  communityRole: string;

  @ApiProperty({
    description: 'Statut du membre',
    example: 'Active',
    enum: ['Active', 'Inactive', 'Banned']
  })
  @Column({ type: 'varchar', length: 50 })
  status: string;

  @ApiProperty({
    description: 'Date de création du membre',
    example: '2024-02-18T10:00:00Z'
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour du membre',
    example: '2024-02-18T10:00:00Z'
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'UUID de la guilde à laquelle appartient le membre',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @Column('uuid', { name: 'uuid_guild' })
  uuidGuild: string;

  @ApiProperty({
    description: 'UUID Discord du membre',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @Column('uuid', { name: 'uuid_discord' })
  uuidDiscord: string;

  @ApiProperty({
    description: 'Relation avec la guilde',
    type: () => Guild
  })
  @ManyToOne(() => Guild)
  @JoinColumn({ name: 'uuid_guild' })
  guild: Guild;

  @ApiProperty({
    description: 'Rôles du membre',
    type: () => [Role]
  })
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'members_roles',
    joinColumn: {
      name: 'uuid_member',
      referencedColumnName: 'uuid'
    },
    inverseJoinColumn: {
      name: 'uuid_role',
      referencedColumnName: 'uuid'
    }
  })
  roles: Role[];
}
