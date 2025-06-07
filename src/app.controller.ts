import { Controller, Get, Res, Logger } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { FastifyReply } from 'fastify';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @Get('test-rate-limit')
  testRateLimit(): any {
    return {
      message: 'Test du rate limiting',
      timestamp: new Date().toISOString(),
      success: true
    };
  }

  @Get('test-auth')
  serveAuthTestPage(@Res() res: FastifyReply): void {
    // Essayer plusieurs chemins possibles
    const paths = [
      join(__dirname, '..', 'public', 'auth-test.html'),
      join(__dirname, '..', '..', 'public', 'auth-test.html'),
      join(process.cwd(), 'public', 'auth-test.html')
    ];
    
    this.logger.log(`Tentative de trouver le fichier auth-test.html...`);
    
    for (const filePath of paths) {
      this.logger.log(`Vérification du chemin: ${filePath}`);
      if (fs.existsSync(filePath)) {
        this.logger.log(`Fichier trouvé à: ${filePath}`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        res.type('text/html').send(fileContent);
        return;
      }
    }
    
    this.logger.error(`Fichier auth-test.html non trouvé dans les chemins testés`);
    res.status(404).send({
      message: 'Fichier non trouvé',
      paths: paths
    });
  }

  @Get('auth-callback-page')
  serveAuthCallbackPage(@Res() res: FastifyReply): void {
    // Essayer plusieurs chemins possibles
    const paths = [
      join(__dirname, '..', 'public', 'auth-callback.html'),
      join(__dirname, '..', '..', 'public', 'auth-callback.html'),
      join(process.cwd(), 'public', 'auth-callback.html')
    ];
    
    this.logger.log(`Tentative de trouver le fichier auth-callback.html...`);
    
    for (const filePath of paths) {
      this.logger.log(`Vérification du chemin: ${filePath}`);
      if (fs.existsSync(filePath)) {
        this.logger.log(`Fichier trouvé à: ${filePath}`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        res.type('text/html').send(fileContent);
        return;
      }
    }
    
    this.logger.error(`Fichier auth-callback.html non trouvé dans les chemins testés`);
    res.status(404).send({
      message: 'Fichier non trouvé',
      paths: paths
    });
  }
} 