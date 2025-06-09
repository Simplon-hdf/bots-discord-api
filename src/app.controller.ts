import { Controller, Get, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { FastifyReply } from 'fastify';

import { Public } from './auth/decorators/public.decorator';
import { DiscordUserId } from './common/decorators/discord-user.decorator';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @Get('test-rate-limit')
  testRateLimit(@DiscordUserId() discordUserId?: string): any {
    return {
      message: 'Test du rate limiting par utilisateur Discord',
      timestamp: new Date().toISOString(),
      discordUserId: discordUserId || 'non-identifié',
      success: true
    };
  }

  // ROUTE PUBLIQUE : Page de test d'authentification
  // Cette page permet aux utilisateurs de tester leur token JWT
  // Elle doit être publique pour être accessible même sans token
  @Public()
  @Get('test-auth')
  serveAuthTestPage(@Res() res: FastifyReply): void {
    // Essayer plusieurs chemins possibles
    const paths = [
      join(__dirname, '..', 'public', 'auth-test.html'),
      join(__dirname, '..', '..', 'public', 'auth-test.html'),
      join(process.cwd(), 'public', 'auth-test.html')
    ];
    
    this.logger.log(`Tentative de trouver le fichier auth-test.html...`);
    
    for (const filePath of paths) {
      this.logger.log(`Vérification du chemin: ${filePath}`);
      if (fs.existsSync(filePath)) {
        this.logger.log(`Fichier trouvé à: ${filePath}`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        res.type('text/html').send(fileContent);
        return;
      }
    }
    
    this.logger.error(`Fichier auth-test.html non trouvé dans les chemins testés`);
    res.status(404).send({
      message: 'Fichier non trouvé',
      paths: paths
    });
  }

  // ROUTE PUBLIQUE : Page de callback après authentification
  // Cette page affiche le résultat de l'authentification Discord
  // Elle doit être publique car elle reçoit les utilisateurs qui viennent de s'authentifier
  @Public()
  @Get('auth-callback-page')
  serveAuthCallbackPage(@Res() res: FastifyReply): void {
    // Essayer plusieurs chemins possibles
    const paths = [
      join(__dirname, '..', 'public', 'auth-callback.html'),
      join(__dirname, '..', '..', 'public', 'auth-callback.html'),
      join(process.cwd(), 'public', 'auth-callback.html')
    ];
    
    this.logger.log(`Tentative de trouver le fichier auth-callback.html...`);
    
    for (const filePath of paths) {
      this.logger.log(`Vérification du chemin: ${filePath}`);
      if (fs.existsSync(filePath)) {
        this.logger.log(`Fichier trouvé à: ${filePath}`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        res.type('text/html').send(fileContent);
        return;
      }
    }
    
    this.logger.error(`Fichier auth-callback.html non trouvé dans les chemins testés`);
    res.status(404).send({
      message: 'Fichier non trouvé',
      paths: paths
    });
  }

  // ROUTE PROTÉGÉE : Exemple de route sécurisée
  // Cette route N'A PAS @Public() donc elle est automatiquement protégée
  // Un token JWT valide est OBLIGATOIRE pour y accéder
  @Get('protected-example')
  getProtectedData(): any {
    return {
      message: 'Félicitations ! Vous êtes authentifié !',
      timestamp: new Date().toISOString(),
      info: 'Cette route est automatiquement protégée par le guard global',
      security: {
        protected: true,
        requiresJWT: true,
        accessLevel: 'Utilisateur authentifié uniquement'
      }
    };
  }

  // ROUTE PUBLIQUE : Health check pour le monitoring
  // Cette route permet de vérifier que l'API fonctionne
  // Elle doit être publique pour les outils de monitoring externes
  @Public()
  @Get('health')
  getHealthCheck(): any {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Discord Bot API',
      version: '1.0.0'
    };
  }

  // ROUTE PUBLIQUE : Information sur l'API
  // Informations générales publiques sur l'API
  @Public()
  @Get('info')
  getApiInfo(): any {
    return {
      name: 'Discord Bot API',
      description: 'API pour la gestion du bot Discord',
      version: '1.0.0',
      documentation: '/api',
      authentication: 'JWT Bearer Token required (except for public routes)'
    };
  }
} 