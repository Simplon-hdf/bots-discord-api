import { IsString, IsUUID, MaxLength, IsBoolean, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
    @ApiProperty({
        description: 'UUID unique du rôle',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    uuidRole: string;

    @ApiProperty({
        description: 'Nom du rôle',
        example: 'Modérateur',
        maxLength: 50
    })
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty({
        description: 'Nombre de membres ayant ce rôle',
        example: '10'
    })
    @IsString()
    @MaxLength(50)
    @Matches(/^\d+$/, { message: 'member_count doit être une chaîne numérique' })
    memberCount: string;

    @ApiProperty({
        description: 'Position du rôle dans la hiérarchie',
        example: '1'
    })
    @IsString()
    @MaxLength(50)
    @Matches(/^\d+$/, { message: 'role_position doit être une chaîne numérique' })
    rolePosition: string;

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

    @ApiProperty({
        description: 'UUID de la guilde à laquelle appartient le rôle',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @IsUUID()
    uuidGuild: string;
}
