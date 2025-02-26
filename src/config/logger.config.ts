import { Params } from 'nestjs-pino';

let loggerConfig: Params;

if (process.env.NODE_ENV === 'production') {
  // Charger la configuration de production
  const { loggerConfig: prodConfig } = require('./logger.prod.config');
  loggerConfig = prodConfig;
} else {
  // Charger la configuration de développement
  const { loggerConfig: devConfig } = require('./logger.dev.config');
  loggerConfig = devConfig;
}

export { loggerConfig };