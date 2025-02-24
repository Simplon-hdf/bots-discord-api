import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  // Créer un nouveau membre
  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member = this.membersRepository.create({
      ...createMemberDto,
      guild_username: createMemberDto.guildUsername,
      community_role: createMemberDto.communityRole,
      uuid_guild: createMemberDto.uuidGuild,
      uuid_discord: createMemberDto.uuidDiscord
    });
    return await this.membersRepository.save(member);
  }

  // Récupérer tous les membres
  async findAll(): Promise<Member[]> {
    return await this.membersRepository.find();
  }

  // Récupérer un membre par son uuid
  async findOne(uuid: string): Promise<Member> {
    const member = await this.membersRepository.findOneBy({ uuid });
    if (!member) {
      throw new NotFoundException(`Member with UUID ${uuid} not found`);
    }
    return member;
  }

  // Mettre à jour un membre
  async update(uuid: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(uuid);
    const updatedMember = {
      ...updateMemberDto,
      guild_username: updateMemberDto.guildUsername,
      community_role: updateMemberDto.communityRole,
      uuid_guild: updateMemberDto.uuidGuild,
      uuid_discord: updateMemberDto.uuidDiscord
    };
    Object.assign(member, updatedMember);
    return await this.membersRepository.save(member);
  }

  // Supprimer un membre
  async remove(uuid: string): Promise<void> {
    const result = await this.membersRepository.delete({ uuid });
    if (result.affected === 0) {
      throw new NotFoundException(`Member with UUID ${uuid} not found`);
    }
  }
}