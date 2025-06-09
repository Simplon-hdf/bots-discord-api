import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
// Import des guards de sécurité
import { GlobalAuthGuard } from './guards/global-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '24h'),
        },
      }),
    }),
    HttpModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  // PROVIDERS : Tous les guards sont disponibles comme services
  providers: [
    AuthService, 
    JwtStrategy,
    GlobalAuthGuard,  // Notre nouveau guard global
    JwtAuthGuard,     // Guard JWT de base
    RolesGuard        // Guard de rôles (pour plus tard)
  ],
  // EXPORTS : Les guards sont exportés pour être utilisés dans d'autres modules
  exports: [
    AuthService, 
    JwtStrategy, 
    PassportModule,
    GlobalAuthGuard,  // Le plus important : notre guard global
    JwtAuthGuard,
    RolesGuard
  ],
})
export class AuthModule {} 