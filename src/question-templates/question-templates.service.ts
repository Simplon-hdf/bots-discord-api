import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionTemplateDto } from './dto/create-question-template.dto';
import { UpdateQuestionTemplateDto } from './dto/update-question-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionTemplate } from './entities/question-template.entity';
import { DeleteResult, Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class QuestionTemplatesService {
  constructor(
    @InjectRepository(QuestionTemplate)
    private questionTemplateRepository: Repository<QuestionTemplate>,
  ) {}

  create(createQuestionTemplateDto: CreateQuestionTemplateDto) : Promise<QuestionTemplate> {
    const questionTemplate = this.questionTemplateRepository.create(createQuestionTemplateDto);
    return this.questionTemplateRepository.save(questionTemplate);
  }

  findAll() : Promise<QuestionTemplate[]> {
    return this.questionTemplateRepository.find();
  }

  async findOne(uuid: string): Promise<QuestionTemplate> {
    if (!isUUID(uuid)) {
      throw new NotFoundException(`The question template with UUID ${uuid} does not exist`);
    }
    const questionTemplate = await this.questionTemplateRepository.findOne({ where: { uuid } });
    if (!questionTemplate) {
      throw new NotFoundException(`The question template with UUID ${uuid} does not exist`);
    }
    return questionTemplate;
  }

  async update(uuid: string, updateQuestionTemplateDto: UpdateQuestionTemplateDto) : Promise<QuestionTemplate> {
    if (!isUUID(uuid)) {
      throw new NotFoundException(`The question template with UUID ${uuid} does not exist`);
    }
    const questionTemplate = await this.questionTemplateRepository.preload({
      uuid,
      ...updateQuestionTemplateDto
    })
    if (!questionTemplate) {
      throw new NotFoundException(`The question template with UUID ${uuid} does not exist`);
    }
    return this.questionTemplateRepository.save(questionTemplate); 
  }

  async remove(uuid: string) : Promise<DeleteResult> {
    if (!isUUID(uuid)) {
      throw new NotFoundException(`The question template with UUID ${uuid} does not exist`);
    }
    const questionTemplate = await this.questionTemplateRepository.findOne({ where: { uuid } });
    if (!questionTemplate) {
      throw new NotFoundException(`The question template with UUID ${uuid} does not exist`);
    }
    return await this.questionTemplateRepository.delete(uuid);
  }
}
