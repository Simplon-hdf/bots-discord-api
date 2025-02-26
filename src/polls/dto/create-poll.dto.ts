import { IsString, IsNotEmpty, IsBoolean, IsInt, MaxLength, Length, ArrayMinSize, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateQuestionDto } from 'src/questions/dto/create-question.dto';
import { Type } from 'class-transformer';

export class CreatePollDto {
  @ApiProperty({ 
    description: "The title of the poll, which should be concise and descriptive.", 
    maxLength: 50, 
    example: 'Poll Title', 
    type: String 
  })
  @IsString({message: "The poll title must be a string"})
  @IsNotEmpty({message: "The poll title is required"})
  @MaxLength(50)
  title: string;

  @ApiProperty({ 
    description: "The ID of the associated message, used to link the poll to a specific message.", 
    maxLength: 19, 
    example: '1234567890123456789' 
  })
  @IsString({message: "The message UUID must be a string"})
  @IsNotEmpty({message: "The message UUID is required"})
  @Length(17,19, {message: "The message UUID must be a string of 17 to 19 characters"})
  uuidMessage: string;

  @ApiProperty({ 
    description: "Indicate if the responses to this poll are anonymous.", 
    example: false 
  })
  @IsBoolean({message: "The value must be a boolean"})
  isAnonymous: boolean;

  @ApiProperty({ 
    description: "Indicate if the poll is closed to responses.", 
    example: false 
  })
  @IsBoolean({message: "The value must be a boolean"})
  isClosed: boolean;

  @ApiProperty({ 
    description: "Duration of the poll in hours.", 
    example: 24 
  })
  @IsInt({message: "The poll duration must be an integer"})
  duration: number;

  @ApiProperty({ 
    description: "The questions of the poll.",
    type: [CreateQuestionDto],
    example: [{ 
      content: 'What is your favorite color ?', 
      isMultipleAnswer: true,
      answers: [{
        content: "Red"
      },
      {
        content: "Blue"
      }]
    }] 
  })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {message: "The poll must have at least one question"})
  @Type(()=>CreateQuestionDto)
  questions: CreateQuestionDto[];
}
