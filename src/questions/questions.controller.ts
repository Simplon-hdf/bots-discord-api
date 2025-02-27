import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionPollDto } from './dto/create-question-poll.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Question } from './entities/question.entity';
import { DeleteResult } from 'typeorm';

@Controller('questions')
@ApiTags('Questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new question' })
  @ApiResponse({ status: 201, description: 'The question was created successfully.', type: Question })
  create(@Body() createQuestionPollDto: CreateQuestionPollDto): Promise<Question> {
    return this.questionsService.create(createQuestionPollDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all questions' })
  @ApiResponse({ status: 200, description: 'List of all questions.', type: [Question] })
  findAll(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific question by ID' })
  @ApiResponse({ status: 200, description: 'The question was retrieved successfully.', type: Question })
  @ApiResponse({ status: 404, description: 'Question not found.' })
  findOne(@Param('id') id: string): Promise<Question | null> {
    return this.questionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a specific question by ID' })
  @ApiResponse({ status: 200, description: 'The question was updated successfully.', type: Question })
  @ApiResponse({ status: 404, description: 'Question not found.' })
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto): Promise<Question | null> {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific question by ID' })
  @ApiResponse({ status: 200, description: 'The question was deleted successfully.', type: DeleteResult })
  @ApiResponse({ status: 404, description: 'Question not found.' })
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.questionsService.remove(id);
  }
}