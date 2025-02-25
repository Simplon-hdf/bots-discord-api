import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO pour la création d'un tag
 * 
 * @class CreateTagDto
 * @description Définit la structure et les validations pour la création d'un nouveau tag.
 * Le nom du tag doit respecter un format spécifique : lettres, chiffres, tirets et underscores uniquement.
 */
export class CreateTagDto {
  @ApiProperty({
    description: 'Nom du tag - uniquement lettres, chiffres, tirets et underscores',
    minLength: 2,
    maxLength: 50,
    example: 'javascript-2024',
    pattern: '^[a-zA-Z0-9-_]+$'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message: 'Le nom du tag ne peut contenir que des lettres, chiffres, tirets et underscores'
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Description détaillée du tag pour expliquer son utilisation',
    maxLength: 255,
    example: 'Tag pour les sujets liés à JavaScript version 2024'
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
