import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Member } from 'src/members/entities/member.entity';
import { DashboardAccount } from 'src/dashboard-accounts/entities/dashboard-account.entity';

@Entity('discord_users')
export class DiscordUser {

  @ApiProperty({
    description: 'ID Discord de l\'utilisateur',
    example: '123456789012345678'
  })
  @PrimaryColumn({ type: 'varchar', length: 19, name: 'uuid_discord' })
  uuid: string;

  @ApiProperty({
    description: 'Nom d\'utilisateur Discord',
    example: 'JohnDoe#1234'
  })
  @Column({ type: 'varchar', length: 50, name: 'discord_username' })
  discordUsername: string;

  @ApiProperty({
    description: 'Discriminateur Discord',
    example: '1234'
  })
  @Column({ type: 'varchar', length: 50 })
  discriminator: string;

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

  @OneToOne(() => Member, member => member.discordUser)
  member: Member;

  @OneToOne(() => DashboardAccount, dashboardAccount => dashboardAccount.discordUser)
  dashboardAccount: DashboardAccount

} 