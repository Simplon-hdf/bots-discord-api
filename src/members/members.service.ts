import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AssignRoleToMemberDto } from './../roles/dto/assign-role-to-member.dto';
import { UpdateMemberRolesDto } from './../roles/dto/update-member-roles.dto';
import { Member } from './entities/member.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>
  ) {}

  // Créer un nouveau membre
  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member = this.membersRepository.create(createMemberDto);
    return await this.membersRepository.save(member);
  }

  // Récupérer tous les membres
  async findAll(): Promise<Member[]> {
    return await this.membersRepository.find({
      relations: ['resources']
    });
  }

  // Récupérer un membre par son uuid
  async findOne(uuidMember: string): Promise<Member> {
    const member = await this.membersRepository.findOne({
      where: { uuidMember },
      relations: ['resources']
    });

    if (!member) {
      throw new NotFoundException(`Member with UUID ${uuidMember} not found`);
    }
    return member;
  }

  // Mettre à jour un membre
  async update(uuidMember: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(uuidMember);
    Object.assign(member, updateMemberDto);
    return await this.membersRepository.save(member);
  }

  // Supprimer un membre
  async remove(uuidMember: string): Promise<DeleteResult> {
    const result = await this.membersRepository.delete({ uuidMember });
    if (result.affected === 0) {
      throw new NotFoundException(`Member with UUID ${uuidMember} not found`);
    }
    return result;
  }

  async getMemberRoles(uuidMember: string): Promise<Role[]> {
    const member = await this.membersRepository.findOne({
        where: { uuidMember },
        relations: ['roles'],
    });

    if (!member) {
        throw new NotFoundException(`Member with UUID ${uuidMember} not found`);
    }

    return member.roles;
  }

  async assignRoleToMember(uuidMember: string, uuidRole: string): Promise<Member> {
    const member = await this.membersRepository.findOne({
        where: { uuidMember },
        relations: ['roles'],
    });

    if (!member) {
        throw new NotFoundException(`Member with UUID ${uuidMember} not found`);
    }

    const role = await this.rolesRepository.findOne({ where: { uuidRole } });
    if (!role) {
        throw new NotFoundException(`Role with UUID ${uuidRole} not found`);
    }

    // Vérifier si le membre possède déjà ce rôle
    if (member.roles.some(r => r.uuidRole === uuidRole)) {
        throw new BadRequestException(`Member already has the role ${uuidRole}`);
    }

    // Ajouter le rôle au membre
    member.roles.push(role);

    // Incrémenter `member_count`
    role.memberCount = parseInt(role.memberCount.toString(), 10) + 1;
    await this.rolesRepository.save(role);

    return await this.membersRepository.save(member);
  }

  async removeRoleFromMember(uuidMember: string, uuidRole: string): Promise<Member> {
    const member = await this.membersRepository.findOne({
        where: { uuidMember },
        relations: ['roles'],
    });

    if (!member) {
        throw new NotFoundException(`Member with UUID ${uuidMember} not found`);
    }

    const role = await this.rolesRepository.findOne({ where: { uuidRole } });
    if (!role) {
        throw new NotFoundException(`Role with UUID ${uuidRole} not found`);
    }

    // Supprimer le rôle du membre
    member.roles = member.roles.filter(r => r.uuidRole !== uuidRole);

    // Mettre à jour `member_count`
    role.memberCount = Math.max(0, parseInt(role.memberCount.toString(), 10) - 1);
    await this.rolesRepository.save(role);

    return await this.membersRepository.save(member);
  }
}