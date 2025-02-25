import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, JoinTable, OneToOne, ManyToMany, OneToMany } from 'typeorm';
import { Guild } from '../../guilds/entities/guild.entity'
import { MemberInformation } from '../../members-informations/entities/member-information.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IdentificationRequest } from 'src/identification-requests/entities/identification-request.entity';
import { DiscordUser } from 'src/discord-users/entities/discord-user.entity';
import { Resource } from '../../resources/entities/resource.entity';
import { XpTransaction } from '../../xp-transactions/entities/xp-transaction.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('members')
export class Member {

  @ApiProperty({
    description: 'UUID unique du membre',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid', { name: 'uuid_member' })
  uuidMember: string;

  @ApiProperty({
    description: 'Nom d\'utilisateur du membre dans la guilde',
    example: 'JohnDoe',
    maxLength: 50
  })
  @Column({ type: 'varchar', length: 50, name: 'guild_username' })
  guildUsername: string;

  @ApiProperty({
    description: 'Points d\'expérience du membre',
    example: '100.00'
  })
  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'xp' })
  xp: string;

  @ApiProperty({
    description: 'Niveau du membre',
    example: 1
  })
  @Column({ type: 'int', name: 'level' })
  level: number;

  @ApiProperty({
    description: 'Rôle communautaire du membre',
    example: 'Member'
  })
  @Column({ type: 'varchar', length: 50, name: 'community_role' })
  communityRole: string;

  @ApiProperty({
    description: 'Statut du membre',
    example: 'Active',
    enum: ['Active', 'Inactive', 'Banned']
  })
  @Column({ type: 'varchar', length: 50, name: 'status' })
  status: string;

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
    description: 'UUID de la guilde',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Column({ type: 'uuid', name: 'uuid_guild' })
  uuidGuild: string;

  @ApiProperty({
    description: 'Relation avec la guilde'
  })
  @ManyToOne(() => Guild, (guild) => guild.members, { lazy: true })
  @JoinColumn({ name: 'uuid_guild' })
  guild: Promise<Guild>;

  @Column({ type: 'uuid', name: 'uuid_discord' }) 
  uuidDiscord: string;

  @OneToOne(() => DiscordUser, (discordUser) => discordUser.member)
  @JoinColumn({ name: 'uuid_discord' })
  discordUser: DiscordUser;

  @OneToOne(() => MemberInformation, (memberInformation) => memberInformation.member)
  memberInformation: MemberInformation;

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
  xpTransactions: XpTransaction[];

  @ApiProperty({
    description: 'Rôles du membre',
    type: () => [Role]
  })
  @ManyToMany(() => Role, (role) => role.members)
  @JoinTable()
  roles: Role[];

  @ApiProperty({
    description: 'Les commentaires du membre',
    type: () => [Comment]
  })
  @OneToMany(() => Comment, comment => comment.member)
  comments: Comment[];

}
