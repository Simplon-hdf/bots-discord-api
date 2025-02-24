import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answer } from './entities/answer.entity';
import { CreateAnswerQuestionDto } from './dto/create-answer-question.dto';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private answersRepository: Repository<Answer>,
  ) {}

  async create(createAnswerQuestionDto: CreateAnswerQuestionDto) {
    const answer = this.answersRepository.create(createAnswerQuestionDto);
    return this.answersRepository.save(answer);
  }

  async findAll() {
    return this.answersRepository.find();
  }

  async findOne(uuid: string) {
    return this.answersRepository.findOneBy({ uuid });
  }

  async update(uuid: string, updateAnswerDto: UpdateAnswerDto) {
    const answer = await this.answersRepository.findOneBy({ uuid });
    if (!answer) {
      return null;
    }
    Object.assign(answer, updateAnswerDto);
    return this.answersRepository.save(answer);
  }

  async remove(uuid: string) {
    return this.answersRepository.delete({ uuid });
  }
}
