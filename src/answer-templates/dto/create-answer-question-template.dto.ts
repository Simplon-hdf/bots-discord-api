import { IntersectionType, PickType } from '@nestjs/swagger';
import { PickableInternUUIDFields } from 'src/utils/pickable-intern-uuid-fields';
import { CreateAnswerTemplateDto } from './create-answer-template.dto';

export class CreateAnswerQuestionTemplateDto extends IntersectionType(
    CreateAnswerTemplateDto, 
    PickType(PickableInternUUIDFields, ['uuidQuestionTemplate']))
  {
}