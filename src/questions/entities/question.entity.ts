import { Answer } from 'src/answers/entities/answer.entity';
import { Poll } from 'src/polls/entities/poll.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('questions')
export class Question {
    @ApiProperty({
        description: 'Unique identifier of the question',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @PrimaryGeneratedColumn('uuid', { name: 'uuid_question' })
    uuid: string;
    
    @ApiProperty({
        description: 'Content of the question',
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
        description: 'The poll this question belongs to',
        type: () => Poll
    })
    @ManyToOne(() => Poll, (poll) => poll.questions, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'uuid_poll' })
    poll: Poll;

    @ApiProperty({
        description: 'The answers for this question',
        type: () => [Answer]
    })
    @OneToMany(() => Answer, (answer) => answer.question, {cascade: true})
    answers: Answer[];

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