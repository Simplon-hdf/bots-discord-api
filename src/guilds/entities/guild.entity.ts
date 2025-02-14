import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('guilds')
export class Guild {
  @PrimaryColumn('bigint', { name: 'guild_id' })
  uuid: string;

  @Column()
  name: string;

  @Column({ name: 'member_count' })
  memberCount: number;

  @Column({ type: 'jsonb', nullable: true })
  configuration: Record<string, any>;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Date;
}
