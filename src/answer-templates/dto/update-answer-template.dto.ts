import { PartialType } from '@nestjs/swagger';
import { CreateAnswerTemplateDto } from './create-answer-template.dto';

export class UpdateAnswerTemplateDto extends PartialType(CreateAnswerTemplateDto) {}
