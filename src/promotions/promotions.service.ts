import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    try {
      // Création du rôle associé à la promotion
      const newRole = this.roleRepository.create({
        uuidRole: createPromotionDto.uuidRole, // UUID fourni par le DTO
        uuidGuild: createPromotionDto.uuidGuild, // Lié à la guilde
        name: createPromotionDto.name, // Même nom que la promotion
        memberCount: 0,
        rolePosition: 0,
        hoist: false,
        color: "#000000",
      });

      // Sauvegarde du rôle
      const savedRole = await this.roleRepository.save(newRole);

      // Création de la promotion avec le rôle associé
      const newPromotion = this.promotionRepository.create({
        ...createPromotionDto,
        uuidRole: savedRole.uuidRole, // Associe le rôle créé à la promotion
      });

      return await this.promotionRepository.save(newPromotion);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la création de la promotion: ' + error.message);
    }
  }

  async findAll(): Promise<Promotion[]> {
    return await this.promotionRepository.find();
  }

  async findOne(uuid: string): Promise<Promotion> {
    const promotion = await this.promotionRepository.findOneBy({ uuid });
    if (!promotion) {
      throw new NotFoundException(`Promotion avec UUID ${uuid} non trouvée`);
    }
    return promotion;
  }

  async update(uuid: string, updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    const promotion = await this.findOne(uuid);

    // Mise à jour des champs autorisés
    const { name, startDate, endDate } = updatePromotionDto;
    if (name !== undefined) promotion.name = name;
    if (startDate !== undefined) promotion.startDate = startDate;
    if (endDate !== undefined) promotion.endDate = endDate;
    
    promotion.updatedAt = new Date();
    return await this.promotionRepository.save(promotion);
  }

  async remove(uuid: string): Promise<void> {
    const result = await this.promotionRepository.delete({ uuid });
    if (result.affected === 0) {
      throw new NotFoundException(`Promotion avec UUID ${uuid} non trouvée`);
    }
  }
}
