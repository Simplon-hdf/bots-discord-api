import { Module } from '@nestjs/common';
import { PollTemplatesService } from './poll-templates.service';
import { PollTemplatesController } from './poll-templates.controller';
import { PollTemplate } from './entities/poll-template.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionTemplate } from 'src/question-templates/entities/question-template.entity';
import { AnswerTemplate } from 'src/answer-templates/entities/answer-template.entity';

@Module({
  controllers: [PollTemplatesController],
  providers: [PollTemplatesService],
  imports: [TypeOrmModule.forFeature([PollTemplate, QuestionTemplate, AnswerTemplate])],
})
export class PollTemplatesModule {}
