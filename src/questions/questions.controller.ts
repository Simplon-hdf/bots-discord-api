import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionPollDto } from './dto/create-question-poll.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() createQuestionPollDto: CreateQuestionPollDto) {
    return this.questionsService.create(createQuestionPollDto);
  }

  @Get()
  findAll() {
    return this.questionsService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.questionsService.findOne(uuid);
  }

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionsService.update(uuid, updateQuestionDto);
    if (!question) {
      throw new NotFoundException(`Question with UUID "${uuid}" not found`);
    }
    return question;
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.questionsService.remove(uuid);
  }
}