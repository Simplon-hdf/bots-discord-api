import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  // Créer un nouveau rôle
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  // Récupérer tous les rôles
  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  // Récupérer un rôle par son uuid
  async findOne(uuid: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ uuid });
    if (!role) {
      throw new NotFoundException(`Role with UUID ${uuid} not found`);
    }
    return role;
  }

  // Mettre à jour un rôle
  async update(uuid: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(uuid);
    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  // Supprimer un rôle
  async remove(uuid: string): Promise<void> {
    const result = await this.roleRepository.delete({ uuid });
    if (result.affected === 0) {
      throw new NotFoundException(`Role with UUID ${uuid} not found`);
    }
  }
}