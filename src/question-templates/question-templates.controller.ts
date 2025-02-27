import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { QuestionTemplatesService } from './question-templates.service';
import { CreateQuestionPollTemplateDto } from './dto/create-question-poll-template.dto';
import { UpdateQuestionTemplateDto } from './dto/update-question-template.dto';

@Controller('question-templates')
export class QuestionTemplatesController {
  constructor(private readonly questionTemplatesService: QuestionTemplatesService) {}

  @Post()
  create(@Body() createQuestionPollTemplateDto: CreateQuestionPollTemplateDto) {
    return this.questionTemplatesService.create(createQuestionPollTemplateDto);
  }

  @Get()
  findAll() {
    return this.questionTemplatesService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.questionTemplatesService.findOne(uuid);
  }

  @Put(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateQuestionTemplateDto: UpdateQuestionTemplateDto) {
    return this.questionTemplatesService.update(uuid, updateQuestionTemplateDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.questionTemplatesService.remove(uuid);
  }
}
