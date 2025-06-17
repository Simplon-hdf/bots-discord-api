import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EmptyResponseInterceptor } from './common/interceptors/empty-response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import helmet from '@fastify/helmet';
import { createHash } from 'crypto';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  
  const nonce = createHash('sha256')
    .update(Date.now().toString())
    .digest('base64');

  app.useGlobalInterceptors(new EmptyResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Configuration pour servir les fichiers statiques
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public',
    decorateReply: false
  });

  const config = new DocumentBuilder()
    .setTitle('Discord Bot API')
    .setDescription('API pour la gestion du bot Discord')
    .setVersion('1.0')
    .addTag('answers', 'Gestion des réponses aux questions')
    .addTag('signature', 'Gestion des signatures des promotions')
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT',
        description: 'Entrez votre JWT token ici'
      },
      'JWT-auth'
    )
    .addTag('bot')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Supprimer complètement les routes d'authentification et les routes de l'app controller
  if (document.paths) {
    // Supprimer toutes les routes commençant par /auth/
    Object.keys(document.paths).forEach(path => {
      if (path.startsWith('/auth/') || path === '/test-auth' || path === '/auth-callback-page') {
        delete document.paths[path];
      }
    });
  }
  
  SwaggerModule.setup('api', app, document, {
    customJs: [
        `'nonce-${nonce}'`
    ]
  });

  // Nous ne définissons plus de préfixe global pour l'API
  // app.setGlobalPrefix('api');
  
  //Attention, lorsque fastify et nestjs/platform-fastify n'ont pas la même version,
  //cela provoque des erreurs sur helmet
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", `'nonce-${nonce}'`],
        styleSrc: ["'self'", `'nonce-${nonce}'`],
        imgSrc: ["'self'", "data:", "validator.swagger.io"],
        connectSrc: ["'self'", "https://discord.com/api","http://localhost:3000", "http://127.0.0.1:3000" ],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'none'"],
        frameSrc: ["'none'"],
        formAction: ["'self'"],
      }
    },
  });

  // Configuration de la version de l'API
  await app.listen(3000, '0.0.0.0');
}
bootstrap();