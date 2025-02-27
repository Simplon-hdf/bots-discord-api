import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePollTemplateDto } from './dto/create-poll-template.dto';
import { UpdatePollTemplateDto } from './dto/update-poll-template.dto';
import { PollTemplate } from './entities/poll-template.entity';
import { DeleteResult, Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class PollTemplatesService {
  constructor(
    @InjectRepository(PollTemplate)
    private pollTemplateRepository: Repository<PollTemplate>,
  ) {}

  create(createPollTemplateDto: CreatePollTemplateDto) : Promise<PollTemplate> {
    const pollTemplate = this.pollTemplateRepository.create(createPollTemplateDto);
    return this.pollTemplateRepository.save(pollTemplate);
  }

  findAll() : Promise<PollTemplate[]> {
    return this.pollTemplateRepository.find();
  }

  async findOne(uuid: string): Promise<PollTemplate> {
    if (!isUUID(uuid)) {
      throw new NotFoundException(`The poll template with UUID ${uuid} does not exist`);
    }
    const pollTemplate = await this.pollTemplateRepository.findOne({ where: { uuid } });
    if (!pollTemplate) {
      throw new NotFoundException(`The poll template with UUID ${uuid} does not exist`);
    }
    return pollTemplate;
  }

  async update(uuid: string, updatePollTemplateDto: UpdatePollTemplateDto) : Promise<PollTemplate> {
    if (!isUUID(uuid)) {
      throw new NotFoundException(`The poll template with UUID ${uuid} does not exist`);
    }
    const pollTemplate = await this.pollTemplateRepository.preload({
      uuid,
      ...updatePollTemplateDto
    })
    if (!pollTemplate) {
      throw new NotFoundException(`The poll template with UUID ${uuid} does not exist`);
    }
    return this.pollTemplateRepository.save(pollTemplate); 
  }

  async remove(uuid: string) : Promise<DeleteResult> {
    if (!isUUID(uuid)) {
      throw new NotFoundException(`The poll template with UUID ${uuid} does not exist`);
    }
    const pollTemplate = await this.pollTemplateRepository.findOne({ where: { uuid } });
    if (!pollTemplate) {
      throw new NotFoundException(`The poll template with UUID ${uuid} does not exist`);
    }
    return await this.pollTemplateRepository.delete(uuid);
  }
}
