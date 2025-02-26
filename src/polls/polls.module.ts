import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { Poll } from './entities/poll.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/questions/entities/question.entity';
import { Answer } from 'src/answers/entities/answer.entity';

@Module({
  controllers: [PollsController],
  providers: [PollsService],
  imports: [TypeOrmModule.forFeature([Poll, Question, Answer])],
})
export class PollsModule {}
