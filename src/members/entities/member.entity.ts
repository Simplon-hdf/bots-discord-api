import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, JoinTable, OneToOne, ManyToMany, OneToMany } from 'typeorm';
import { Guild } from '../../guilds/entities/guild.entity'
import { MemberInformation } from '../../members-informations/entities/member-information.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IdentificationRequest } from 'src/identification-requests/entities/identification-request.entity';
import { DiscordUser } from 'src/discord-users/entities/discord-user.entity';
import { Resource } from '../../resources/entities/resource.entity';
import { XpTransaction } from '../../xp-transactions/entities/xp-transaction.entity';
import { Role } from 'src/roles/entities/role.entity';

@Entity('members')
export class Member {

  @ApiProperty({
    description: 'UUID unique du membre',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid', { name: 'uuid_member' })
  uuid: string;

  @ApiProperty({
    description: 'Nom d\'utilisateur du membre dans la guilde',
    example: 'JohnDoe',
    maxLength: 50
  })
  @Column({ type: 'varchar', length: 50 })
  guild_username: string;

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
  @Column({ type: 'varchar', length: 50 })
  community_role: string;

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

  @Column({ type: 'uuid', name: 'uuid_guild' })
  uuidGuild: string;

  @ApiProperty({
    description: 'Relation avec la guilde',
    type: () => Guild
  })
  @ManyToOne(() => Guild)
  @JoinColumn({ name: 'uuid_guild' })
  guild: Guild;  

  @Column({ type: 'uuid', name: 'uuid_discord' }) 
  uuidDiscord: string;

  @OneToOne(() => DiscordUser, (discordUser) => discordUser.member)
  @JoinColumn({ name: 'uuid_discord' })
  discordUser: DiscordUser;

  @OneToOne(() => MemberInformation, (memberInformation) => memberInformation.member)
  memberInformations: MemberInformation;

  @OneToOne(() => IdentificationRequest, (identificationRequest) => identificationRequest.member)
  identificationRequest: IdentificationRequest;

  @ApiProperty({
    description: 'Les ressources créées par ce membre',
    type: () => [Resource]
  })
  @OneToMany(() => Resource, resource => resource.creator)
  resources: Resource[];

  @ApiProperty({
    description: 'Historique des transactions XP du membre',
    type: () => [XpTransaction]
  })
  @OneToMany(() => XpTransaction, transaction => transaction.member)
  xp_transactions: XpTransaction[];

  @ApiProperty({
    description: 'Rôles du membre',
    type: () => [Role]
  })
  @ManyToMany(() => Role, (role) => role.members)
  @JoinTable()
  roles: Role[];

}
