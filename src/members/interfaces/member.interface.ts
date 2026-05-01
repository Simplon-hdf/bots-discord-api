import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';

export interface IMembersService {
  create(createMemberDto: CreateMemberDto);
  findAll();
  findOne(uuidMember: string);
  findMemberPromotions(uuidMember: string);
  update(uuidMember: string, updateMemberDto: UpdateMemberDto);
  remove(uuidMember: string);
  getMemberRoles(uuidMember: string);
  assignRoleToMember(uuidMember: string, uuidRole: string);
  removeRoleFromMember(uuidMember: string, uuidRole: string);
}

export const IMembersServiceToken = Symbol('IMembersService');
