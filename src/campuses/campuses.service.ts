import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { Campus } from './entities/campus.entity';

@Injectable()
export class CampusService {
  constructor(
    @InjectRepository(Campus)
    private campusRepository: Repository<Campus>,
  ) {}

  create(createCampusDto: CreateCampusDto) {
    const campus = this.campusRepository.create(createCampusDto);
    return this.campusRepository.save(campus);
  }

  findAll() {
    return this.campusRepository.find();
  }

  findOne(uuid: string) {
    return this.campusRepository.findOneBy({ uuid });
  }

  async update(uuid: string, updateCampusDto: UpdateCampusDto) {
    const campus = await this.campusRepository.findOneBy({ uuid });
    if (!campus) {
      return null;
    }
    Object.assign(campus, updateCampusDto);
    return this.campusRepository.save(campus);
  }

  remove(uuid: string) {
    return this.campusRepository.delete({ uuid });
  }
}
