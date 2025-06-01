import { IsString, IsNotEmpty, IsBoolean, Length, Matches, IsOptional, MinLength } from "class-validator";
import { ApiProperty, IntersectionType, PickType } from "@nestjs/swagger";
import { PickableDiscordUUIDFields } from "src/utils/pickable-discord-uuid-fields";
import { PickableDtoFields } from "src/utils/pickable-dto-fields";

export class CreateCourseDto extends PickType(IntersectionType(PickableDiscordUUIDFields, PickableDtoFields), [
    'name', 
    'uuidGuild', 
    'uuidRole',
    'uuidCategory'
]) {

    @ApiProperty({
      description: 'ID Discord des cours',
      example: '123456789012345678',
    })
    @IsNotEmpty()
    @IsString()
    @Length(17, 19)
    @Matches(/^\d+$/)
    uuid: string;

    @ApiProperty({
        description: 'Nom de la formation',
        type: String,
        example: 'Développeur web',
    })
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @ApiProperty({
        description: 'Si la formation est certifiante',
        type: String,
        example: true,
    })
    @IsNotEmpty()
    @IsBoolean()
    isCertified: boolean;

    @IsOptional()
    uuidRole: string;
}