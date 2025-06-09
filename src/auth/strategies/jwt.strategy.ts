import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    // SÉCURISATION DU SECRET JWT
    const jwtSecret = configService.get<string>('JWT_SECRET');
    
    // VÉRIFICATION OBLIGATOIRE : Le secret DOIT être défini
    if (!jwtSecret) {
      throw new Error(
        'ERREUR CRITIQUE : JWT_SECRET manquant dans les variables d\'environnement!\n' +
        'Ajoutez JWT_SECRET=votre_secret_super_securise dans votre fichier .env\n' +
        'L\'application ne peut pas démarrer sans ce secret.'
      );
    }

    super({
      // Extraire le token du header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Ne pas ignorer l'expiration (sécurité)
      ignoreExpiration: false,
      // Utiliser le secret (SANS fallback dangereux)
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    // Vous pouvez ajouter une validation supplémentaire ici si nécessaire
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
      guildId: payload.guildId,
    };
  }
} 