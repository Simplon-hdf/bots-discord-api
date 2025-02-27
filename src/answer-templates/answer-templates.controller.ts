import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { AnswerTemplatesService } from './answer-templates.service';
import { CreateAnswerQuestionTemplateDto } from './dto/create-answer-question-template.dto';  
import { UpdateAnswerTemplateDto } from './dto/update-answer-template.dto';
import { AnswerTemplate } from './entities/answer-template.entity';

@ApiTags('Answer templates')
@Controller('answer-templates')
export class AnswerTemplatesController {
  constructor(private readonly answersService: AnswerTemplatesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new answer',
    description: 'Creates a new answer in the database with the provided information.'
  })
  @ApiBody({ type: CreateAnswerQuestionTemplateDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Answer successfully created.',
    type: AnswerTemplate 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid data provided in the request.' 
  })
  create(@Body() createAnswerQuestionDto: CreateAnswerQuestionTemplateDto) {
    return this.answersService.create(createAnswerQuestionDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all answers',
    description: 'Returns the list of all answers stored in the database.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of all answers successfully retrieved.',
    type: [AnswerTemplate] 
  })
  findAll() {
    return this.answersService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get an answer by UUID',
    description: 'Returns a single answer based on its UUID.'
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID of the answer to retrieve',
    type: String,
    required: true
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Answer successfully retrieved.',
    type: AnswerTemplate
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Answer with the specified UUID was not found.'
  })
  findOne(@Param('uuid') uuid: string) {
    return this.answersService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({
    summary: 'Update an answer',
    description: 'Updates an existing answer based on its UUID with the provided information.'
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID of the answer to update',
    type: String,
    required: true
  })
  @ApiBody({ type: UpdateAnswerTemplateDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Answer successfully updated.',
    type: AnswerTemplate
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Answer with the specified UUID was not found.'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided in the request.'
  })
  async update(@Param('uuid') uuid: string, @Body() updateAnswerDto: UpdateAnswerTemplateDto) {
    const answer = await this.answersService.update(uuid, updateAnswerDto);
    if (!answer) {
      throw new NotFoundException(`Answer with UUID "${uuid}" not found`);
    }
    return answer;
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete an answer',
    description: 'Deletes an existing answer based on its UUID.'
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID of the answer to delete',
    type: String,
    required: true
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Answer successfully deleted.'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Answer with the specified UUID was not found.'
  })
  remove(@Param('uuid') uuid: string) {
    return this.answersService.remove(uuid);
  }
}
