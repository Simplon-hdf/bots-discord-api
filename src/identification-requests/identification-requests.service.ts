import { Injectable } from '@nestjs/common';
import { CreateIdentificationRequestDto } from './dto/create-identification-request.dto';
import { UpdateIdentificationRequestDto } from './dto/update-identification-request.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdentificationRequest } from './entities/identification-request.entity';

@Injectable()
export class IdentificationRequestsService {

  constructor(
    @InjectRepository(IdentificationRequest)
    private identificationRequestsRepository: Repository<IdentificationRequest>,
  ) {}
  create(createIdentificationRequestDto: CreateIdentificationRequestDto) {
    const identificationRequest = this.identificationRequestsRepository.create(createIdentificationRequestDto);
    return this.identificationRequestsRepository.save(identificationRequest);
  }

  findAll() {
    return this.identificationRequestsRepository.find();
  }

  findOne(uuid: string) {
    return this.identificationRequestsRepository.findOneBy({ uuid });
  }

  async update(uuid: string, updateIdentificationRequestDto: UpdateIdentificationRequestDto) {
    const identificationRequest = await this.identificationRequestsRepository.findOneBy({ uuid });
  
    if (!identificationRequest) {
      return null;
    }
  
    Object.assign(identificationRequest, updateIdentificationRequestDto);
  
    if (updateIdentificationRequestDto.uuidMember !== undefined) {
      identificationRequest.uuidMember = updateIdentificationRequestDto.uuidMember;
    }
  
    return this.identificationRequestsRepository.save(identificationRequest);
  }
  

  remove(uuid: string) {
    return this.identificationRequestsRepository.delete(uuid);
  }
}
