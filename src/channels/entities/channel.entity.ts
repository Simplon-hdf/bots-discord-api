import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';
import { Course } from '../../courses/entities/course.entity';
import { Guild } from '../../guilds/entities/guild.entity';

@Entity('Channels')
export class Channel {
  @ApiProperty({
    description: 'ID Discord du channel',
    example: '123456789012345678'
  })
  @PrimaryColumn({ type: 'varchar', length: 19 , name: 'uuid_channel' })
  uuid: string;

  @ApiProperty({
    description: 'Le nom du channel',
    example: 'général',
    maxLength: 100
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    description: 'Le type de channel',
    example: 'text',
    enum: ['text', 'voice', 'announcement']
  })
  @Column({ type: 'varchar', length: 20 })
  type: string;

  @ApiProperty({
    description: 'La position du channel',
    example: 1
  })
  @Column({ name: 'channel_position' })
  channelPosition: number;

  @ApiProperty({
    description: 'ID Discord de la catégorie associée',
    example: '123456789012345678',
    required: false
  })
  @Column({ name: 'uuidCategory', type: 'varchar', length: 19, nullable: true })
  uuidCategory: string;

  @ApiProperty({
    description: 'ID Discord du serveur associé',
    example: '123456789012345678'
  })
  @Column({ name: 'uuidGuild', type: 'varchar', length: 19 })
  uuidGuild: string;

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

  @ApiProperty({
    description: 'La catégorie à laquelle appartient le channel',
    type: () => Category,
    required: false
  })
  @ManyToOne(() => Category, category => category.channels, {
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({ name: 'uuid_category' })
  category: Category;

  @ApiProperty({
    description: 'Formation associées aux channels',
    type: () => [Course],
    isArray: true
  })
  @ManyToOne(() => Course, course => course.channels)
  @JoinColumn({ name: 'uuid_course' })
  course: Course;

  @ApiProperty({
    description: 'Le serveur Discord associé au channel',
    type: () => Guild
  })
  @ManyToOne(() => Guild, guild => guild.channels)
  @JoinColumn({ name: 'uuid_guild' })
  guild: Guild;
} 