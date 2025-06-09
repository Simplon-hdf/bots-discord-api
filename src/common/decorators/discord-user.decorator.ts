import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Décorateur pour extraire l'ID Discord de l'utilisateur depuis la requête
 * 
 * Priorité des sources :
 * 1. Header X-Discord-User-ID (utilisateur final transmis par le bot)
 * 2. JWT user.userId (pour compatibilité avec les authentifications directes)
 * 
 * Usage dans un contrôleur :
 * @Get()
 * getUser(@DiscordUserId() userId: string) {
 *   // userId contient l'ID Discord de l'utilisateur
 * }
 */
export const DiscordUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    
    // 🎯 Source principale : Header X-Discord-User-ID
    // Transmis par le bot Discord avec l'ID de l'utilisateur final
    const headerUserId = request.headers['x-discord-user-id'];
    if (headerUserId) {
      return headerUserId;
    }
    
    // 🔄 Fallback : JWT user.userId (authentifications directes)
    if (request.user?.userId) {
      return request.user.userId;
    }
    
    return undefined;
  },
); 