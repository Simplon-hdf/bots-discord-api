import { IsEnum, IsNotEmpty, IsString, MaxLength, ValidateIf, IsUUID } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { ReportCategory, ReportType } from '../entities/report.entity';
import { PickableInternUUIDFields } from '../../utils/pickable-intern-uuid-fields';

export class CreateReportDto extends PickType(PickableInternUUIDFields, [
  'uuidReporter'
]) {
  @ApiProperty({
    description: 'Type de l\'élément signalé (ressource ou membre)',
    enum: ReportType,
    example: ReportType.RESOURCE,
    required: true
  })
  @IsEnum(ReportType)
  @IsNotEmpty()
  type: ReportType;

  @ApiProperty({
    description: 'Catégorie du signalement (spam, harcèlement, contenu inapproprié, autre)',
    enum: ReportCategory,
    example: ReportCategory.INAPPROPRIATE,
    required: true
  })
  @IsEnum(ReportCategory)
  @IsNotEmpty()
  category: ReportCategory;

  @ApiProperty({
    description: 'Raison détaillée du signalement',
    maxLength: 50,
    example: 'Contenu offensant envers la communauté',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  reason: string;

  @ApiProperty({
    description: 'UUID de la ressource signalée (requis uniquement si type = resource)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @ValidateIf(o => o.type === ReportType.RESOURCE)
  @IsUUID()
  @IsNotEmpty()
  uuidResource?: string;

  @ApiProperty({
    description: 'UUID du membre signalé (requis uniquement si type = member)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @ValidateIf(o => o.type === ReportType.MEMBER)
  @IsUUID()
  @IsNotEmpty()
  uuidReportedMember?: string;
} 