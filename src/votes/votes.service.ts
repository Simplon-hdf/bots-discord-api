import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Vote } from './entities/vote.entity';
import { Member } from '../members/entities/member.entity';
import { Resource } from '../resources/entities/resource.entity';
import { Comment } from '../comments/entities/comment.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  async create(createVoteDto: CreateVoteDto): Promise<Vote> {
    // Vérifier que le membre existe
    const member = await this.memberRepository.findOne({
      where: { uuidMember: createVoteDto.uuidMember }
    });
    if (!member) {
      throw new NotFoundException(`Member with UUID ${createVoteDto.uuidMember} not found`);
    }

    // Vérifier si c'est un vote sur une ressource ou un commentaire
    let resource: Resource | undefined;
    let comment: Comment | undefined;

    if (createVoteDto.uuidResource) {
      const foundResource = await this.resourceRepository.findOne({
        where: { uuidResource: createVoteDto.uuidResource }
      });
      if (!foundResource) {
        throw new NotFoundException(`Resource with UUID ${createVoteDto.uuidResource} not found`);
      }
      resource = foundResource;

      // Vérifier si le membre a déjà voté pour cette ressource
      const existingVote = await this.voteRepository.findOne({
        where: {
          member: { uuidMember: member.uuidMember },
          resource: { uuidResource: resource.uuidResource }
        }
      });
      if (existingVote) {
        throw new ConflictException(`Member has already voted for this resource`);
      }
    } else if (createVoteDto.uuidComment) {
      const foundComment = await this.commentRepository.findOne({
        where: { uuidComment: createVoteDto.uuidComment }
      });
      if (!foundComment) {
        throw new NotFoundException(`Comment with UUID ${createVoteDto.uuidComment} not found`);
      }
      comment = foundComment;

      // Vérifier si le membre a déjà voté pour ce commentaire
      const existingVote = await this.voteRepository.findOne({
        where: {
          member: { uuidMember: member.uuidMember },
          comment: { uuidComment: comment.uuidComment }
        }
      });
      if (existingVote) {
        throw new ConflictException(`Member has already voted for this comment`);
      }
    } else {
      throw new Error('Either uuidResource or uuidComment must be provided');
    }

    // Créer le vote
    const vote = this.voteRepository.create({
      voteType: createVoteDto.voteType,
      member,
      resource,
      comment
    });

    return await this.voteRepository.save(vote);
  }

  async findAll(): Promise<Vote[]> {
    return await this.voteRepository.find({
      relations: ['member', 'resource', 'comment']
    });
  }

  async findOne(uuid: string): Promise<Vote | null> {
    return await this.voteRepository.findOne({
      where: { uuidVote: uuid },
      relations: ['member', 'resource', 'comment']
    });
  }

  async remove(uuid: string): Promise<boolean> {
    const vote = await this.findOne(uuid);
    if (!vote) {
      throw new NotFoundException(`Vote with UUID ${uuid} not found`);
    }
    
    await this.voteRepository.remove(vote);
    return true;
  }
}
