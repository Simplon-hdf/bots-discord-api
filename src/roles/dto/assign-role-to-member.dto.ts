import { PickType, ApiProperty } from "@nestjs/swagger";

import { PickableInternUUIDFields } from "src/utils/pickable-intern-uuid-fields";

import { ArrayNotEmpty, ArrayUnique, IsString, Matches } from "class-validator";

export class AssignRoleToMemberDto extends PickType(PickableInternUUIDFields, [
    'uuidMember',
]) {

    @ApiProperty({
        description: "Liste des UUID des rôles à attribuer au membre",
        example: ["12345678901234567", "123456789012345678", "1234567890123456789"]
    })
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsString({ each: true }) // Assure que chaque élément est une chaîne
    @Matches(/^\d{17,19}$/, { each: true, message: "Chaque uuidRole doit être un Snowflake Discord valide (17 à 19 chiffres uniquement)" })
    uuidRoles: string[];
}
