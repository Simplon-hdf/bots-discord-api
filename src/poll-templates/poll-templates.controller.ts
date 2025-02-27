import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PollTemplatesService } from './poll-templates.service';
import { CreatePollTemplateDto } from './dto/create-poll-template.dto';
import { UpdatePollTemplateDto } from './dto/update-poll-template.dto';
import { PollTemplate } from './entities/poll-template.entity';

@ApiTags('Poll Templates')
@Controller('poll-templates')
export class PollTemplatesController {
  constructor(private readonly pollTemplatesService: PollTemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new poll template' })
  @ApiResponse({ status: 201, description: 'The poll template was created successfully.' })
  create(@Body() createPollTemplateDto: CreatePollTemplateDto) {
    return this.pollTemplatesService.create(createPollTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all poll templates' })
  @ApiResponse({ status: 200, description: 'List of all poll templates.', type: [PollTemplate] })
  findAll() {
    return this.pollTemplatesService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific poll template by ID' })
  @ApiResponse({ status: 200, description: 'The poll template was retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Poll template not found.' })
  findOne(@Param('uuid') uuid: string) {
    return this.pollTemplatesService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific poll template by ID' })
  @ApiResponse({ status: 200, description: 'The poll template was updated successfully.' })
  @ApiResponse({ status: 404, description: 'Poll template not found.' })
  update(@Param('uuid') uuid: string, @Body() updatePollTemplateDto: UpdatePollTemplateDto) {
    return this.pollTemplatesService.update(uuid, updatePollTemplateDto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a specific poll template by ID' })
  @ApiResponse({ status: 200, description: 'The poll template was deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Poll template not found.' })
  remove(@Param('uuid') uuid: string) {
    return this.pollTemplatesService.remove(uuid);
  }
}
