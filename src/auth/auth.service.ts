import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { DiscordUser, DiscordGuild, DiscordGuildMember } from './interfaces/discord-user.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly discordApiUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly allowedGuildId: string;
  private readonly botToken: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.discordApiUrl = this.configService.get<string>('DISCORD_API_ENDPOINT', 'https://discord.com/api/v10');
    this.clientId = this.configService.get<string>('DISCORD_CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('DISCORD_CLIENT_SECRET') || '';
    this.redirectUri = this.configService.get<string>('DISCORD_REDIRECT_URI') || '';
    this.allowedGuildId = this.configService.get<string>('ALLOWED_GUILD_ID') || '';
    this.botToken = this.configService.get<string>('DISCORD_BOT_TOKEN') || '';
    
    this.logger.log(`Configuration initialisée:`);
    this.logger.log(`Discord API URL: ${this.discordApiUrl}`);
    this.logger.log(`Client ID: ${this.clientId}`);
    this.logger.log(`Redirect URI: ${this.redirectUri}`);
    this.logger.log(`Allowed Guild ID: ${this.allowedGuildId}`);
    this.logger.log(`Bot Token configuré: ${this.botToken ? 'Oui' : 'Non'}`);
  }

  /**
   * Échange un code d'autorisation contre un token d'accès Discord
   */
  async exchangeCodeForToken(code: string): Promise<string> {
    try {
      this.logger.log(`Échange du code contre un token pour le code: ${code}`);
      
      const params = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
      });
      
      this.logger.debug(`Paramètres de la requête: ${params.toString()}`);
      
      const tokenResponse = await firstValueFrom(
        this.httpService.post(
          `${this.discordApiUrl}/oauth2/token`,
          params,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      this.logger.debug(`Réponse reçue du serveur Discord: ${JSON.stringify(tokenResponse.data)}`);
      return tokenResponse.data.access_token;
    } catch (error) {
      this.logger.error(`Erreur lors de l'échange du code contre un token: ${error.message}`, error.stack);
      if (error.response) {
        this.logger.error(`Réponse d'erreur: ${JSON.stringify(error.response.data)}`);
        this.logger.error(`Status code: ${error.response.status}`);
      }
      throw new BadRequestException(`Échec de l'échange du code: ${error.message}`);
    }
  }

  /**
   * Récupère les informations de l'utilisateur Discord
   */
  async getUserInfo(accessToken: string): Promise<DiscordUser> {
    try {
      const userResponse = await firstValueFrom(
        this.httpService.get(`${this.discordApiUrl}/users/@me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return userResponse.data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des informations utilisateur: ${error.message}`);
      throw new UnauthorizedException('Impossible de récupérer les informations utilisateur');
    }
  }

  /**
   * Récupère la liste des serveurs de l'utilisateur
   */
  async getUserGuilds(accessToken: string): Promise<DiscordGuild[]> {
    try {
      const guildsResponse = await firstValueFrom(
        this.httpService.get(`${this.discordApiUrl}/users/@me/guilds`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return guildsResponse.data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des serveurs: ${error.message}`);
      throw new UnauthorizedException('Impossible de récupérer les serveurs de l\'utilisateur');
    }
  }

  /**
   * Récupère les informations du membre dans un serveur spécifique
   * Utilise le token d'accès de l'utilisateur avec le scope guilds.members.read
   */
  async getGuildMember(userId: string, accessToken?: string, guildId: string = this.allowedGuildId): Promise<DiscordGuildMember> {
    try {
      // Si un token d'accès est fourni, essayer d'abord avec celui-ci (OAuth2)
      if (accessToken) {
        try {
          this.logger.log(`Tentative de récupération des informations du membre avec le token d'accès OAuth2`);
          const memberResponse = await firstValueFrom(
            this.httpService.get(`${this.discordApiUrl}/users/@me/guilds/${guildId}/member`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }),
          );
          return memberResponse.data;
        } catch (error) {
          this.logger.warn(`Échec de la récupération avec OAuth2: ${error.message}. Tentative avec le token de bot...`);
          // Si ça échoue, on continue avec le token de bot
        }
      }
      
      // Utiliser le token de bot comme fallback
      if (!this.botToken) {
        throw new Error('DISCORD_BOT_TOKEN n\'est pas défini dans les variables d\'environnement');
      }
      
      this.logger.log(`Récupération des informations du membre avec le token de bot`);
      const memberResponse = await firstValueFrom(
        this.httpService.get(`${this.discordApiUrl}/guilds/${guildId}/members/${userId}`, {
          headers: {
            Authorization: `Bot ${this.botToken}`,
          },
        }),
      );

      return memberResponse.data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des informations du membre: ${error.message}`);
      if (error.response?.status === 404) {
        throw new UnauthorizedException('L\'utilisateur n\'est pas membre du serveur spécifié');
      }
      throw new UnauthorizedException('Impossible de récupérer les informations du membre');
    }
  }

  /**
   * Vérifie si l'utilisateur est membre du serveur autorisé et récupère ses rôles
   */
  async validateUserGuild(accessToken: string, userId: string): Promise<{ isValid: boolean; roles: string[]; guildMember: DiscordGuildMember | null }> {
    // Récupérer la liste des serveurs de l'utilisateur
    const guilds = await this.getUserGuilds(accessToken);
    
    // Vérifier si l'utilisateur appartient au serveur autorisé
    const isInGuild = guilds.some(guild => guild.id === this.allowedGuildId);
    
    if (!isInGuild) {
      return { isValid: false, roles: [], guildMember: null };
    }
    
    try {
      // Récupérer les rôles de l'utilisateur dans le serveur en utilisant le token d'accès
      const guildMember = await this.getGuildMember(userId, accessToken);
      
      return { 
        isValid: true, 
        roles: guildMember.roles,
        guildMember: guildMember
      };
    } catch (error) {
      this.logger.error(`Erreur lors de la validation du serveur: ${error.message}`);
      // Si on ne peut pas récupérer les informations du membre mais qu'il est dans le serveur
      return { 
        isValid: true, 
        roles: [],
        guildMember: null
      };
    }
  }

  /**
   * Génère un token JWT contenant les informations de l'utilisateur
   */
  generateJwtToken(user: DiscordUser, roles: string[]): string {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      roles,
      guildId: this.allowedGuildId,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Vérifie si l'utilisateur possède un rôle spécifique
   */
  hasRole(userRoles: string[], requiredRole: string): boolean {
    return userRoles.includes(requiredRole);
  }
} 