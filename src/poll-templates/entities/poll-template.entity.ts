import { Question } from 'src/questions/entities/question.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionTemplate } from 'src/question-templates/entities/question-template.entity';

@Entity('poll-templates')
export class PollTemplate {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid_poll_template' })
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: "The unique identifier of the poll template"
  })
  uuid: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({
    maxLength: 50,
    example: 'Poll title',
    description: "The title of the poll template, which should be concise and descriptive."
  })
  title: string;

  @Column({ type: 'boolean', name: 'is_anonymous' })
  @ApiProperty({
    example: false,
    description: "Indicates whether the responses to this poll template are anonymous."
  })
  isAnonymous: boolean;

  @Column({ type: 'int', name: 'duration' })
  @ApiProperty({
    example: 24,
    description: "Duration of the poll template in hours."
  })
  duration: number;

  @OneToMany(() => QuestionTemplate, (questionTemplate) => questionTemplate.pollTemplate, {cascade: true})
  @ApiProperty({
    type: () => [QuestionTemplate],
    example: [{ 
      content: 'What is your favorite color?', 
      isMultipleAnswer: true,
      answerTemplates: [{
        content: "Red"
      },
      {
        content: "Blue"
      }]
    }],
    description: "List of questions associated with this poll template."
  })
  questionTemplates: Question[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  @ApiProperty({
    example: '2025-02-20T10:49:33Z',
    description: "Timestamp of poll template creation."
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true
  })
  @ApiProperty({
    example: '2025-02-27T10:49:33Z',
    description: "Timestamp of the last poll templat template update."
  })
  updatedAt: Date;
}