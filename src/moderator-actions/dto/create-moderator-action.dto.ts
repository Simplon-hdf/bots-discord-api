import { IsString, IsNotEmpty, IsEnum, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { PickableInternUUIDFields } from '../../utils/pickable-intern-uuid-fields';

export enum ActionType {
  BAN = 'ban',
  WARN = 'warn'
}

export class CreateModeratorActionDto extends PickType(PickableInternUUIDFields, [
  'uuidMember', // Pour le modérateur
  'uuidReport' // Pour le signalement
]) {
  @ApiProperty({
    description: 'Type d\'action',
    enum: ActionType,
    example: ActionType.WARN
  })
  @IsNotEmpty({ message: 'Le type d\'action est requis' })
  @IsEnum(ActionType, { 
    message: `Le type d'action doit être l'un des suivants: ${Object.values(ActionType).join(', ')}`
  })
  type: ActionType;

  @ApiProperty({
    description: 'Raison de l\'action',
    example: 'Contenu inapproprié'
  })
  @IsNotEmpty({ message: 'La raison est requise' })
  @IsString({ message: 'La raison doit être une chaîne de caractères' })
  @Length(10, 500, { message: 'La raison doit contenir entre 10 et 500 caractères' })
  @Transform(({ value }) => value?.trim())
  reason: string;
}
