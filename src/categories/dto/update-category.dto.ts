import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(
  OmitType(CreateCategoryDto, ['uuid', 'uuidGuild'] as const),
) {
  @ApiProperty({
    description: 'ID Discord du template de serveur associé',
    example: '123456789012345678',
    required: false
  })
  @IsString()
  @Length(17, 19)
  @IsOptional()
  uuidGuildTemplate?: string;
}
