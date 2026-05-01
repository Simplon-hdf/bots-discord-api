import { PickType } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';
import { PickableInternUUIDFields } from 'src/utils/pickable-intern-uuid-fields';

export class CreateIdentificationRequestDto extends PickType(PickableInternUUIDFields, [
    'uuidMember'
]) {

  @IsString()
  @Length(2, 50)
  firstname: string; // fistname_identification_request dans le MCD

  @IsString()
  @Length(2, 50)
  lastname: string; // lastname_identification_request dans le MCD

  @IsEmail()
  email: string; // email_identification_request dans le MCD

  uuidMember: string; 

}
