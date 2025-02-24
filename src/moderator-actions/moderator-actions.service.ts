import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModeratorActionDto } from './dto/create-moderator-action.dto';
import { ModeratorAction } from './entities/moderator-action.entity';
import { Report } from '../reports/entities/report.entity';
import { Member } from '../members/entities/member.entity';
import { ActionType } from './entities/moderator-action.entity';

@Injectable()
export class ModeratorActionsService {
  constructor(
    @InjectRepository(ModeratorAction)
    private readonly moderatorActionRepository: Repository<ModeratorAction>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>
  ) {}

  /**
   * Crée une nouvelle action de modération
   * @throws BadRequestException si la création échoue
   * @throws ForbiddenException si l'utilisateur n'est pas modérateur
   */
  async create(createDto: CreateModeratorActionDto): Promise<ModeratorAction> {
    // Vérifier que le membre existe et est modérateur
    const member = await this.memberRepository.findOne({
      where: { uuidMember: createDto.uuidMember }
    });

    if (!member) {
      throw new NotFoundException(`Member with UUID ${createDto.uuidMember} not found`);
    }

    // Vérifier que le membre est modérateur
    if (member.communityRole !== 'Moderator') {
      throw new ForbiddenException('Only moderators can create moderation actions');
    }

    // Vérifier que le signalement existe
    const report = await this.reportRepository.findOne({
      where: { uuidReport: createDto.uuidReport }
    });

    if (!report) {
      throw new NotFoundException(`Report with UUID ${createDto.uuidReport} not found`);
    }

    try {
      // Convertir le type d'action du DTO vers le type de l'entité
      let actionType: ActionType;
      switch (createDto.type) {
        case 'warn':
          actionType = ActionType.WARNING;
          break;
        case 'ban':
          actionType = ActionType.BAN;
          break;
        default:
          throw new BadRequestException('Type d\'action non valide');
      }

      const moderatorAction = this.moderatorActionRepository.create({
        actionType,
        actionReason: createDto.reason,
        moderator: member,
        moderatorUuid: member.uuidMember,
        report,
        reportUuid: report.uuidReport
      });

      const savedAction = await this.moderatorActionRepository.save(moderatorAction);

      // Mettre à jour le statut du signalement
      report.status = 'resolved';
      await this.reportRepository.save(report);

      return savedAction;
    } catch (error) {
      throw new BadRequestException(
        'Impossible de créer l\'action de modération: ' + error.message,
      );
    }
  }

  /**
   * Récupère toutes les actions de modération
   * @returns Liste des actions triées par date de création
   */
  async findAll(): Promise<ModeratorAction[]> {
    try {
      return await this.moderatorActionRepository.find({
        relations: ['moderator', 'report'],
        order: {
          actionCreatedAt: 'DESC',
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Erreur lors de la récupération des actions de modération',
      );
    }
  }

  /**
   * Récupère une action de modération spécifique
   * @throws NotFoundException si l'action n'existe pas
   */
  async findOne(uuid: string): Promise<ModeratorAction> {
    try {
      const action = await this.moderatorActionRepository.findOne({
        where: { uuidModeration: uuid },
        relations: ['moderator', 'report']
      });

      if (!action) {
        throw new NotFoundException(
          `Action de modération avec l'UUID ${uuid} non trouvée`,
        );
      }

      return action;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Erreur lors de la récupération de l'action de modération: ${error.message}`,
      );
    }
  }

  async findByReport(reportUuid: string): Promise<ModeratorAction[]> {
    try {
      return await this.moderatorActionRepository.find({
        where: { reportUuid },
        relations: ['moderator', 'report'],
        order: {
          actionCreatedAt: 'DESC'
        }
      });
    } catch (error) {
      throw new BadRequestException(
        `Erreur lors de la récupération des actions de modération pour le report: ${error.message}`,
      );
    }
  }

  /**
   * Supprime une action de modération
   * @throws NotFoundException si l'action n'existe pas
   */
  async remove(uuid: string): Promise<void> {
    throw new BadRequestException('Les actions de modération ne peuvent pas être supprimées');
  }
}
