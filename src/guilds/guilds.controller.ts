import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { GuildsService } from './guilds.service';
import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Guild } from './entities/guild.entity';

@ApiTags('guilds')
@Controller('guilds')
export class GuildsController {
  constructor(private readonly guildService: GuildsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau serveur Discord' })
  @ApiResponse({ status: 201, description: 'Le serveur a été créé avec succès.', type: Guild })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  create(@Body() createGuildDto: CreateGuildDto) {
    return this.guildService.create(createGuildDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les serveurs Discord' })
  @ApiResponse({ status: 200, description: 'Liste des serveurs récupérée avec succès.', type: [Guild] })
  findAll() {
    return this.guildService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Récupérer un serveur Discord par son UUID' })
  @ApiResponse({ status: 200, description: 'Le serveur a été trouvé.', type: Guild })
  @ApiResponse({ status: 404, description: 'Serveur non trouvé' })
  findOne(@Param('uuid') uuid: string) {
    return this.guildService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Mettre à jour un serveur Discord' })
  @ApiResponse({ status: 200, description: 'Le serveur a été mis à jour avec succès.', type: Guild })
  @ApiResponse({ status: 404, description: 'Serveur non trouvé' })
  async update(@Param('uuid') uuid: string, @Body() updateGuildDto: UpdateGuildDto) {
    const guild = await this.guildService.update(uuid, updateGuildDto);
    if (!guild) {
      throw new NotFoundException(`Guild with UUID "${uuid}" not found`);
    }
    return guild;
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Supprimer un serveur Discord' })
  @ApiResponse({ status: 200, description: 'Le serveur a été supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Serveur non trouvé' })
  remove(@Param('uuid') uuid: string) {
    return this.guildService.remove(uuid);
  }
}
