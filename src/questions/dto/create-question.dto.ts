import { Type } from 'class-transformer';
import { MaxLength, IsBoolean, ValidateNested, ArrayMinSize, IsNotEmpty, IsString } from 'class-validator';
import { CreateAnswerDto } from 'src/answers/dto/create-answer.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ 
    description: "The content of the question.", 
    maxLength: 50, 
    example: "What is your favorite color?" 
  })
  @IsString({ message: "The question content must be a string" })
  @IsNotEmpty({ message: "The question content is required" })
  @MaxLength(50, { message: "The question content cannot exceed 50 characters" })
  content: string;

  @ApiProperty({ 
    description: "Indicates if multiple answers can be selected.", 
    example: false 
  })
  @IsBoolean({ message: "The value must be a boolean" })
  isMultipleAnswer: boolean;

  @ApiProperty({ 
    description: "The possible answers to the question.", 
    type: [CreateAnswerDto], 
    example: [{ content: "Red" }, { content: "Blue" }] 
  })
  @ValidateNested({ each: true })
  @ArrayMinSize(2, { message: "The question must have at least two answers" })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}