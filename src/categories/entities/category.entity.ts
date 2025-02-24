import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Channel } from '../../channels/entities/channel.entity';
import { Guild } from '../../guilds/entities/guild.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('categories')
export class Category {
  @ApiProperty({
    description: 'ID Discord de la catégorie',
    example: '123456789012345678'
  })
  @PrimaryColumn({ type: 'varchar', length: 19, name: 'uuid_category' })
  uuid: string;

  @ApiProperty({
    description: 'Le nom de la catégorie',
    example: 'Général',
    maxLength: 50
  })
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ApiProperty({
    description: 'La position de la catégorie',
    example: 1
  })
  @Column({ type: 'int' })
  position: number;

  @ApiProperty({
    description: 'ID Discord du serveur associé',
    example: '123456789012345678'
  })
  @Column({ name: 'uuidGuild', type: 'varchar', length: 19 })
  uuidGuild: string;

  @ApiProperty({
    description: 'Date de création'
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour'
  })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Liste des channels dans cette catégorie',
    type: () => Channel,
    isArray: true
  })
  @OneToMany(() => Channel, channel => channel.category)
  channels: Channel[];

  @ApiProperty({
    description: 'Formation associée à la catégorie',
    type: () => [Course],
    isArray: true
  })
  @OneToOne(() => Course, course => course.category)
  @JoinColumn({ name: 'uuidCourse' })
  course: Course;

  @ApiProperty({
    description: 'Le serveur Discord associé à cette catégorie',
    type: () => Guild
  })
  @ManyToOne(() => Guild, guild => guild.categories)
  @JoinColumn({ name: 'uuidGuild' })
  guild: Guild;
}
