import { IntersectionType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MaxLength, IsBoolean, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateAnswerDto } from 'src/answers/dto/create-answer.dto';
import { PickableInternUUIDFields } from 'src/utils/pickable-intern-uuid-fields';
import { CreateQuestionDto } from './create-question.dto';

export class CreateQuestionPollDto extends IntersectionType(
    CreateQuestionDto,
    PickType(PickableInternUUIDFields, ['uuidPoll'])
) {
  @MaxLength(50)
  content: string;

  @IsBoolean()
  isMultipleAnswer: boolean;

  @ValidateNested({ each: true })
  @ArrayMinSize(2, {message: "La question doit avoir au moins deux réponses"})
  @Type(()=>CreateAnswerDto)
  answers: CreateAnswerDto[];
}