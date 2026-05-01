import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Role } from '../entities/role.entity';

export interface IRolesService {
  create(createRoleDto: CreateRoleDto);
  findAll();
  findOne(uuidRole: string);
  update(uuidRole: string, updateRoleDto: UpdateRoleDto);
  remove(uuidRole: string);
}

export const IRolesServicesToken = Symbol('IRolesServices');
