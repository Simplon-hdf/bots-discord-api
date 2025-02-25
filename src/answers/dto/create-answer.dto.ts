import { IsString, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
  @ApiProperty({
    description: 'The content of the answer',
    example: 'Paris',
    maxLength: 50,
    type: String
  })
  @IsString({message: 'Answer content must be a string'})
  @MaxLength(50, {message: 'Answer content must not exceed 50 characters'})
  content: string;

  @ApiProperty({
    description: 'UUID of the question this answer belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID('4', {message: 'Question UUID must be a valid UUID'})
  uuidQuestion: string;
}