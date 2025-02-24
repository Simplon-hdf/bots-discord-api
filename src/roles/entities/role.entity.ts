import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, ManyToMany } from 'typeorm';import { ApiProperty } from '@nestjs/swagger';
import { Guild } from '../../guilds/entities/guild.entity';
import { Member } from '../../members/entities/member.entity';
import { Course } from '../../courses/entities/course.entity';
import { Campus } from '../../campuses/entities/campus.entity';
import { Promotion } from 'src/promotions/entities/promotion.entity';

@Entity('roles')
export class Role {
  @ApiProperty({
    description: 'UUID unique du rôle',
    example: '172653890987364567'
  })
  @PrimaryColumn('varchar', { name: 'uuid_role' })
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
    example: 10
  })
  @Column({ type: 'int', nullable: false })
  member_count: number;

  @ApiProperty({
    description: 'Position du rôle dans la hiérarchie',
    example: 1
  })
  @Column({ type: 'int', nullable: false })
  role_position: number;

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
  @Column({ type: 'varchar', length: 7, nullable: false })
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
    example: '123456789012345678'
  })
  @Column('uuid', { name: 'uuid_guild', nullable: false })
  uuidGuild: string;

  @ApiProperty({
    description: 'Relation avec la guilde',
    type: () => Guild
  })
  @ManyToOne(() => Guild, guild => guild.roles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uuid_guild' })
  guild: Guild;

  @ApiProperty({
    description: 'Membres ayant ce rôle',
    type: () => [Member]
  })
  @ManyToMany(() => Member, member => member.roles)
  members: Member[];
  
  @ApiProperty({
    description: 'Formation associée à un role',
    type: () => [Course],
    isArray: true
  })
  @OneToOne(() => Course, course => course.role)
  course: Course;

  @OneToOne(() => Campus, campus => campus.role)
  campus: Campus;

  @OneToOne(() => Promotion, promotion => promotion.role)
  promotion: Promotion;
}