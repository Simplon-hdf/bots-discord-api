import { OmitType } from "@nestjs/swagger";
import { AssignRoleToMemberDto } from "./assign-role-to-member.dto";

export class UpdateMemberRolesDto extends OmitType(AssignRoleToMemberDto, [
    'uuidMember'] as const) {}

