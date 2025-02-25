import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../../courses/entities/course.entity';
import { Member } from '../../members/entities/member.entity';
import { Promotion } from '../../promotions/entities/promotion.entity';
import { Role } from '../../roles/entities/role.entity';
import { GuildTemplate } from '../../guilds-templates/entities/guild-template.entity';
import { Channel } from '../../channels/entities/channel.entity';
import { Category } from '../../categories/entities/category.entity';
import { Campus } from '../../campuses/entities/campus.entity';

@Entity('guilds')
export class Guild {
  @ApiProperty({
    description: 'ID Discord du serveur',
    example: '123456789012345678',
  })
  @PrimaryColumn({ type: 'varchar', length: 19, name: 'uuid_guild' })
  uuid: string;

  @ApiProperty({
    description: 'Nom du serveur',
    example: 'Simplon Server',
  })
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ApiProperty({
    description: 'Nombre de membres',
    example: '100',
  })
  @Column({ type: 'varchar', length: 50, name: 'member_count' })
  memberCount: string;

  @ApiProperty({
    description: 'Configuration du serveur',
    example: { welcomeChannel: '123456789012345678', prefix: '!' },
  })
  @Column({ type: 'jsonb', nullable: true })
  configuration: Record<string, any>;

  @ApiProperty({
    description: 'Date de création',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Membres de la guilde',
    type: () => [Member]
  })
  @OneToMany(() => Member, (member) => member.guild, { lazy: true })
  members: Promise<Member[]>;

  @ApiProperty({
    description: 'Promotions de la guilde',
    type: () => [Promotion]
  })
  @OneToMany(() => Promotion, (promotion) => promotion.guild)
  promotions: Promotion[];

  @ApiProperty({
    description: 'Formation associée à la guilde',
    type: () => Course
  })
  @OneToOne(() => Course, course => course.guild)
  course: Course;

  @ApiProperty({
    description: 'Rôles de la guilde',
    type: () => [Role]
  })
  @OneToMany(() => Role, role => role.guild)
  roles: Role[];

  @ApiProperty({
    description: 'Template de la guilde',
    type: () => GuildTemplate
  })
  @OneToOne(() => GuildTemplate, template => template.guild)
  template: GuildTemplate;

  @ApiProperty({
    description: 'Canaux de la guilde',
    type: () => [Channel]
  })
  @OneToMany(() => Channel, channel => channel.guild)
  channels: Channel[];

  @ApiProperty({
    description: 'Catégories de la guilde',
    type: () => [Category]
  })
  @OneToMany(() => Category, category => category.guild)
  categories: Category[];

  @ApiProperty({
    description: 'Campus associés à la guilde',
    type: () => [Campus]
  })
  @OneToMany(() => Campus, campus => campus.guild)
  campuses: Campus[];
}
