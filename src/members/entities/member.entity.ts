

import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Guild } from '../../guilds/entities/guild.entity';

@Entity('members')
export class Member {
  @PrimaryColumn('uuid', { name: 'uuid_member' })
  uuid: string;

  @Column({ type: 'varchar', length: 50 })
  guild_username: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  xp: string;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'varchar', length: 50 })
  community_role: string;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @Column('uuid')
  uuid_guild: string;

  @Column('uuid')
  uuid_discord: string;

  @ManyToOne(() => Guild)
  @JoinColumn({ name: 'uuid_guild' })
  guild: Guild;

  
}
