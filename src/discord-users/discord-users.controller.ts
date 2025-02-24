import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { DiscordUsersService } from './discord-users.service';
import { CreateDiscordUserDto } from './dto/create-discord-user.dto';
import { UpdateDiscordUserDto } from './dto/update-discord-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DiscordUser } from './entities/discord-user.entity';

@ApiTags('discord-users')
@Controller('discord-users')
export class DiscordUsersController {
  constructor(private readonly discordUsersService: DiscordUsersService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel utilisateur Discord' })
  @ApiResponse({ status: 201, description: 'L\'utilisateur a été créé avec succès.', type: DiscordUser })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  create(@Body() createDiscordUserDto: CreateDiscordUserDto) {
    return this.discordUsersService.create(createDiscordUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs Discord' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs récupérée avec succès.', type: [DiscordUser] })
  findAll() {
    return this.discordUsersService.findAll();
  }

  @Get(':uuidDiscord')
  @ApiOperation({ summary: 'Récupérer un utilisateur Discord par son UUID' })
  @ApiResponse({ status: 200, description: 'L\'utilisateur a été trouvé.', type: DiscordUser })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  findOne(@Param('uuidDiscord') uuidDiscord: string) {
    return this.discordUsersService.findOne(uuidDiscord);
  }

  @Put(':uuidDiscord')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur Discord' })
  @ApiResponse({ status: 200, description: 'L\'utilisateur a été mis à jour avec succès.', type: DiscordUser })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async update(@Param('uuidDiscord') uuidDiscord: string, @Body() updateDiscordUserDto: UpdateDiscordUserDto) {
    const discordUser = await this.discordUsersService.update(uuidDiscord, updateDiscordUserDto);
    if (!discordUser) {
      throw new NotFoundException(`Discord user with UUID "${uuidDiscord}" not found`);
    }
    return discordUser;
  }

  @Delete(':uuidDiscord')
  @ApiOperation({ summary: 'Supprimer un utilisateur Discord' })
  @ApiResponse({ status: 200, description: 'L\'utilisateur a été supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  remove(@Param('uuidDiscord') uuidDiscord: string) {
    return this.discordUsersService.remove(uuidDiscord);
  }
} 