import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question } from './entities/question.entity';
import { Answer } from 'src/answers/entities/answer.entity';
import { Poll } from 'src/polls/entities/poll.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question, Poll])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService]
})
export class QuestionsModule {}
