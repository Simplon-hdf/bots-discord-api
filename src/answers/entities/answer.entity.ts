import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, ManyToMany} from 'typeorm';
import { Question } from 'src/questions/entities/question.entity';  
import { ApiProperty } from '@nestjs/swagger';
import { Member } from 'src/members/entities/member.entity';
@Entity('answers')
export class Answer {
  @ApiProperty({
    description: 'Unique identifier of the answer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    readOnly: true
  })
  @PrimaryGeneratedColumn('uuid', { name: 'uuid_answer' })
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
    type: () => Question
  })
  @ManyToOne(() => Question, (question) => question.answers, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'uuid_question' })
  question: Question;

  @ManyToMany(() => Member, (member) => member.answers)
  members: Member[];
}
