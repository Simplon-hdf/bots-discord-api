import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Campus } from './entities/campus.entity';
import {
  ICampusesServiceToken,
  ICampusesService,
} from './interfaces/campus.interface';

@ApiTags('campuses')
@ApiBearerAuth('JWT-auth')
@Controller('campuses')
export class CampusesController {
  constructor(
    @Inject(ICampusesServiceToken)
    private readonly campusService: ICampusesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau campus' })
  @ApiResponse({
    status: 201,
    description: 'Le campus a été créé avec succès.',
    type: Campus,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  create(@Body() createCampusDto: CreateCampusDto) {
    return this.campusService.create(createCampusDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les campus' })
  @ApiResponse({
    status: 200,
    description: 'Liste des campus récupérée avec succès.',
    type: [Campus],
  })
  findAll() {
    return this.campusService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Récupérer un campus par son UUID' })
  @ApiResponse({
    status: 200,
    description: 'Le campus a été trouvé.',
    type: Campus,
  })
  @ApiResponse({ status: 404, description: 'Campus non trouvé' })
  findOne(@Param('uuid') uuid: string) {
    return this.campusService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Mettre à jour un campus' })
  @ApiResponse({
    status: 200,
    description: 'Le campus a été mis à jour avec succès.',
    type: Campus,
  })
  @ApiResponse({ status: 404, description: 'Campus non trouvé' })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateCampusDto: UpdateCampusDto,
  ) {
    const campus = await this.campusService.update(uuid, updateCampusDto);
    if (!campus) {
      throw new NotFoundException(`Campus with UUID "${uuid}" not found`);
    }
    return campus;
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Supprimer un campus' })
  @ApiResponse({
    status: 200,
    description: 'Le campus a été supprimé avec succès.',
  })
  @ApiResponse({ status: 404, description: 'Campus non trouvé' })
  remove(@Param('uuid') uuid: string) {
    return this.campusService.remove(uuid);
  }
}
