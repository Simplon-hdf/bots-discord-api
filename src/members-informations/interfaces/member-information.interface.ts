import { CreateMemberInformationsDto } from '../dto/create-member-informations.dto';
import { UpdateMemberInformationsDto } from '../dto/update-member-informations.dto';
import { MemberInformation } from '../entities/member-information.entity';

export interface IMembersInformationsService {
  create(createMemberInformationDto: CreateMemberInformationsDto);
  findAll();
  findOne(uuid: string);
  update(uuid: string, updateMemberInformationDto: UpdateMemberInformationsDto);
  remove(uuid: string);
}

export const IMembersInformationsServiceToken = Symbol(
  'IMembersInformationsService',
);
