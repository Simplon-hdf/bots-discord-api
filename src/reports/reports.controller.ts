import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException, Headers } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { ReportResponseDto } from './dto/responses/report.response.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Créer un nouveau signalement',
    description: 'Permet de signaler une ressource ou un membre pour un comportement inapproprié.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Le signalement a été créé avec succès.',
    type: ReportResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Ressource ou membre non trouvé' })
  create(@Body() createReportDto: CreateReportDto): Promise<ReportResponseDto> {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Récupérer tous les signalements',
    description: 'Retourne la liste de tous les signalements avec leurs relations (reporter, resource, reported_member).'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des signalements récupérée avec succès.',
    type: [ReportResponseDto] 
  })
  findAll(): Promise<ReportResponseDto[]> {
    return this.reportsService.findAll();
  }

  @Get(':uuid_report')
  @ApiOperation({ 
    summary: 'Récupérer un signalement par son UUID',
    description: 'Retourne les détails d\'un signalement spécifique avec toutes ses relations.'
  })
  @ApiParam({ 
    name: 'uuid_report',
    description: 'UUID du signalement à récupérer',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Le signalement a été trouvé.',
    type: ReportResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Signalement non trouvé' })
  findOne(@Param('uuid_report') uuid_report: string): Promise<ReportResponseDto> {
    return this.reportsService.findOne(uuid_report);
  }

  @Patch(':uuid_report')
  @ApiOperation({ 
    summary: 'Mettre à jour un signalement',
    description: 'Cette fonctionnalité est réservée aux modérateurs.'
  })
  @ApiParam({ 
    name: 'uuid_report',
    description: 'UUID du signalement à mettre à jour',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Le signalement a été mis à jour avec succès.',
    type: ReportResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 403, description: 'Action non autorisée' })
  @ApiResponse({ status: 404, description: 'Signalement non trouvé' })
  update(@Param('uuid_report') uuid_report: string, @Body() updateReportDto: UpdateReportDto): Promise<ReportResponseDto> {
    throw new ForbiddenException(
      'Les utilisateurs ne peuvent pas modifier leurs signalements. Seuls les modérateurs peuvent mettre à jour le statut.'
    );
  }

  @Delete(':uuid_report')
  @ApiOperation({ 
    summary: 'Supprimer un signalement',
    description: 'Un utilisateur ne peut supprimer que ses propres signalements.'
  })
  @ApiParam({ 
    name: 'uuid_report',
    description: 'UUID du signalement à supprimer',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Le signalement a été supprimé avec succès.' 
  })
  @ApiResponse({ status: 403, description: 'Action non autorisée' })
  @ApiResponse({ status: 404, description: 'Signalement non trouvé' })
  remove(@Param('uuid_report') uuid_report: string, @Headers('X-Member-UUID') currentUserId: string): Promise<void> {
    return this.reportsService.remove(uuid_report, currentUserId);
  }
} 