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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import {
  ICategoriesServiceToken,
  ICategoriesService,
} from './interfaces/category.interface';

@ApiTags('categories')
@ApiBearerAuth('JWT-auth')
@Controller('categories')
export class CategoriesController {
  constructor(
    @Inject(ICategoriesServiceToken)
    private readonly categoriesService: ICategoriesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle catégorie' })
  @ApiResponse({
    status: 201,
    description: 'La catégorie a été créée avec succès.',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les catégories' })
  @ApiResponse({
    status: 200,
    description: 'Liste des catégories récupérée avec succès.',
    type: [Category],
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Récupérer une catégorie par son UUID' })
  @ApiResponse({
    status: 200,
    description: 'La catégorie a été trouvée.',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  findOne(@Param('uuid') uuid: string) {
    return this.categoriesService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Mettre à jour une catégorie' })
  @ApiResponse({
    status: 200,
    description: 'La catégorie a été mise à jour avec succès.',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.update(
      uuid,
      updateCategoryDto,
    );
    if (!category) {
      throw new NotFoundException(`Category with UUID "${uuid}" not found`);
    }
    return category;
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Supprimer une catégorie' })
  @ApiResponse({
    status: 200,
    description: 'La catégorie a été supprimée avec succès.',
  })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  remove(@Param('uuid') uuid: string) {
    return this.categoriesService.remove(uuid);
  }
}
