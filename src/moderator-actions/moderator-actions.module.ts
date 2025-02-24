import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeratorActionsService } from './moderator-actions.service';
import { ModeratorActionsController } from './moderator-actions.controller';
import { ModeratorAction } from './entities/moderator-action.entity';
import { Report } from '../reports/entities/report.entity';
import { Member } from '../members/entities/member.entity';

/**
 * Module de gestion des actions de modération
 * 
 * Ce module encapsule toute la logique liée aux actions des modérateurs,
 * y compris le CRUD des actions et leur persistance en base de données.
 */
@Module({
  imports: [
    // Configuration de TypeORM pour l'entité ModeratorAction
    TypeOrmModule.forFeature([
      ModeratorAction,
      Report,
      Member
    ])
  ],
  // Déclaration du controller pour gérer les requêtes HTTP
  controllers: [ModeratorActionsController],
  // Déclaration du service pour la logique métier
  providers: [ModeratorActionsService],
  // Export du service pour utilisation dans d'autres modules si nécessaire
  exports: [ModeratorActionsService],
})
export class ModeratorActionsModule {}
