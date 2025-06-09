import { SetMetadata } from '@nestjs/common';

/**
 * DÉCORATEUR @Public()
 * 
 * Ce décorateur marque une route ou un contrôleur entier comme PUBLIC
 * Cela signifie qu'aucune authentification ne sera requise
 * 
 * UTILISATION :
 * @Public()
 * @Get('ma-route')
 * maMethodePublique() { ... }
 * 
 * FONCTIONNEMENT :
 * - SetMetadata ajoute une métadonnée 'isPublic' = true à la route
 * - Le guard global vérifiera cette métadonnée
 * - Si isPublic = true alors pas d'authentification
 * - Si isPublic = false/undefined alors authentification requise
 */
export const Public = () => SetMetadata('isPublic', true); 