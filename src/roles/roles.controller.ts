import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import {
  IRolesServicesToken,
  IRolesService,
} from './interfaces/role.interface';

@ApiTags('roles')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
export class RolesController {
  constructor(
    @Inject(IRolesServicesToken) private readonly rolesService: IRolesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un nouveau rôle',
    description:
      'Crée un nouveau rôle dans la base de données avec les informations fournies.',
  })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Le rôle a été créé avec succès.',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides fournies dans la requête.',
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les rôles',
    description:
      'Retourne la liste de tous les rôles enregistrés dans la base de données.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste de tous les rôles récupérée avec succès.',
    type: [Role],
  })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Récupérer un rôle par son UUID',
    description:
      'Recherche et retourne un rôle spécifique en utilisant son UUID.',
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID unique du rôle à rechercher',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Le rôle a été trouvé et récupéré avec succès.',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Aucun rôle trouvé avec l'UUID fourni.",
  })
  findOne(@Param('uuid') uuid: string) {
    return this.rolesService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Mettre à jour un rôle',
    description:
      "Met à jour les informations d'un rôle existant en utilisant son UUID.",
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID unique du rôle à mettre à jour',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Le rôle a été mis à jour avec succès.',
    type: Role,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides fournies dans la requête.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Aucun rôle trouvé avec l'UUID fourni.",
  })
  update(@Param('uuid') uuid: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(uuid, updateRoleDto);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Supprimer un rôle',
    description:
      'Supprime un rôle existant de la base de données en utilisant son UUID.',
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID unique du rôle à supprimer',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Le rôle a été supprimé avec succès.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Aucun rôle trouvé avec l'UUID fourni.",
  })
  remove(@Param('uuid') uuid: string) {
    return this.rolesService.remove(uuid);
  }
}
