import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    try {
      // Convertir les valeurs en nombres
      const roleData = {
        ...createRoleDto,
        memberCount: parseInt(createRoleDto.memberCount, 10),
        rolePosition: parseInt(createRoleDto.rolePosition, 10)
      };

      const role = this.roleRepository.create(roleData);
      const savedRole = await this.roleRepository.save(role);
      return savedRole;
    } catch (error) {
      if (error.code === '23505') { // Code PostgreSQL pour violation de contrainte unique
        throw new BadRequestException('Un rôle avec cet UUID existe déjà');
      }
      throw new BadRequestException('Erreur lors de la création du rôle: ' + error.message);
    }
  }

  // Récupérer tous les rôles
  async findAll(): Promise<Role[]> {
    try {
      return await this.roleRepository.find();
    } catch (error) {
      throw new BadRequestException('Erreur lors de la récupération des rôles: ' + error.message);
    }
  }

  // Récupérer un rôle par son uuid
  async findOne(uuidRole: string): Promise<Role> {
    try {
      const role = await this.roleRepository.findOneBy({ uuidRole });
      if (!role) {
        throw new NotFoundException(`Rôle avec l'UUID ${uuidRole} non trouvé`);
      }
      return role;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la récupération du rôle: ' + error.message);
    }
  }

  // Mettre à jour un rôle
  async update(uuidRole: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.findOne(uuidRole);
      Object.assign(role, updateRoleDto);
      return await this.roleRepository.save(role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la mise à jour du rôle: ' + error.message);
    }
  }

  // Supprimer un rôle
  async remove(uuidRole: string): Promise<void> {
    try {
      const result = await this.roleRepository.delete({ uuidRole });
      if (result.affected === 0) {
        throw new NotFoundException(`Rôle avec l'UUID ${uuidRole} non trouvé`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la suppression du rôle: ' + error.message);
    }
  }
}