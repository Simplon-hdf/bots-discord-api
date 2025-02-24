import { IsString, IsUUID, MaxLength, IsBoolean, Matches } from 'class-validator';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { PickableDtoFields } from 'src/utils/pickable-dto-fields';
import { PickableDiscordUUIDFields } from 'src/utils/pickable-discord-uuid-fields';

export class CreateRoleDto extends PickType(IntersectionType(PickableDtoFields, PickableDiscordUUIDFields), [
    'uuidRole', 'name', 'uuidGuild'
]) {
    
    @ApiProperty({
        description: 'Nombre de membres ayant ce rôle',
        example: '0',
        default: '0'
    })
    @IsString()
    @MaxLength(50)
    @Matches(/^\d+$/, { message: 'member_count doit être une chaîne numérique' })
    member_count: string = '0';

    @ApiProperty({
        description: 'Position du rôle dans la hiérarchie',
        example: '1'
    })
    @IsString()
    @MaxLength(50)
    @Matches(/^\d+$/, { message: 'role_position doit être une chaîne numérique' })
    role_position: string;

    @ApiProperty({
        description: 'Indique si le rôle est affiché séparément dans la liste des membres',
        example: true
    })
    @IsBoolean()
    hoist: boolean;

    @ApiProperty({
        description: 'Couleur du rôle en format hexadécimal',
        example: '#FF0000',
        pattern: '^#[0-9A-Fa-f]{6}$'
    })
    @IsString()
    @MaxLength(50)
    @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'color doit être un code hexadécimal valide (ex: #FF0000)' })
    color: string;
}