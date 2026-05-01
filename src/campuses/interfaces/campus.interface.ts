import { CreateCampusDto } from '../dto/create-campus.dto';
import { UpdateCampusDto } from '../dto/update-campus.dto';
import { Campus } from '../entities/campus.entity';

export interface ICampusesService {
  create(createCampusDto: CreateCampusDto): Promise<Campus>;
  findAll(): Promise<Campus[]>;
  findOne(uuid: string);
  update(uuid: string, updateCampusDto: UpdateCampusDto): Promise<Campus>;
  remove(uuid: string);
}

export const ICampusesServiceToken = Symbol('ICampusesService');
