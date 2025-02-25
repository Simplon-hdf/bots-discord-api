import { IsString, Length, IsUUID, IsIn, IsNotEmpty, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object pour la création d'un commentaire
 * 
 * @class CreateCommentDto
 * @description Ce DTO définit la structure et les validations pour les données
 * nécessaires à la création d'un nouveau commentaire dans le système.
 * Il inclut des validations strictes pour le contenu et les identifiants.
 */
export class CreateCommentDto {
  @ApiProperty({
    description: 'Contenu du commentaire - doit contenir du texte valide sans HTML',
    example: 'Très bon travail sur ce projet !',
    minLength: 1,
    maxLength: 1000
  })
  @IsString({ message: 'Le contenu doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le contenu ne peut pas être vide' })
  @Length(1, 1000, { 
    message: 'Le contenu doit contenir entre $constraint1 et $constraint2 caractères'
  })
  @Matches(/^[^<>]*$/, {
    message: 'Le contenu ne doit pas contenir de balises HTML'
  })
  @Transform(({ value }) => value?.trim())
  content: string;

  @ApiProperty({
    description: 'Statut du commentaire - contrôle la visibilité du commentaire',
    example: 'active',
    enum: ['active', 'inactive', 'deleted']
  })
  @IsString({ message: 'Le statut doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le statut ne peut pas être vide' })
  @IsIn(['active', 'inactive', 'deleted'], { 
    message: 'Le statut doit être soit active, inactive ou deleted'
  })
  status: string;

  @ApiProperty({
    description: 'UUID du membre qui crée le commentaire - doit être un UUID v4 valide',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID('4', { message: 'L\'UUID du membre doit être un UUID v4 valide' })
  @IsNotEmpty({ message: 'L\'UUID du membre ne peut pas être vide' })
  uuid_member: string;

  @ApiProperty({
    description: 'UUID de la ressource commentée - doit être un UUID v4 valide',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID('4', { message: 'L\'UUID de la ressource doit être un UUID v4 valide' })
  @IsNotEmpty({ message: 'L\'UUID de la ressource ne peut pas être vide' })
  resource_uuid: string;

  @ApiProperty({
    description: 'UUID de l\'utilisateur Discord - doit être un UUID v4 valide',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID('4', { message: 'L\'UUID de l\'utilisateur doit être un UUID v4 valide' })
  @IsNotEmpty({ message: 'L\'UUID de l\'utilisateur ne peut pas être vide' })
  user_uuid: string;
}
