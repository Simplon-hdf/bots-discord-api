import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateQuestionTemplateDto } from './create-question-template.dto';

export class UpdateQuestionTemplateDto extends OmitType(CreateQuestionTemplateDto, ['answerTemplates']) {}
