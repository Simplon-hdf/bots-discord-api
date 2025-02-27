import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn} from 'typeorm';
import { QuestionTemplate } from 'src/question-templates/entities/question-template.entity';  
import { ApiProperty } from '@nestjs/swagger';

@Entity('answer-templates')
export class AnswerTemplate {
  @ApiProperty({
    description: 'Unique identifier of the answer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    readOnly: true
  })
  @PrimaryGeneratedColumn('uuid', { name: 'uuid_answer_template' })
  uuid: string;

  @ApiProperty({
    description: 'The content of the answer',
    example: 'Paris',
    maxLength: 50,
    type: String
  })
  @Column({ type: 'varchar', length: 50 })
  content: string;

  @ApiProperty({
    description: 'The question associated with this answer',
    type: () => QuestionTemplate
  })
  @ManyToOne(() => QuestionTemplate, (questionTemplate) => questionTemplate.answerTemplates, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'uuid_question_template' })
  questionTemplate: QuestionTemplate;

}
