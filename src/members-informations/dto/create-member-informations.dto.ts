import { IsString, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { PickableInternUUIDFields } from 'src/utils/pickable-intern-uuid-fields';

export class CreateMemberInformationsDto extends PickType(PickableInternUUIDFields, [
    'uuidMember'
]) {

    @ApiProperty({
        description: 'Prénom du membre',
        example: 'Jean'
    })
    @IsString()
    @MaxLength(50)
    firstName: string;

    @ApiProperty({
        description: 'Nom de famille du membre',
        example: 'Dupont'
    })
    @IsString()
    @MaxLength(50)
    lastName: string;

    @ApiProperty({
        description: 'Adresse email du membre',
        example: 'jean.dupont@example.com'
    })
    @IsEmail()
    @MaxLength(100)
    email: string;

    uuidMember: string;
}
