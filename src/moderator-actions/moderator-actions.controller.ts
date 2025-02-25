import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  ValidationPipe,
  Headers,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ModeratorActionsService } from './moderator-actions.service';
import { CreateModeratorActionDto } from './dto/create-moderator-action.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiHeader } from '@nestjs/swagger';
import { ModeratorAction } from './entities/moderator-action.entity';

@ApiTags('Modération')
@Controller('moderator-actions')
export class ModeratorActionsController {
  constructor(private readonly moderatorActionsService: ModeratorActionsService) {}

  /**
   * Crée une nouvelle action de modération
   * @returns L'action créée avec un statut 201
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Créer une nouvelle action de modération',
    description: 'Permet à un modérateur de prendre une action suite à un signalement'
  })
  @ApiHeader({
    name: 'X-Member-UUID',
    description: 'UUID du modérateur',
    required: true
  })
  @ApiBody({ type: CreateModeratorActionDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'L\'action de modération a été créée avec succès.',
    type: ModeratorAction 
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données invalides' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Non autorisé' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ressource non trouvée' })
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createDto: CreateModeratorActionDto,
    @Headers('X-Member-UUID') currentUserId: string
  ): Promise<ModeratorAction> {
    if (currentUserId !== createDto.uuidMember) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action');
    }

    return this.moderatorActionsService.create(createDto);
  }

  /**
   * Récupère toutes les actions de modération
   * @returns Liste des actions avec un statut 200
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Récupérer toutes les actions de modération',
    description: 'Retourne la liste de toutes les actions de modération avec leurs relations.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Liste des actions de modération récupérée avec succès.',
    type: [ModeratorAction] 
  })
  async findAll(): Promise<ModeratorAction[]> {
    return this.moderatorActionsService.findAll();
  }

  /**
   * Récupère une action de modération spécifique
   * @param uuid UUID de l'action à récupérer
   * @returns L'action trouvée avec un statut 200
   */
  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Récupérer une action de modération par son UUID',
    description: 'Retourne les détails d\'une action de modération spécifique.'
  })
  @ApiParam({ 
    name: 'uuid',
    description: 'UUID de l\'action de modération',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'L\'action de modération a été trouvée.',
    type: ModeratorAction 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Action de modération non trouvée' })
  async findOne(@Param('uuid') uuid: string): Promise<ModeratorAction> {
    return this.moderatorActionsService.findOne(uuid);
  }

  /**
   * Supprime une action de modération
   * @param uuid UUID de l'action à supprimer
   * @returns Message de confirmation avec un statut 200
   */
  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Supprimer une action de modération',
    description: 'Les actions de modération ne peuvent pas être supprimées.'
  })
  @ApiParam({ 
    name: 'uuid',
    description: 'UUID de l\'action de modération',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Opération non autorisée' })
  async remove(@Param('uuid') uuid: string): Promise<void> {
    await this.moderatorActionsService.remove(uuid);
  }

  @Get('report/:reportUuid')
  @ApiOperation({ 
    summary: 'Récupérer les actions de modération pour un signalement',
    description: 'Retourne la liste des actions de modération liées à un signalement spécifique.'
  })
  @ApiParam({ 
    name: 'reportUuid',
    description: 'UUID du signalement',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Liste des actions de modération récupérée avec succès.',
    type: [ModeratorAction] 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Signalement non trouvé' })
  async findByReport(@Param('reportUuid') reportUuid: string): Promise<ModeratorAction[]> {
    return this.moderatorActionsService.findByReport(reportUuid);
  }
}
