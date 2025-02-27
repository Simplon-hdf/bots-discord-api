import { Module } from '@nestjs/common';
import { AnswerTemplatesService } from './answer-templates.service';
import { AnswerTemplatesController } from './answer-templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerTemplate } from './entities/answer-template.entity';
import { QuestionTemplate } from 'src/question-templates/entities/question-template.entity';
import { PollTemplate } from 'src/poll-templates/entities/poll-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerTemplate, QuestionTemplate, PollTemplate])],
  controllers: [AnswerTemplatesController],
  providers: [AnswerTemplatesService],
})
export class AnswerTemplatesModule {}
