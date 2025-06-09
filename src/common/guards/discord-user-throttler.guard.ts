import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';

@Injectable()
export class DiscordUserThrottlerGuard extends ThrottlerGuard {
  /**
   * Override de la méthode generateKey pour appliquer le rate-limiting
   * par utilisateur Discord au lieu de par IP.
   * 
   * Priorité des sources d'ID utilisateur :
   * 1. Header X-Discord-User-ID (transmis par le bot pour l'utilisateur final)
   * 2. Fallback sur l'IP si aucun ID Discord trouvé
   */
  protected generateKey(context: ExecutionContext, suffix: string, name: string): string {
    const request = context.switchToHttp().getRequest();
    
    // 🎯 Source principale : Header X-Discord-User-ID
    // Transmis par le bot Discord avec l'ID de l'utilisateur final
    const discordUserId = request.headers['x-discord-user-id'];
    
    if (discordUserId) {
      // ✅ Rate limiting par utilisateur Discord
      return `discord-user:${discordUserId}:${suffix}:${name}`;
    }
    
    // 🔄 Fallback : Rate limiting par IP
    // Utilisé si aucun ID Discord n'est fourni
    const ip = this.getTracker(request);
    return `fallback-ip:${ip}:${suffix}:${name}`;
  }
  
  /**
   * Message d'erreur personnalisé pour les utilisateurs Discord
   */
  protected async getErrorMessage(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<string> {
    return 'Limite de requêtes atteinte pour cet utilisateur. Veuillez réessayer dans quelques instants.';
  }
} 