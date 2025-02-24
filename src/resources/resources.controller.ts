import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ResourceResponseDto } from './dto/responses/resource.response.dto';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Créer une nouvelle ressource',
    description: 'Permet de créer une nouvelle ressource dans la base de données.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'La ressource a été créée avec succès.',
    type: ResourceResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Membre non trouvé' })
  create(@Body() createResourceDto: CreateResourceDto): Promise<ResourceResponseDto> {
    return this.resourcesService.create(createResourceDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Récupérer toutes les ressources',
    description: 'Retourne la liste de toutes les ressources avec leurs relations.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des ressources récupérée avec succès.',
    type: [ResourceResponseDto] 
  })
  findAll(): Promise<ResourceResponseDto[]> {
    return this.resourcesService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ 
    summary: 'Récupérer une ressource par son UUID',
    description: 'Retourne les détails d\'une ressource spécifique avec toutes ses relations.'
  })
  @ApiParam({ 
    name: 'uuid',
    description: 'UUID de la ressource à récupérer',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'La ressource a été trouvée.',
    type: ResourceResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Ressource non trouvée' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<ResourceResponseDto> {
    return this.resourcesService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ 
    summary: 'Mettre à jour une ressource',
    description: 'Met à jour les informations d\'une ressource existante.'
  })
  @ApiParam({ 
    name: 'uuid',
    description: 'UUID de la ressource à mettre à jour',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'La ressource a été mise à jour avec succès.',
    type: ResourceResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Ressource non trouvée' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ): Promise<ResourceResponseDto> {
    return this.resourcesService.update(uuid, updateResourceDto);
  }

  @Delete(':uuid')
  @ApiOperation({ 
    summary: 'Supprimer une ressource',
    description: 'Supprime une ressource existante de la base de données.'
  })
  @ApiParam({ 
    name: 'uuid',
    description: 'UUID de la ressource à supprimer',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'La ressource a été supprimée avec succès.' 
  })
  @ApiResponse({ status: 404, description: 'Ressource non trouvée' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<void> {
    return this.resourcesService.remove(uuid);
  }
} 