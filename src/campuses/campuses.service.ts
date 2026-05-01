import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { Role } from 'src/roles/entities/role.entity';
import { Campus } from './entities/campus.entity';
import { ICampusesService } from './interfaces/campus.interface';

@Injectable()
export class CampusesService implements ICampusesService {
  constructor(
    @InjectRepository(Campus)
    private campusRepository: Repository<Campus>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createCampusDto: CreateCampusDto): Promise<Campus> {
    try {
      const newRole = this.roleRepository.create({
        uuidRole: createCampusDto.uuidRole,
        uuidGuild: createCampusDto.uuidGuild,
        name: createCampusDto.name,
        memberCount: 0,
        rolePosition: 0,
        hoist: false,
        color: '#000000',
      });

      const savedRole = await this.roleRepository.save(newRole);

      const newCampus = this.campusRepository.create({
        ...createCampusDto,
        uuidRole: savedRole.uuidRole,
      });

      return await this.campusRepository.save(newCampus);
    } catch (error) {
      throw new BadRequestException(
        'Erreur lors de la création du campus: ' + error.message,
      );
    }
  }

  findAll(): Promise<Campus[]> {
    return this.campusRepository.find();
  }

  findOne(uuidCampus: string) {
    if (!uuidCampus) {
      throw new NotFoundException('UUID du campus manquant');
    }
    return this.campusRepository.findOneBy({ uuidCampus });
  }

  async update(uuidCampus: string, updateCampusDto: UpdateCampusDto) {
    const campus = await this.campusRepository.findOneBy({ uuidCampus });
    if (!campus) {
      throw new NotFoundException(`Campus with UUID "${uuidCampus}" not found`);
    }
    Object.assign(campus, updateCampusDto);
    return this.campusRepository.save(campus);
  }

  remove(uuidCampus: string) {
    if (!uuidCampus) {
      throw new NotFoundException(`Campus with UUID "${uuidCampus}" not found`);
    }
    return this.campusRepository.delete({ uuidCampus });
  }
}
