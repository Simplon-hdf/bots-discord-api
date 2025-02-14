import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Guild } from '../../guilds/entities/guild.entity';

@Entity('roles')
export class Role {
  @PrimaryColumn('uuid', { name: 'uuid_role' })
  uuid: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  member_count: string;

  @Column({ type: 'varchar', length: 50 })
  role_position: string;

  @Column({ type: 'boolean' })
  hoist: boolean;

  @Column({ type: 'varchar', length: 50 })
  color: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @Column('uuid')
  uuid_guild: string;

  @ManyToOne(() => Guild)
  @JoinColumn({ name: 'uuid_guild' })
  guild: Guild;
}