import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PollTemplate } from 'src/poll-templates/entities/poll-template.entity';
import { AnswerTemplate } from '../../answer-templates/entities/answer-template.entity';

@Entity('question-templates')
export class QuestionTemplate {
    @ApiProperty({
        description: 'Unique identifier of the question',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @PrimaryGeneratedColumn('uuid', { name: 'uuid_question_template' })
    uuid: string;
    
    @ApiProperty({
        description: 'Content of the question template',
        example: 'What is your favorite color?'
    })
    @Column()
    content: string;

    @ApiProperty({
        description: 'Whether multiple answers are allowed',
        example: true
    })
    @Column({name: 'is_multiple_answer'})
    isMultipleAnswer: boolean;

    @ApiProperty({
        description: 'The poll template this question belongs to',
        type: () => PollTemplate
    })
    @ManyToOne(() => PollTemplate, (pollTemplate) => pollTemplate.questionTemplates, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'uuid_poll_template' })
    pollTemplate: PollTemplate;

    @ApiProperty({
        description: 'The answers for this question template',
        type: () => [AnswerTemplate]
    })
    @OneToMany(() => AnswerTemplate, (answerTemplate) => answerTemplate.questionTemplate, {cascade: true})
    answerTemplates: AnswerTemplate[];

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2025-02-20T10:00:00Z'
    })
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2025-02-20T10:30:00Z'
    })
    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        nullable: true
    })
    updatedAt: Date;
}