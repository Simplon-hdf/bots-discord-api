import { Controller, Get, Post, Body, Param, Delete, Put, ValidationPipe, UsePipes } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Poll } from './entities/poll.entity';
import { DeleteResult } from 'typeorm';

@Controller('polls')
@ApiTags('Polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new poll' })
  @ApiResponse({ status: 201, description: 'The poll was created successfully.', type: Poll })
  create(@Body() createPollDto: CreatePollDto): Promise<Poll> {
    return this.pollsService.create(createPollDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all polls' })
  @ApiResponse({ status: 200, description: 'List of all polls.', type: [Poll] })
  findAll(): Promise<Poll[]> {
    return this.pollsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific poll by ID' })
  @ApiResponse({ status: 200, description: 'The poll was retrieved successfully.', type: Poll })
  @ApiResponse({ status: 404, description: 'Poll not found.' })
  findOne(@Param('id') id: string): Promise<Poll | null> {
    return this.pollsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a specific poll by ID' })
  @ApiResponse({ status: 200, description: 'The poll was updated successfully.', type: Poll })
  @ApiResponse({ status: 404, description: 'Poll not found.' })
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto): Promise<Poll | null> {
    return this.pollsService.update(id, updatePollDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific poll by ID' })
  @ApiResponse({ status: 200, description: 'The poll was deleted successfully.', type: DeleteResult })
  @ApiResponse({ status: 404, description: 'Poll not found.' })
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.pollsService.remove(id);
  }
}
