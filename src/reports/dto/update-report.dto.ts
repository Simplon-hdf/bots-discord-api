import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportCategory } from '../entities/report.entity';

export class UpdateReportDto {
  @ApiProperty({
    description: 'Catégorie du signalement (spam, harcèlement, contenu inapproprié, autre)',
    enum: ReportCategory,
    example: ReportCategory.INAPPROPRIATE,
    required: false
  })
  @IsEnum(ReportCategory)
  @IsNotEmpty()
  category?: ReportCategory;

  @ApiProperty({
    description: 'Raison détaillée du signalement',
    maxLength: 50,
    example: 'Contenu offensant envers la communauté',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  reason?: string;

  @ApiProperty({
    description: 'Statut du signalement',
    example: 'resolved',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  status?: string;
} 