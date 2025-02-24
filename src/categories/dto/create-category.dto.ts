import { IsString, IsInt, MaxLength, Min, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'ID Discord de la catégorie',
        example: '123456789012345678'
    })
    @IsString()
    @Length(17, 19)
    uuid: string;

    @ApiProperty({
        description: 'ID Discord du serveur',
        example: '123456789012345678'
    })
    @IsString()
    @Length(17, 19)
    uuidGuild: string;

    @ApiProperty({
        description: 'Nom de la catégorie',
        example: 'Général'
    })
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty({
        description: 'Position de la catégorie dans le serveur',
        example: 0
    })
    @IsInt()
    @Min(0)
    position: number;
}
