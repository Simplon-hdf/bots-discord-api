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
      const role = this.roleRepository.create({
        ...createRoleDto,
        uuid: createRoleDto.uuidRole
      });
      return await this.roleRepository.save(role);
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
  async findOne(uuid: string): Promise<Role> {
    try {
      const role = await this.roleRepository.findOneBy({ uuid });
      if (!role) {
        throw new NotFoundException(`Rôle avec l'UUID ${uuid} non trouvé`);
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
  async update(uuid: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.findOne(uuid);
      const updatedRole = {
        ...updateRoleDto,
        uuid: updateRoleDto.uuidRole
      };
      Object.assign(role, updatedRole);
      return await this.roleRepository.save(role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la mise à jour du rôle: ' + error.message);
    }
  }

  // Supprimer un rôle
  async remove(uuid: string): Promise<void> {
    try {
      const result = await this.roleRepository.delete({ uuid });
      if (result.affected === 0) {
        throw new NotFoundException(`Rôle avec l'UUID ${uuid} non trouvé`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la suppression du rôle: ' + error.message);
    }
  }
}