import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn, ManyToOne} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../../courses/entities/course.entity';
import { Member } from '../../members/entities/member.entity';
import { Promotion } from '../../promotions/entities/promotion.entity';
import { Role } from '../../roles/entities/role.entity';
import { GuildTemplate } from '../../guilds-templates/entities/guild-template.entity';
import { Channel } from '../../channels/entities/channel.entity';
import { Category } from '../../categories/entities/category.entity';
import { Campus } from '../../campuses/entities/campus.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../../courses/entities/course.entity';
import { Member } from '../../members/entities/member.entity';
import { Campus } from 'src/campuses/entities/campus.entity';
import { Promotion } from 'src/promotions/entities/promotion.entity';

@Entity('Guilds')
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
    example: 100,
  })
  @Column({ type: 'int' })
  memberCount: number;

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

  @ManyToOne(() => Member, (member) => member.guild)
  members: Member[];

  @OneToMany(() => Promotion, (promotion) => promotion.guild)
  promotions: Promotion[];

  @OneToOne(() => Course, course => course.guild)
  @JoinColumn({ name: 'uuidCourse' })
  course: Course;

  @OneToMany(() => Role, role => role.guild)
  roles: Role[];

  @OneToOne(() => GuildTemplate, template => template.guild)
  template: GuildTemplate;

  @OneToMany(() => Channel, channel => channel.guild)
  channels: Channel[];

  @OneToMany(() => Category, category => category.guild)
  categories: Category[];

  @OneToMany(() => Campus, campus => campus.guild)
  campuses: Campus[];
}
