import { Controller, Get, Query, Res, UnauthorizedException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @ApiOperation({ 
    summary: 'Test de redirection',
    description: 'Endpoint de test pour vérifier si la redirection fonctionne'
  })
  @ApiResponse({ 
    status: 302, 
    description: 'Redirection vers Google'
  })
  @Get('test-redirect')
  testRedirect(@Res() res: Response): void {
    this.logger.log('Test de redirection vers Google');
    res.redirect('https://www.google.com');
  }

  @ApiOperation({ 
    summary: 'Redirection vers Discord pour authentification',
    description: 'Redirige l\'utilisateur vers la page d\'authentification Discord OAuth2'
  })
  @ApiResponse({ 
    status: 302, 
    description: 'Redirection vers Discord OAuth2'
  })
  @Get('login')
  login(@Res() res: Response): void {
    const clientId = this.configService.get<string>('DISCORD_CLIENT_ID') || '';
    const redirectUri = encodeURIComponent(this.configService.get<string>('DISCORD_REDIRECT_URI') || '');
    const scope = encodeURIComponent('identify email guilds');
    
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
    this.logger.log(`Redirection vers Discord: ${discordAuthUrl}`);
    res.redirect(discordAuthUrl);
  }

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
    description: 'Redirection vers le frontend avec le JWT token ou message d\'erreur'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Non autorisé - code manquant ou utilisateur non membre de la guilde autorisée'
  })
  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response): Promise<void> {
    this.logger.log(`Callback reçu avec code: ${code}`);
    
    if (!code) {
      this.logger.error('Code d\'autorisation non fourni');
      throw new UnauthorizedException('Authorization code not provided');
    }

    try {
      // Échanger le code contre un token d'accès
      this.logger.log('Échange du code contre un token d\'accès...');
      const accessToken = await this.authService.exchangeCodeForToken(code);
      
      // Récupérer les informations de l'utilisateur
      this.logger.log('Récupération des informations utilisateur...');
      const user = await this.authService.getUserInfo(accessToken);
      
      // Valider l'appartenance à la guilde et récupérer les rôles
      this.logger.log(`Validation de l'appartenance à la guilde pour l'utilisateur ${user.id}...`);
      const { isValid, roles } = await this.authService.validateUserGuild(accessToken, user.id);
      
      if (!isValid) {
        this.logger.warn(`L'utilisateur ${user.id} n'est pas membre de la guilde autorisée`);
        throw new UnauthorizedException('User is not a member of the allowed guild');
      }
      
      // Générer un JWT
      this.logger.log('Génération du JWT...');
      const jwt = this.authService.generateJwtToken(user, roles);
      
      // Rediriger vers le frontend avec le token
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:4200';
      const redirectUrl = `${frontendUrl}/auth/success?token=${jwt}`;
      this.logger.log(`Redirection vers: ${redirectUrl}`);
      res.redirect(redirectUrl);
    } catch (error) {
      this.logger.error(`Erreur lors du traitement du callback: ${error.message}`, error.stack);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:4200';
      const errorUrl = `${frontendUrl}/auth/error?message=${encodeURIComponent(error.message)}`;
      this.logger.log(`Redirection vers page d'erreur: ${errorUrl}`);
      res.redirect(errorUrl);
    }
  }
}

@ApiTags('api/auth')
@Controller('api/auth')
export class ApiAuthController {
  private readonly logger = new Logger(ApiAuthController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  @ApiOperation({ 
    summary: 'Callback OAuth2 Discord pour l\'API',
    description: 'Endpoint appelé par Discord après authentification réussie, affiche le code d\'autorisation'
  })
  @ApiQuery({ 
    name: 'code', 
    required: true, 
    description: 'Code d\'autorisation fourni par Discord'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Affiche le code d\'autorisation'
  })
  @Get('callback')
  apiCallback(@Query('code') code: string, @Res() res: Response): void {
    this.logger.log(`API Callback reçu avec code: ${code}`);
    
    if (!code) {
      this.logger.error('Code d\'autorisation non fourni');
      res.status(400).send({
        message: 'Code d\'autorisation non fourni',
        status: 400
      });
      return;
    }

    try {
      // Afficher le code d'autorisation
      this.logger.log('Envoi de la réponse avec le code d\'autorisation');
      res.status(200).send({
        message: 'Code d\'autorisation reçu avec succès',
        code: code,
        status: 200,
        redirect_uri: this.configService.get<string>('DISCORD_REDIRECT_URI')
      });
    } catch (error) {
      this.logger.error(`Erreur lors du traitement du callback API: ${error.message}`, error.stack);
      res.status(500).send({
        message: `Erreur: ${error.message}`,
        status: 500
      });
    }
  }

  @ApiOperation({ 
    summary: 'Échange de code pour token',
    description: 'Endpoint pour échanger un code d\'autorisation contre un token d\'accès'
  })
  @ApiQuery({ 
    name: 'code', 
    required: true, 
    description: 'Code d\'autorisation fourni par Discord'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Retourne le token d\'accès'
  })
  @Get('exchange')
  async exchangeCode(@Query('code') code: string, @Res() res: Response): Promise<void> {
    this.logger.log(`Échange de code reçu avec code: ${code}`);
    
    if (!code) {
      this.logger.error('Code d\'autorisation non fourni');
      res.status(400).send({
        message: 'Code d\'autorisation non fourni',
        status: 400
      });
      return;
    }

    try {
      // Échanger le code contre un token d'accès
      this.logger.log('Échange du code contre un token d\'accès...');
      const accessToken = await this.authService.exchangeCodeForToken(code);
      
      // Récupérer les informations de l'utilisateur
      this.logger.log('Récupération des informations utilisateur...');
      const user = await this.authService.getUserInfo(accessToken);
      
      // Valider l'appartenance à la guilde et récupérer les rôles
      this.logger.log(`Validation de l'appartenance à la guilde pour l'utilisateur ${user.id}...`);
      const { isValid, roles } = await this.authService.validateUserGuild(accessToken, user.id);
      
      // Générer un JWT
      this.logger.log('Génération du JWT...');
      const jwt = this.authService.generateJwtToken(user, roles);
      
      res.status(200).send({
        message: 'Échange réussi',
        token: jwt,
        user: {
          id: user.id,
          username: user.username,
          roles: roles
        },
        isValid: isValid,
        status: 200
      });
    } catch (error) {
      this.logger.error(`Erreur lors de l'échange du code: ${error.message}`, error.stack);
      res.status(500).send({
        message: `Erreur: ${error.message}`,
        status: 500
      });
    }
  }
} 