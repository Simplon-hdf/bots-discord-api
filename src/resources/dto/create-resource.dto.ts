import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, MaxLength, IsEnum, IsNotEmpty } from 'class-validator';
import { PickableInternUUIDFields } from '../../utils/pickable-intern-uuid-fields';
import { PickableDtoFields } from '../../utils/pickable-dto-fields';

export class CreateResourceDto extends PickType(PickableInternUUIDFields, [
  'uuidMember' // Pour le créateur
]) {
  @ApiProperty({
    description: 'Le titre de la ressource',
    maxLength: 50,
    example: 'Guide de démarrage',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @ApiProperty({
    description: 'La description de la ressource',
    example: 'Un guide complet pour démarrer avec le bot',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Le contenu de la ressource',
    example: 'Voici les étapes pour configurer le bot...',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Le statut de la ressource',
    enum: ['active', 'inactive'],
    example: 'active',
    required: true
  })
  @IsEnum(['active', 'inactive'])
  @IsNotEmpty()
  status: string;
} 