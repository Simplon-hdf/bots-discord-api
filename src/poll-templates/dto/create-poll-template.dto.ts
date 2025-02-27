import { IsString, IsNotEmpty, IsBoolean, IsInt, MaxLength, Length, ArrayMinSize, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateQuestionTemplateDto } from 'src/question-templates/dto/create-question-template.dto';

export class CreatePollTemplateDto {
    @ApiProperty({
        description: "The title of the poll template, which should be concise and descriptive.",
        maxLength: 50,
        example: 'Poll Template Title',
        type: String
    })
    @IsString({ message: "The poll template title must be a string" })
    @IsNotEmpty({ message: "The poll template title is required" })
    @MaxLength(50)
    title: string;

    @ApiProperty({
        description: "Indicate if the responses to this poll are anonymous.",
        example: false
    })
    @IsBoolean({ message: "The value must be a boolean" })
    isAnonymous: boolean;

    @ApiProperty({
        description: "Duration of the poll template in hours.",
        example: 24
    })
    @IsInt({ message: "The poll template duration must be an integer" })
    duration: number;

    @ApiProperty({
        description: "The questions of the poll template.",
        type: [CreateQuestionTemplateDto],
        example: [{
            content: 'What is your favorite color ?',
            isMultipleAnswer: true,
            answerTemplates: [{
                content: "Red"
            },
            {
                content: "Blue"
            }]
        }]
    })
    @ValidateNested({ each: true })
    @ArrayMinSize(1, { message: "The poll template must have at least one question" })
    @Type(() => CreateQuestionTemplateDto)
    questionTemplates: CreateQuestionTemplateDto[];
}
