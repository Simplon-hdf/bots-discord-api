import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';
import { DiscordUserId } from './common/decorators/discord-user.decorator';
import { SeedService } from './common/services/seed.service';

@ApiTags('Application')
@Controller()
export class AppController {
  
  constructor(private readonly seedService: SeedService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Point d\'entrée de l\'API' })
  @ApiResponse({ status: 200, description: 'API opérationnelle' })
  getRoot() {
    return {
      message: '🚀 API Discord Bots opérationnelle',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/health',
        auth: '/auth',
        channels: '/channels',
        guilds: '/guilds',
        categories: '/categories',
        test: '/test'
      }
    };
  }

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Vérification de santé de l\'API' })
  @ApiResponse({ status: 200, description: 'API en bonne santé' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    };
  }

  @Public()
  @Get('test/rate-limit')
  @ApiOperation({ summary: 'Test du rate limiting par utilisateur Discord' })
  @ApiHeader({ name: 'X-Discord-User-ID', description: 'ID de l\'utilisateur Discord pour le test', required: false })
  @ApiResponse({ status: 200, description: 'Test réussi - rate limiting fonctionnel' })
  testRateLimit(@DiscordUserId() discordUserId?: string, @Headers('x-discord-user-id') headerUserId?: string) {
    return {
      message: '✅ Test du rate limiting',
      discordUserId: discordUserId || 'Non fourni',
      headerUserId: headerUserId || 'Non fourni',
      rateLimitingKey: discordUserId ? `discord-user:${discordUserId}` : 'fallback-ip',
      timestamp: new Date().toISOString(),
      tip: 'Envoyez plusieurs requêtes rapidement avec le même X-Discord-User-ID pour tester le rate limiting'
    };
  }

  @Post('test/seed')
  @ApiOperation({ summary: 'Force le seeding des données de base' })
  @ApiResponse({ status: 200, description: 'Seeding exécuté avec succès' })
  async forceSeed() {
    await this.seedService.forceSeed();
    return {
      message: '✅ Seeding forcé exécuté avec succès',
      timestamp: new Date().toISOString()
    };
  }

  @Public()
  @Get('test/headers')
  @ApiOperation({ summary: 'Test des headers reçus' })
  @ApiResponse({ status: 200, description: 'Headers affichés' })
  testHeaders(@Headers() headers: Record<string, string>) {
    return {
      message: '📋 Headers reçus',
      headers: {
        authorization: headers.authorization ? `${headers.authorization.substring(0, 20)}...` : 'Non fourni',
        'x-discord-user-id': headers['x-discord-user-id'] || 'Non fourni',
        'content-type': headers['content-type'] || 'Non fourni',
        'user-agent': headers['user-agent'] || 'Non fourni'
      },
      timestamp: new Date().toISOString()
    };
  }

  @Get('test/auth-required')
  @ApiOperation({ summary: 'Test d\'une route protégée (JWT requis)' })
  @ApiResponse({ status: 200, description: 'Accès autorisé avec JWT valide' })
  @ApiResponse({ status: 401, description: 'JWT manquant ou invalide' })
  testAuthRequired(@DiscordUserId() discordUserId?: string) {
    return {
      message: '🔒 Route protégée - JWT valide',
      discordUserId: discordUserId || 'Non extrait du JWT',
      timestamp: new Date().toISOString(),
      tip: 'Cette route nécessite un JWT valide dans le header Authorization'
    };
  }

  @Public()
  @Post('test/simulate-bot-request')
  @ApiOperation({ summary: 'Simule une requête du bot Discord avec un utilisateur' })
  @ApiResponse({ status: 200, description: 'Simulation réussie' })
  simulateBotRequest(@Body() body: { discordUserId: string; action: string }) {
    return {
      message: '🤖 Simulation d\'une requête du bot Discord',
      receivedUserId: body.discordUserId,
      action: body.action,
      rateLimitingWouldUse: `discord-user:${body.discordUserId}`,
      timestamp: new Date().toISOString(),
      note: 'Dans une vraie requête, cet ID serait dans le header X-Discord-User-ID'
    };
  }
} 