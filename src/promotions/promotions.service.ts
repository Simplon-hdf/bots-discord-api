import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';
import { IPromotionsService } from './interfaces/promotion.interface';
import { Role } from '../roles/entities/role.entity';
import { Member } from '../members/entities/member.entity';

@Injectable()
export class PromotionsService implements IPromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
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
        color: '#000000',
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
      throw new BadRequestException(
        'Erreur lors de la création de la promotion: ' + error.message,
      );
    }
  }

  async findAll(): Promise<Promotion[]> {
    return await this.promotionRepository.find({
      relations: [
        'followers',
        'managers',
        'category',
        'course',
        'campus',
        'role',
        'guild',
      ],
    });
  }

  async findOne(uuid: string): Promise<Promotion> {
    const promotion = await this.promotionRepository.findOne({
      where: { uuid },
      relations: [
        'followers',
        'managers',
        'category',
        'course',
        'campus',
        'role',
        'guild',
      ],
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion avec UUID ${uuid} non trouvée`);
    }
    return promotion;
  }

  async update(
    uuid: string,
    updatePromotionDto: UpdatePromotionDto,
  ): Promise<Promotion> {
    const promotion = await this.findOne(uuid);

    // Mise à jour des champs autorisés
    const { name, startDate, endDate } = updatePromotionDto;
    if (name !== undefined) promotion.name = name;
    if (startDate !== undefined) promotion.startDate = startDate;
    if (endDate !== undefined) promotion.endDate = endDate;

    promotion.updatedAt = new Date();
    return await this.promotionRepository.save(promotion);
  }

  async remove(uuid: string) {
    const promotion = await this.findOne(uuid);
    return await this.promotionRepository.remove(promotion);
  }

  async addFollower(
    uuidPromotion: string,
    uuidMember: string,
  ): Promise<Promotion> {
    const promotion = await this.promotionRepository.findOne({
      where: { uuid: uuidPromotion },
      relations: ['followers'],
    });

    if (!promotion) {
      throw new NotFoundException(
        `Promotion avec UUID ${uuidPromotion} non trouvée`,
      );
    }

    const member = await this.memberRepository.findOneBy({ uuidMember });
    if (!member) {
      throw new NotFoundException(`Membre avec UUID ${uuidMember} non trouvé`);
    }

    // Vérifier si le membre est déjà follower
    if (
      promotion.followers &&
      promotion.followers.some((follower) => follower.uuidMember === uuidMember)
    ) {
      throw new BadRequestException(
        `Le membre est déjà follower de cette promotion`,
      );
    }

    // Initialiser le tableau des followers s'il n'existe pas
    if (!promotion.followers) {
      promotion.followers = [];
    }

    // Ajouter le membre aux followers
    promotion.followers.push(member);

    // Sauvegarder la promotion mise à jour
    return await this.promotionRepository.save(promotion);
  }

  async addManager(
    uuidPromotion: string,
    uuidMember: string,
  ): Promise<Promotion> {
    const promotion = await this.promotionRepository.findOne({
      where: { uuid: uuidPromotion },
      relations: ['managers'],
    });

    if (!promotion) {
      throw new NotFoundException(
        `Promotion avec UUID ${uuidPromotion} non trouvée`,
      );
    }

    const member = await this.memberRepository.findOneBy({ uuidMember });
    if (!member) {
      throw new NotFoundException(`Membre avec UUID ${uuidMember} non trouvé`);
    }

    // Vérifier si le membre est déjà manager
    if (
      promotion.managers &&
      promotion.managers.some((manager) => manager.uuidMember === uuidMember)
    ) {
      throw new BadRequestException(
        `Le membre est déjà manager de cette promotion`,
      );
    }

    // Initialiser le tableau des managers s'il n'existe pas
    if (!promotion.managers) {
      promotion.managers = [];
    }

    // Ajouter le membre aux managers
    promotion.managers.push(member);

    // Sauvegarder la promotion mise à jour
    return await this.promotionRepository.save(promotion);
  }
}
