import { IsString, Length, IsUUID, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object pour la création d'un commentaire
 * 
 * @class CreateCommentDto
 * @description Ce DTO définit la structure et les validations pour les données
 * nécessaires à la création d'un nouveau commentaire dans le système.
 */
export class CreateCommentDto {
  @ApiProperty({
    description: 'Contenu du commentaire',
    example: 'Très bon travail sur ce projet !',
    minLength: 1,
    maxLength: 1000
  })
  @IsString({ message: 'Le contenu doit être une chaîne de caractères' })
  @Length(1, 1000, { 
    message: 'Le contenu doit contenir entre $constraint1 et $constraint2 caractères'
  })
  @Transform(({ value }) => value?.trim())
  content: string;

  @ApiProperty({
    description: 'Statut du commentaire',
    example: 'active',
    enum: ['active', 'inactive', 'deleted']
  })
  @IsString({ message: 'Le statut doit être une chaîne de caractères' })
  @IsIn(['active', 'inactive', 'deleted'], { 
    message: 'Le statut doit être soit active, inactive ou deleted'
  })
  status: string;

  @ApiProperty({
    description: 'UUID du membre qui crée le commentaire',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID('4', { message: 'L\'UUID du membre doit être un UUID valide' })
  uuidMember: string;

  @ApiProperty({
    description: 'UUID de la ressource commentée',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID('4', { message: 'L\'UUID de la ressource doit être un UUID valide' })
  uuidResource: string;
}
