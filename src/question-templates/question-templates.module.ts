import { Module } from '@nestjs/common';
import { QuestionTemplatesService } from './question-templates.service';
import { QuestionTemplatesController } from './question-templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollTemplate } from 'src/poll-templates/entities/poll-template.entity';
import { QuestionTemplate } from './entities/question-template.entity';
import { AnswerTemplate } from 'src/answer-templates/entities/answer-template.entity';

@Module({
  controllers: [QuestionTemplatesController],
  providers: [QuestionTemplatesService],
  imports: [TypeOrmModule.forFeature([PollTemplate, QuestionTemplate, AnswerTemplate])],
})
export class QuestionTemplatesModule {}
