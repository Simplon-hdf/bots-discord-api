import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerConfig: ThrottlerModuleOptions = [
  {
    name: 'default',
    ttl: 60000, // 60 secondes 
    limit: 50, // 50 requêtes 
  },
]; 