import { Type } from 'class-transformer';
import { MaxLength, IsBoolean, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateAnswerTemplateDto } from 'src/answer-templates/dto/create-answer-template.dto';

export class CreateQuestionTemplateDto {
  @MaxLength(50)
  content: string;

  @IsBoolean()
  isMultipleAnswer: boolean;

  @ValidateNested({ each: true })
  @ArrayMinSize(2, {message: "La question doit avoir au moins deux réponses"})
  @Type(()=>CreateAnswerTemplateDto)
  answerTemplates: CreateAnswerTemplateDto[];
}