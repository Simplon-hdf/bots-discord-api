import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  HttpStatus, 
  HttpException,
  ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Vote } from './entities/vote.entity';

@ApiTags('Votes')
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau vote' })
  @ApiResponse({ 
    status: 201, 
    description: 'Le vote a été créé avec succès',
    type: Vote,
    content: {
      'application/json': {
        example: {
          voteUuid: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          itemId: '123e4567-e89b-12d3-a456-426614174002',
          voteType: 'upvote',
          voteCreatedAt: '2024-01-01T00:00:00Z',
          voteUpdatedAt: '2024-01-01T00:00:00Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Requête invalide',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Erreur lors de la création du vote',
          error: 'Bad Request'
        }
      }
    }
  })
  async create(@Body() createVoteDto: CreateVoteDto): Promise<Vote> {
    try {
      return await this.votesService.create(createVoteDto);
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la création du vote',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les votes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des votes récupérée avec succès',
    type: [Vote],
    content: {
      'application/json': {
        example: [{
          voteUuid: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          itemId: '123e4567-e89b-12d3-a456-426614174002',
          voteType: 'upvote',
          voteCreatedAt: '2024-01-01T00:00:00Z',
          voteUpdatedAt: '2024-01-01T00:00:00Z'
        }]
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
    content: {
      'application/json': {
        example: {
          statusCode: 500,
          message: 'Erreur lors de la récupération des votes',
          error: 'Internal Server Error'
        }
      }
    }
  })
  async findAll(): Promise<Vote[]> {
    try {
      return await this.votesService.findAll();
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des votes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un vote par son ID' })
  @ApiParam({ name: 'id', description: 'ID du vote', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Vote trouvé avec succès',
    type: Vote,
    content: {
      'application/json': {
        example: {
          voteUuid: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          itemId: '123e4567-e89b-12d3-a456-426614174002',
          voteType: 'upvote',
          voteCreatedAt: '2024-01-01T00:00:00Z',
          voteUpdatedAt: '2024-01-01T00:00:00Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Vote non trouvé',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Vote non trouvé',
          error: 'Not Found'
        }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
    content: {
      'application/json': {
        example: {
          statusCode: 500,
          message: 'Erreur lors de la récupération du vote',
          error: 'Internal Server Error'
        }
      }
    }
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Vote> {
    try {
      const vote = await this.votesService.findOne(id);
      if (!vote) {
        throw new HttpException('Vote non trouvé', HttpStatus.NOT_FOUND);
      }
      return vote;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erreur lors de la récupération du vote',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un vote' })
  @ApiParam({ name: 'id', description: 'ID du vote', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Vote supprimé avec succès',
    content: {
      'application/json': {
        example: {
          statusCode: 200,
          message: 'Vote supprimé avec succès'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Vote non trouvé',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Vote non trouvé',
          error: 'Not Found'
        }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur',
    content: {
      'application/json': {
        example: {
          statusCode: 500,
          message: 'Erreur lors de la suppression du vote',
          error: 'Internal Server Error'
        }
      }
    }
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    try {
      const result = await this.votesService.remove(id);
      if (!result) {
        throw new HttpException('Vote non trouvé', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erreur lors de la suppression du vote',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
