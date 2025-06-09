import { Controller, Get, Query, Res, UnauthorizedException, Logger, Post, Body, HttpCode } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiQuery, ApiResponse, ApiProperty, ApiBody } from '@nestjs/swagger';
import { DiscordGuildMember } from './interfaces/discord-user.interface';
// Import du décorateur pour les routes publiques
import { Public } from './decorators/public.decorator';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// DTO pour l'authentification du bot
class BotAuthDto {
  @ApiProperty({
    description: 'Token du bot Discord (avec ou sans préfixe "Bot ")',
    example: 'Bot YOUR_BOT_TOKEN'
  })
  @IsString()
  @IsNotEmpty()
  botToken: string;

  @ApiProperty({
    description: 'ID du bot Discord (optionnel, pour vérification)',
    example: '1234567890123456789',
    required: false
  })
  @IsOptional()
  @IsString()
  botId?: string;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  // ROUTE PUBLIQUE : Page de connexion Discord OAuth2
  // Cette route DOIT être publique car c'est le point d'entrée d'authentification
  @Public()
  @ApiOperation({ 
    summary: 'Connexion via Discord OAuth2',
    description: 'Redirige l\'utilisateur vers la page d\'authentification Discord OAuth2'
  })
  @ApiResponse({ 
    status: 302, 
    description: 'Redirection vers Discord OAuth2'
  })
  @Get('login')
  login(@Res() res: FastifyReply): void {
    const clientId = this.configService.get<string>('DISCORD_CLIENT_ID') || '';
    const redirectUri = encodeURIComponent(this.configService.get<string>('DISCORD_REDIRECT_URI') || '');
    const scope = encodeURIComponent('identify email guilds guilds.members.read');
    
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
    this.logger.log(`Redirection vers Discord: ${discordAuthUrl}`);
    this.logger.log(`URL de redirection non encodée: ${this.configService.get<string>('DISCORD_REDIRECT_URI')}`);
    
    // Utiliser la méthode de redirection de Fastify
    res.status(302).header('Location', discordAuthUrl).send();
  }

  // ROUTE PUBLIQUE : Alias pour la connexion Discord
  // Cette route est aussi publique car c'est un autre point d'entrée d'auth
  @Public()
  @ApiOperation({ 
    summary: 'Redirection vers Discord OAuth2',
    description: 'Alias pour la route login'
  })
  @ApiResponse({ 
    status: 302, 
    description: 'Redirection vers Discord OAuth2'
  })
  @Get('discord')
  discordLogin(@Res() res: FastifyReply): void {
    return this.login(res);
  }

  // ROUTE PUBLIQUE : Callback Discord OAuth2
  // OBLIGATOIREMENT publique car Discord appelle cette URL après authentification
  // Si elle était protégée, Discord ne pourrait pas y accéder
  @Public()
  @ApiOperation({ 
    summary: 'Callback OAuth2 Discord',
    description: 'Endpoint appelé par Discord après authentification réussie'
  })
  @ApiQuery({ 
    name: 'code', 
    required: true, 
    description: 'Code d\'autorisation fourni par Discord'
  })
  @ApiResponse({ 
    status: 302, 
    description: 'Redirection vers le frontend avec le JWT token'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Non autorisé - code manquant ou utilisateur non membre du serveur autorisé'
  })
  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: FastifyReply): Promise<void> {
    this.logger.log(`Callback reçu avec code: ${code}`);
    
    if (!code) {
      this.logger.error('Code d\'autorisation non fourni');
      throw new UnauthorizedException('Code d\'autorisation non fourni');
    }

    try {
      // Échanger le code contre un token d'accès
      this.logger.log('Échange du code contre un token d\'accès...');
      const accessToken = await this.authService.exchangeCodeForToken(code);
      
      // Récupérer les informations de l'utilisateur
      this.logger.log('Récupération des informations utilisateur...');
      const user = await this.authService.getUserInfo(accessToken);
      
      // Valider l'appartenance au serveur et récupérer les rôles
      this.logger.log(`Validation de l'appartenance au serveur pour l'utilisateur ${user.id}...`);
      const { isValid, roles, guildMember } = await this.authService.validateUserGuild(accessToken, user.id);
      
      if (!isValid) {
        this.logger.warn(`L'utilisateur ${user.id} n'est pas membre du serveur autorisé`);
        throw new UnauthorizedException('L\'utilisateur n\'est pas membre du serveur autorisé');
      }
      
      // Générer un JWT
      this.logger.log('Génération du JWT...');
      const jwt = this.authService.generateJwtToken(user, roles);
      
      // Rediriger vers la page de callback avec le token
      const redirectUrl = `/auth-callback-page?token=${jwt}`;
      this.logger.log(`Redirection vers: ${redirectUrl}`);
      
      // Utiliser la méthode de redirection de Fastify
      res.status(302).header('Location', redirectUrl).send();
    } catch (error) {
      this.logger.error(`Erreur lors du traitement du callback: ${error.message}`, error.stack);
      const redirectUrl = `/auth-callback-page?message=${encodeURIComponent(error.message)}`;
      this.logger.log(`Redirection vers page d'erreur: ${redirectUrl}`);
      
      // Utiliser la méthode de redirection de Fastify
      res.status(302).header('Location', redirectUrl).send();
    }
  }

  // ROUTE PUBLIQUE : Informations utilisateur après OAuth
  // Cette route est appelée avec un code Discord temporaire
  // Elle doit être publique car c'est part du processus d'authentification
  @Public()
  @ApiOperation({ 
    summary: 'Informations utilisateur',
    description: 'Récupère les informations de l\'utilisateur authentifié'
  })
  @ApiQuery({ 
    name: 'code', 
    required: true, 
    description: 'Code d\'autorisation fourni par Discord'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Informations utilisateur récupérées avec succès'
  })
  @Get('user-info')
  async getUserInfo(@Query('code') code: string, @Res() res: FastifyReply): Promise<void> {
    if (!code) {
      res.status(400).send({
        message: 'Code d\'autorisation non fourni',
        status: 400
      });
      return;
    }

    try {
      // Échanger le code contre un token d'accès
      const accessToken = await this.authService.exchangeCodeForToken(code);
      
      // Récupérer les informations de l'utilisateur
      const user = await this.authService.getUserInfo(accessToken);
      
      // Récupérer les serveurs de l'utilisateur
      const guilds = await this.authService.getUserGuilds(accessToken);
      
      // Vérifier l'appartenance au serveur autorisé
      const allowedGuildId = this.configService.get<string>('ALLOWED_GUILD_ID') || '';
      const isInAllowedGuild = guilds.some(guild => guild.id === allowedGuildId);
      
      let guildMember: DiscordGuildMember | null = null;
      let roles: string[] = [];
      
      if (isInAllowedGuild) {
        try {
          // Récupérer les informations du membre dans le serveur autorisé
          guildMember = await this.authService.getGuildMember(user.id);
          roles = guildMember.roles;
        } catch (error) {
          this.logger.error(`Erreur lors de la récupération des informations du membre: ${error.message}`);
        }
      }
      
      // Générer un JWT si l'utilisateur est membre du serveur autorisé
      const jwt = isInAllowedGuild 
        ? this.authService.generateJwtToken(user, roles)
        : null;
      
      res.status(200).send({
        user: {
          id: user.id,
          username: user.username,
          discriminator: user.discriminator,
          avatar: user.avatar,
          email: user.email
        },
        guilds: guilds.map(guild => ({
          id: guild.id,
          name: guild.name,
          icon: guild.icon,
          isOwner: guild.owner
        })),
        allowedGuild: {
          isMember: isInAllowedGuild,
          roles: roles,
          nickname: guildMember?.nick || null
        },
        token: jwt,
        status: 200
      });
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des informations utilisateur: ${error.message}`, error.stack);
      res.status(500).send({
        message: `Erreur: ${error.message}`,
        status: 500
      });
    }
  }

  // ROUTE PUBLIQUE : Authentification pour les bots Discord.js
  // Permet aux bots de s'authentifier avec leur token et recevoir un JWT
  @Public()
  @HttpCode(200)
  @ApiOperation({ 
    summary: 'Authentification pour bots Discord',
    description: 'Permet aux bots Discord.js de s\'authentifier et recevoir un JWT pour l\'API'
  })
  @ApiBody({
    type: BotAuthDto,
    description: 'Token du bot Discord à valider'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'JWT généré avec succès pour le bot'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token bot invalide ou bot non autorisé'
  })
  @Post('bot-login')
  async botLogin(@Body() authData: BotAuthDto): Promise<any> {
    this.logger.log('Tentative d\'authentification du bot...');
    
    if (!authData.botToken) {
      this.logger.error('Token bot non fourni');
      throw new UnauthorizedException('Token bot requis');
    }

    try {
      // Valider le bot token et récupérer les informations du bot
      const botInfo = await this.authService.validateBotToken(authData.botToken);
      
      // Générer un JWT pour le bot avec des permissions spéciales
      const jwt = this.authService.generateBotJwtToken(botInfo);
      
      this.logger.log(`Bot ${botInfo.username} authentifié avec succès`);
      
      return {
        message: 'Bot authentifié avec succès',
        data: {
          token: jwt,
          botInfo: {
            id: botInfo.id,
            username: botInfo.username,
            discriminator: botInfo.discriminator || '0000',
            avatar: botInfo.avatar
          },
          tokenType: 'Bearer',
          expiresIn: '24h'
        },
        statusCode: 200
      };
    } catch (error) {
      this.logger.error(`Erreur lors de l'authentification du bot: ${error.message}`, error.stack);
      throw new UnauthorizedException(`Authentification du bot échouée: ${error.message}`);
    }
  }
} 