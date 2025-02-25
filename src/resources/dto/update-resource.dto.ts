import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateResourceDto } from './create-resource.dto';

// On exclut uuidMember du DTO de mise à jour
export class UpdateResourceDto extends PartialType(
  OmitType(CreateResourceDto, ['uuidMember'] as const)
) {} 