import { IsString, MaxLength } from 'class-validator';
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
}