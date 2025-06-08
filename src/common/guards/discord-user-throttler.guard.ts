import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';

@Injectable()
export class DiscordUserThrottlerGuard extends ThrottlerGuard {
  /**
   * Override de la méthode generateKey pour appliquer le rate-limiting
   * par utilisateur Discord au lieu de par IP.
   * Le but est de créer une clé unique pour chaque utilisateur Discord.
   * Ansi, si deux requêtes arrivent avec le même discord-userId, 
   * elles partagent le même compteur.
   * Un fallback est prévu pour les cas où l'ID Discord n'est pas trouvé.
   */
  protected generateKey(context: ExecutionContext, suffix: string, name: string): string {
    const request = context.switchToHttp().getRequest();
    
    // Essayer d'obtenir l'ID Discord de différentes sources
    let discordUserId: string | undefined;
    
    // 1. Depuis l'utilisateur authentifié (JWT décodé)
    if (request.user?.userId) {
      discordUserId = request.user.userId;
    }
    
    // 2. Depuis le header personnalisé X-Member-UUID
    if (!discordUserId && request.headers['x-member-uuid']) {
      discordUserId = request.headers['x-member-uuid'];
    }
    
    // 3. Depuis le header X-Discord-User-ID (fallback)
    if (!discordUserId && request.headers['x-discord-user-id']) {
      discordUserId = request.headers['x-discord-user-id'];
    }
    
    // Si aucun ID Discord trouvé, utiliser l'IP comme fallback
    if (!discordUserId) {
      const ip = this.getTracker(request);
      return `fallback-ip:${ip}:${suffix}:${name}`;
    }
    
    // Utiliser l'ID Discord comme clé
    return `discord-user:${discordUserId}:${suffix}:${name}`;
  }
  
  /**
   * Override pour personnaliser le message d'erreur
   */
  protected async getErrorMessage(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<string> {
    return 'Limite de requêtes atteinte pour cet utilisateur. Veuillez réessayer dans quelques instants.';
  }
} 