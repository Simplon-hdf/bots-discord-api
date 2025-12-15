import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { MembersInformationsService } from './members-informations.service';
import { CreateMemberInformationsDto } from './dto/create-member-informations.dto';
import { UpdateMemberInformationsDto } from './dto/update-member-informations.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MemberInformation } from './entities/member-information.entity';

@ApiTags('members-informations')
@ApiBearerAuth('JWT-auth')
@Controller('members-informations')
export class MembersInformationsController {
  constructor(private readonly membersInformationsService: MembersInformationsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer des informations pour un membre' })
  @ApiResponse({ status: 201, description: 'Les informations ont été créées avec succès.', type: MemberInformation })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  create(@Body() createMemberInformationDto: CreateMemberInformationsDto) {
    return this.membersInformationsService.create(createMemberInformationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer les informations de tous les membres' })
  @ApiResponse({ status: 200, description: 'Liste des informations récupérée avec succès.', type: [MemberInformation] })
  findAll() {
    return this.membersInformationsService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Récupérer les informations d\'un membre par son UUID' })
  @ApiResponse({ status: 200, description: 'Les informations ont été trouvées.', type: MemberInformation })
  @ApiResponse({ status: 404, description: 'Informations non trouvées' })
  findOne(@Param('uuid') uuid: string) {
    return this.membersInformationsService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Mettre à jour les informations d\'un membre' })
  @ApiResponse({ status: 200, description: 'Les informations ont été mises à jour avec succès.', type: MemberInformation })
  @ApiResponse({ status: 404, description: 'Informations non trouvées' })
  async update(@Param('uuid') uuid: string, @Body() updateMemberInformationsDto: UpdateMemberInformationsDto) {
    const memberInformations = await this.membersInformationsService.update(uuid, updateMemberInformationsDto);
    if (!memberInformations) {
      throw new NotFoundException(`MemberInformations with UUID "${uuid}" not found`);
    }
    return memberInformations;
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Supprimer les informations d\'un membre' })
  @ApiResponse({ status: 200, description: 'Les informations ont été supprimées avec succès.' })
  @ApiResponse({ status: 404, description: 'Informations non trouvées' })
  remove(@Param('uuid') uuid: string) {
    return this.membersInformationsService.remove(uuid);
  }
}
