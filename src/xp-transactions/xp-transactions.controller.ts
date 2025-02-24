import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { XpTransactionsService } from './xp-transactions.service';
import { CreateXpTransactionDto } from './dto/create-xp-transaction.dto';
import { UpdateXpTransactionDto } from './dto/update-xp-transaction.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { XpTransactionResponseDto } from './dto/responses/xp-transaction.response.dto';

@ApiTags('xp-transactions')
@Controller('xp-transactions')
export class XpTransactionsController {
  constructor(private readonly xpTransactionsService: XpTransactionsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Créer une nouvelle transaction XP',
    description: 'Permet de créer une nouvelle transaction XP pour un membre.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Transaction XP créée avec succès',
    type: XpTransaction,
    content: {
      'application/json': {
        example: {
          uuid: '550e8400-e29b-41d4-a716-446655440000',
          transaction_type: 'GAIN',
          transaction_value: 100,
          createdAt: '2024-03-14T12:00:00Z',
          uuidMember: '123e4567-e89b-12d3-a456-426614174000',
          member: {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            guild_username: 'JohnDoe',
            xp: '100.00',
            level: 1,
            community_role: 'Member',
            status: 'Active'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Membre non trouvé' })
  async create(@Body() createXpTransactionDto: CreateXpTransactionDto): Promise<XpTransactionResponseDto> {
    return await this.xpTransactionsService.create(createXpTransactionDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Récupérer toutes les transactions XP',
    description: 'Retourne la liste de toutes les transactions XP avec leurs relations.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des transactions XP récupérée avec succès.',
    type: [XpTransactionResponseDto] 
  })
  async findAll(): Promise<XpTransactionResponseDto[]> {
    return await this.xpTransactionsService.findAll();
  }

  @Get('member/:uuid_member')
  @ApiOperation({ 
    summary: 'Récupérer les transactions XP d\'un membre',
    description: 'Retourne la liste des transactions XP d\'un membre spécifique.'
  })
  @ApiParam({ 
    name: 'uuid_member',
    description: 'UUID du membre dont on veut récupérer les transactions',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des transactions XP du membre récupérée avec succès.',
    type: [XpTransactionResponseDto] 
  })
  @ApiResponse({ status: 404, description: 'Membre non trouvé' })
  async findByMember(@Param('uuid_member') uuid_member: string): Promise<XpTransactionResponseDto[]> {
    return await this.xpTransactionsService.findByMember(uuid_member);
  }

  @Get(':uuid')
  @ApiOperation({ 
    summary: 'Récupérer une transaction XP par son UUID',
    description: 'Retourne les détails d\'une transaction XP spécifique.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'La transaction XP a été trouvée.',
    type: XpTransactionResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Transaction XP non trouvée' })
  async findOne(@Param('uuid') uuid: string): Promise<XpTransactionResponseDto> {
    return await this.xpTransactionsService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ 
    summary: 'Mettre à jour une transaction XP',
    description: 'Met à jour les informations d\'une transaction XP existante.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'La transaction XP a été mise à jour avec succès.',
    type: XpTransactionResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Transaction XP non trouvée' })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateXpTransactionDto: UpdateXpTransactionDto
  ): Promise<XpTransactionResponseDto> {
    return await this.xpTransactionsService.update(uuid, updateXpTransactionDto);
  }

  @Delete(':uuid')
  @ApiOperation({ 
    summary: 'Supprimer une transaction XP',
    description: 'Supprime une transaction XP existante.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'La transaction XP a été supprimée avec succès.' 
  })
  @ApiResponse({ status: 404, description: 'Transaction XP non trouvée' })
  async remove(@Param('uuid') uuid: string): Promise<void> {
    return await this.xpTransactionsService.remove(uuid);
  }
}
