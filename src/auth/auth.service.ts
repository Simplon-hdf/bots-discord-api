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
      
      this.logger.log(`Paramètres de la requête: ${params.toString()}`);
      this.logger.log(`URL de la requête: ${this.discordApiUrl}/oauth2/token`);
      
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

      this.logger.log(`Réponse reçue du serveur Discord: ${JSON.stringify(tokenResponse.data)}`);
      return tokenResponse.data.access_token;
    } catch (error) {
      this.logger.error(`Erreur lors de l'échange du code contre un token: ${error.message}`, error.stack);
      if (error.response) {
        this.logger.error(`Réponse d'erreur: ${JSON.stringify(error.response.data)}`);
      }
      throw new BadRequestException('Failed to exchange code for token');
    }
  }

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
      throw new UnauthorizedException('Failed to get user information');
    }
  }

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
      throw new UnauthorizedException('Failed to get user guilds');
    }
  }

  async getGuildMember(accessToken: string, guildId: string, userId: string): Promise<DiscordGuildMember> {
    try {
      if (!this.botToken) {
        throw new Error('DISCORD_BOT_TOKEN is not defined in environment variables');
      }
      
      const memberResponse = await firstValueFrom(
        this.httpService.get(`${this.discordApiUrl}/guilds/${guildId}/members/${userId}`, {
          headers: {
            Authorization: `Bot ${this.botToken}`,
          },
        }),
      );

      return memberResponse.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new UnauthorizedException('User is not a member of the specified guild');
      }
      throw new UnauthorizedException('Failed to get guild member information');
    }
  }

  async validateUserGuild(accessToken: string, userId: string): Promise<{ isValid: boolean; roles: string[] }> {
    const guilds = await this.getUserGuilds(accessToken);
    
    // Vérifier si l'utilisateur appartient à la guilde autorisée
    const isInGuild = guilds.some(guild => guild.id === this.allowedGuildId);
    
    if (!isInGuild) {
      return { isValid: false, roles: [] };
    }
    
    // Récupérer les rôles de l'utilisateur dans la guilde
    const guildMember = await this.getGuildMember(accessToken, this.allowedGuildId, userId);
    
    return { 
      isValid: true, 
      roles: guildMember.roles 
    };
  }

  generateJwtToken(user: DiscordUser, roles: string[]): string {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      roles,
      guildId: this.allowedGuildId,
    };

    return this.jwtService.sign(payload);
  }

  hasRole(userRoles: string[], requiredRole: string): boolean {
    return userRoles.includes(requiredRole);
  }
} 