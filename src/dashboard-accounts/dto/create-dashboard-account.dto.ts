import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { PickableDiscordUUIDFields } from 'src/utils/pickable-discord-uuid-fields';

export class CreateDashboardAccountDto extends PickType(PickableDiscordUUIDFields, [
    'uuidDiscord'
]) {

    @ApiProperty({
        description: 'Email associé au compte du dashboard',
        type: String,
        example: 'test@example.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Mot de passe associé au compte du dashboard',
        type: String,
        example: 'password123',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    uuidDiscord: string;
}