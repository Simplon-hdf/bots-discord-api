import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Member } from '../members/entities/member.entity';
import { plainToInstance } from 'class-transformer';
import { ResourceResponseDto } from './dto/responses/resource.response.dto';
import { Comment } from '../comments/entities/comment.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>
  ) {}

  async create(createResourceDto: CreateResourceDto): Promise<ResourceResponseDto> {
    const { uuidMember, ...resourceData } = createResourceDto;
    
    // On cherche le membre
    const member = await this.membersRepository.findOne({
      where: { uuidMember }
    });
    if (!member) {
      throw new NotFoundException(`Member with UUID ${uuidMember} not found`);
    }

    // On crée la ressource avec le membre et son UUID
    const resource = this.resourcesRepository.create({
      ...resourceData,
      creator: member,
      creatorUuid: member.uuidMember
    });
    
    const savedResource = await this.resourcesRepository.save(resource);
    const resourceWithRelations = await this.resourcesRepository.findOne({
      where: { uuidResource: savedResource.uuidResource },
      relations: [
        'creator',
        'reports',
        'reports.reporter',
        'votes',
        'votes.member',
        'comments',
        'comments.member',
        'comments.votes',
        'comments.votes.member'
      ]
    });
    return plainToInstance(ResourceResponseDto, resourceWithRelations, { excludeExtraneousValues: true });
  }

  async findAll(): Promise<ResourceResponseDto[]> {
    const resources = await this.resourcesRepository.find({
      relations: [
        'creator',
        'reports',
        'reports.reporter',
        'votes',
        'votes.member',
        'comments',
        'comments.member',
        'comments.votes',
        'comments.votes.member'
      ],
      order: {
        createdAt: 'DESC'
      }
    });
    return resources.map(resource => 
      plainToInstance(ResourceResponseDto, resource, { excludeExtraneousValues: true })
    );
  }

  async findOne(uuid: string): Promise<ResourceResponseDto> {
    const resource = await this.resourcesRepository.findOne({
      where: { uuidResource: uuid },
      relations: [
        'creator',
        'reports',
        'reports.reporter',
        'votes',
        'votes.member',
        'comments',
        'comments.member',
        'comments.votes',
        'comments.votes.member'
      ]
    });

    if (!resource) {
      throw new NotFoundException(`Resource with UUID ${uuid} not found`);
    }

    return plainToInstance(ResourceResponseDto, resource, { excludeExtraneousValues: true });
  }

  async findComments(uuid: string): Promise<Comment[]> {
    // Vérifie d'abord si la ressource existe
    const resource = await this.resourcesRepository.findOne({
      where: { uuidResource: uuid }
    });

    if (!resource) {
      throw new NotFoundException(`Resource with UUID ${uuid} not found`);
    }

    // Récupère les commentaires de la ressource
    const comments = await this.commentsRepository.find({
      where: { uuidResource: uuid },
      relations: ['member', 'resource', 'votes', 'votes.member'],
      order: {
        createdAt: 'DESC'
      }
    });

    return comments;
  }

  async update(uuid: string, updateResourceDto: UpdateResourceDto): Promise<ResourceResponseDto> {
    const existingResource = await this.resourcesRepository.findOne({
      where: { uuidResource: uuid }
    });
    
    if (!existingResource) {
      throw new NotFoundException(`Resource with UUID ${uuid} not found`);
    }

    const updatedResource = await this.resourcesRepository.save({
      ...existingResource,
      ...updateResourceDto
    });

    const resourceWithRelations = await this.resourcesRepository.findOne({
      where: { uuidResource: updatedResource.uuidResource },
      relations: [
        'creator',
        'reports',
        'reports.reporter',
        'votes',
        'votes.member',
        'comments',
        'comments.member',
        'comments.votes',
        'comments.votes.member'
      ]
    });

    return plainToInstance(ResourceResponseDto, resourceWithRelations, { excludeExtraneousValues: true });
  }

  async remove(uuid: string): Promise<void> {
    const resource = await this.resourcesRepository.findOne({
      where: { uuidResource: uuid }
    });
    
    if (!resource) {
      throw new NotFoundException(`Resource with UUID ${uuid} not found`);
    }

    await this.resourcesRepository.remove(resource);
  }
} 