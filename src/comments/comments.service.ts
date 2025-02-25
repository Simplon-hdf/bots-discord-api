import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentsRepository.create(createCommentDto);
    return await this.commentsRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentsRepository.find({
      relations: ['member', 'resource'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findOne(uuid: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { uuidComment: uuid },
      relations: ['member', 'resource']
    });
    
    if (!comment) {
      throw new NotFoundException(`Commentaire avec l'UUID ${uuid} non trouvé`);
    }
    
    return comment;
  }

  async findByResource(uuidResource: string): Promise<Comment[]> {
    const comments = await this.commentsRepository.find({
      where: { uuidResource },
      relations: ['member', 'resource'],
      order: {
        createdAt: 'DESC'
      }
    });

    return comments;
  }

  async update(uuid: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(uuid);
    
    Object.assign(comment, updateCommentDto);
    
    return await this.commentsRepository.save(comment);
  }

  async remove(uuid: string): Promise<void> {
    const result = await this.commentsRepository.delete({ uuidComment: uuid });
    
    if (result.affected === 0) {
      throw new NotFoundException(`Commentaire avec l'UUID ${uuid} non trouvé`);
    }
  }
}
