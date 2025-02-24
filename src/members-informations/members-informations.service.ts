import { Injectable } from '@nestjs/common';
import { CreateMemberInformationsDto } from './dto/create-member-informations.dto';
import { UpdateMemberInformationsDto } from './dto/update-member-informations.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberInformation } from './entities/member-information.entity';

@Injectable()
export class MembersInformationsService {
  constructor(
    @InjectRepository(MemberInformation)
    private memberInformationsRepository: Repository<MemberInformation>,
  ) {}

  create(createMemberInformationDto: CreateMemberInformationsDto) {
    return this.memberInformationsRepository.save(createMemberInformationDto);
  }

  findAll() {
    return this.memberInformationsRepository.find();
  }

  findOne(uuid: string) {
    return this.memberInformationsRepository.findOneBy({ uuid });
  }

  async update(uuid: string, updateMemberInformationDto: UpdateMemberInformationsDto) {
    const memberInfo = await this.memberInformationsRepository.findOneBy({ uuid });
    if (!memberInfo) {
      return null;
    }
    
    // Mise à jour des champs autorisés uniquement
    const { firstName, lastName, email } = updateMemberInformationDto;
    if (firstName !== undefined) memberInfo.firstName = firstName;
    if (lastName !== undefined) memberInfo.lastName = lastName;
    if (email !== undefined) memberInfo.email = email;
    
    memberInfo.updatedAt = new Date();
    return this.memberInformationsRepository.save(memberInfo);
  }

  remove(uuid: string) {
    return this.memberInformationsRepository.delete(uuid);
  }
}
