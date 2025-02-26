import { Question } from 'src/questions/entities/question.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid_poll' })
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: "The unique identifier of the poll"
  })
  uuid: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({
    maxLength: 50,
    example: 'Poll title',
    description: "The title of the poll, which should be concise and descriptive."
  })
  title: string;

  @Column({ type: 'varchar', length: 19, name: 'uuid_message' })
  @ApiProperty({
    maxLength: 19,
    example: '1234567890123456789',
    description: "The ID of the associated message, used to link the poll to a specific message."
  })
  uuidMessage: string;

  @Column({ type: 'boolean', name: 'is_anonymous' })
  @ApiProperty({
    example: false,
    description: "Indicates whether the responses to this poll are anonymous."
  })
  isAnonymous: boolean;

  @Column({ type: 'boolean', name: 'is_closed' })
  @ApiProperty({
    example: false,
    description: "Indicates whether the poll is closed to responses."
  })
  isClosed: boolean;

  @Column({ type: 'int', name: 'duration' })
  @ApiProperty({
    example: 24,
    description: "Duration of the poll in hours."
  })
  duration: number;

  @OneToMany(() => Question, (question) => question.poll, {cascade: true})
  @ApiProperty({
    type: () => [Question],
    example: [{ 
      content: 'What is your favorite color?', 
      isMultipleAnswer: true,
      answers: [{
        content: "Red"
      },
      {
        content: "Blue"
      }]
    }],
    description: "List of questions associated with this poll."
  })
  questions: Question[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  @ApiProperty({
    example: '2025-02-20T10:49:33Z',
    description: "Timestamp of poll creation."
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true
  })
  @ApiProperty({
    example: '2025-02-27T10:49:33Z',
    description: "Timestamp of the last poll update."
  })
  updatedAt: Date;
}