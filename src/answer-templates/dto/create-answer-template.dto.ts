import { IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerTemplateDto {
  @ApiProperty({
    description: 'The content of the answer',
    example: 'Paris',
    maxLength: 50,
    type: String
  })
  @IsString({ message: 'Answer content must be a string' })
  @IsNotEmpty({ message: 'Answer content cannot be empty' })
  @MaxLength(50, { message: 'Answer content must not exceed 50 characters' })
  content: string;
}