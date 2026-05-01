import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Promotion } from './entities/promotion.entity';
import {
  IPromotionsServiceToken,
  IPromotionsService,
} from './interfaces/promotion.interface';

@ApiTags('promotions')
@ApiBearerAuth('JWT-auth')
@Controller('promotions')
export class PromotionsController {
  constructor(
    @Inject(IPromotionsServiceToken)
    private readonly promotionsService: IPromotionsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer une promotion',
    description:
      "Crée une promotion avec un rôle associé et l'enregistre en base de données.",
  })
  @ApiBody({ type: CreatePromotionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'La promotion a été créée avec succès.',
    type: Promotion,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides fournies dans la requête.',
  })
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.create(createPromotionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les promotions' })
  @ApiResponse({
    status: 200,
    description: 'Liste des promotions récupérée avec succès.',
    type: [Promotion],
  })
  findAll() {
    return this.promotionsService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Récupérer une promotion par son UUID' })
  @ApiResponse({
    status: 200,
    description: 'Promotion récupérée avec succès.',
    type: Promotion,
  })
  @ApiResponse({ status: 404, description: 'Promotion non trouvée' })
  findOne(@Param('uuid') uuid: string) {
    return this.promotionsService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Mettre à jour une promotion' })
  @ApiResponse({
    status: 200,
    description: 'La promotion a été mise à jour avec succès.',
    type: Promotion,
  })
  @ApiResponse({ status: 404, description: 'Promotion non trouvée' })
  async update(
    @Param('uuid') uuid: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    const promotion = await this.promotionsService.update(
      uuid,
      updatePromotionDto,
    );
    if (!promotion) {
      throw new NotFoundException(`Promotion with UUID "${uuid}" not found`);
    }
    return promotion;
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Supprimer une promotion' })
  @ApiResponse({
    status: 200,
    description: 'La promotion a été supprimée avec succès.',
  })
  @ApiResponse({ status: 404, description: 'Promotion non trouvée' })
  remove(@Param('uuid') uuid: string) {
    return this.promotionsService.remove(uuid);
  }

  @Post(':uuid_promotion/followers/:uuid_member')
  @ApiOperation({ summary: "Ajouter un membre comme follower d'une promotion" })
  @ApiParam({ name: 'uuid_promotion', description: 'UUID de la promotion' })
  @ApiParam({
    name: 'uuid_member',
    description: 'UUID du membre à ajouter comme follower',
  })
  @ApiResponse({
    status: 200,
    description: 'Le membre a été ajouté comme follower avec succès.',
    type: Promotion,
  })
  @ApiResponse({ status: 404, description: 'Promotion ou membre non trouvé' })
  @ApiResponse({
    status: 400,
    description: 'Le membre est déjà follower de cette promotion',
  })
  addFollower(
    @Param('uuid_promotion') uuidPromotion: string,
    @Param('uuid_member') uuidMember: string,
  ) {
    return this.promotionsService.addFollower(uuidPromotion, uuidMember);
  }

  @Post(':uuid_promotion/managers/:uuid_member')
  @ApiOperation({ summary: "Ajouter un membre comme manager d'une promotion" })
  @ApiParam({ name: 'uuid_promotion', description: 'UUID de la promotion' })
  @ApiParam({
    name: 'uuid_member',
    description: 'UUID du membre à ajouter comme manager',
  })
  @ApiResponse({
    status: 200,
    description: 'Le membre a été ajouté comme manager avec succès.',
    type: Promotion,
  })
  @ApiResponse({ status: 404, description: 'Promotion ou membre non trouvé' })
  @ApiResponse({
    status: 400,
    description: 'Le membre est déjà manager de cette promotion',
  })
  addManager(
    @Param('uuid_promotion') uuidPromotion: string,
    @Param('uuid_member') uuidMember: string,
  ) {
    return this.promotionsService.addManager(uuidPromotion, uuidMember);
  }
}
