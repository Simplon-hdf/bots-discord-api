import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * GUARD GLOBAL DE SÉCURITÉ
 * 
 * Ce guard protège TOUTE l'API par défaut
 * 
 * PRINCIPE :
 * - Par défaut : TOUT est protégé (authentification JWT requise)
 * - Exception : routes marquées avec @Public() sont accessibles à tous
 * 
 * FONCTIONNEMENT :
 * 1. Le guard vérifie si la route a la métadonnée @Public()
 * 2. Si @Public() alors laisse passer sans vérification
 * 3. Si PAS @Public() alors applique l'authentification JWT normale
 * 
 * AVANTAGES :
 * - Sécurité par défaut : impossible d'oublier de protéger une route
 * - Maintenance simple : juste quelques @Public() à gérer
 * - Erreur = 401, pas de fuite de données
 */
@Injectable()
export class GlobalAuthGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // ÉTAPE 1 : Vérifier si la route est marquée comme publique
    // Le Reflector lit les métadonnées ajoutées par @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(), // Vérifie sur la méthode (ex: @Get())
      context.getClass(),   // Vérifie sur la classe (ex: @Controller())
    ]);

    // ÉTAPE 2 : Si la route est publique, on laisse passer
    if (isPublic) {
      return true; // Accès autorisé sans authentification
    }

    // ÉTAPE 3 : Sinon, on applique l'authentification JWT normale
    // Cette ligne appelle le JwtAuthGuard parent qui :
    // - Vérifie la présence du token JWT
    // - Valide la signature du token
    // - Vérifie l'expiration
    // - Ajoute les infos utilisateur à la requête
    return super.canActivate(context);
  }
} 