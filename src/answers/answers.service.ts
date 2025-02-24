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
    if (!createAnswerQuestionDto) {
      throw new BadRequestException('Answer data is required');
    }
    const answer = this.answersRepository.create(createAnswerQuestionDto);
    return this.answersRepository.save(answer);
  }

  async findAll() {
    const answers = await this.answersRepository.find();
    if (!answers.length) {
      throw new NotFoundException('No answers found');
    }
    return answers;
  }

  async findOne(uuid: string) {
    if (!uuid) {
      throw new BadRequestException('UUID is required');
    }
    const answer = await this.answersRepository.findOneBy({ uuid });
    if (!answer) {
      throw new NotFoundException(`Answer with UUID "${uuid}" not found`);
    }
    return answer;
  }

  async update(uuid: string, updateAnswerDto: UpdateAnswerDto) {
    if (!uuid) {
      throw new BadRequestException('UUID is required');
    }
    if (!updateAnswerDto) {
      throw new BadRequestException('Update data is required');
    }
    const answer = await this.answersRepository.findOneBy({ uuid });
    if (!answer) {
      throw new NotFoundException(`Answer with UUID "${uuid}" not found`);
    }
    Object.assign(answer, updateAnswerDto);
    return this.answersRepository.save(answer);
  }

  async remove(uuid: string) {
    if (!uuid) {
      throw new BadRequestException('UUID is required');
    }
    const result = await this.answersRepository.delete({ uuid });
    if (result.affected === 0) {
      throw new NotFoundException(`Answer with UUID "${uuid}" not found`);
    }
    return { deleted: true };
  }
}
