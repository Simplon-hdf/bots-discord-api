import { IsString, MaxLength, IsEnum, IsOptional, IsDecimal, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { XpTransactionType, XpTransactionSource, ReferenceType } from '../entities/xp-transaction.entity';
import { PickableInternUUIDFields } from '../../utils/pickable-intern-uuid-fields';

/**
 * Data Transfer Object pour la création d'une transaction XP
 * 
 * @class CreateXpTransactionDto
 * @description Ce DTO définit la structure et les validations pour les données
 * nécessaires à la création d'une nouvelle transaction XP dans le système.
 * Il est utilisé pour valider les entrées lors de la création d'une transaction XP.
 * 
 * @example
 * ```typescript
 * const transaction = new CreateXpTransactionDto();
 * transaction.uuidMember = "123e4567-e89b-12d3-a456-426614174000";
 * transaction.amount = 100;
 * transaction.reason = "Participation active";
 * transaction.notes = "Aide exceptionnelle"; // Optionnel
 * ```
 * 
 * @see XpTransactionsService
 * @see XpTransactionsController
 */
export class CreateXpTransactionDto extends PickType(PickableInternUUIDFields, [
  'uuidMember'
]) {
  @ApiProperty({
    description: 'Type de la transaction',
    enum: XpTransactionType,
    example: XpTransactionType.GAIN
  })
  @IsEnum(XpTransactionType)
  transactionType: XpTransactionType;

  @ApiProperty({
    description: 'Source de la transaction',
    enum: XpTransactionSource,
    example: XpTransactionSource.VOTE
  })
  @IsEnum(XpTransactionSource)
  source: XpTransactionSource;

  @ApiProperty({
    description: 'Valeur de la transaction XP',
    example: '100.00',
    minimum: -1000,
    maximum: 1000
  })
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  @Min(-1000)
  @Max(1000)
  transaction_value: string;

  @ApiProperty({
    description: 'Raison de la transaction',
    example: 'Vote positif sur une ressource',
    maxLength: 200
  })
  @IsString()
  @MaxLength(200)
  reason: string;

  @ApiProperty({
    description: 'Notes additionnelles sur la transaction',
    example: 'Ressource particulièrement utile',
    required: false,
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({
    description: 'Type de l\'objet référencé',
    enum: ReferenceType,
    example: ReferenceType.RESOURCE,
    required: false
  })
  @IsOptional()
  @IsEnum(ReferenceType)
  referenceType?: ReferenceType;

  @ApiProperty({
    description: 'UUID de l\'objet référencé',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID()
  referenceUuid?: string;
}
