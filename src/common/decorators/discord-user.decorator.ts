import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Décorateur pour extraire l'ID Discord de l'utilisateur depuis la requête
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
    
    // Essayer différentes sources pour l'ID Discord
    
    // 1. Depuis l'utilisateur authentifié (JWT)
    if (request.user?.userId) {
      return request.user.userId;
    }
    
    // 2. Depuis le header X-Member-UUID
    if (request.headers['x-member-uuid']) {
      return request.headers['x-member-uuid'];
    }
    
    // 3. Depuis le header X-Discord-User-ID
    if (request.headers['x-discord-user-id']) {
      return request.headers['x-discord-user-id'];
    }
    
    return undefined;
  },
); 