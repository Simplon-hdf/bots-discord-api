import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  const mockConfigService = {
    get: vi.fn().mockReturnValue('jwt_secret'),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user object from payload', async () => {
      // Arrange
      const payload: JwtPayload = {
        sub: 'user_id',
        username: 'test_user',
        roles: ['role_1', 'role_2'],
        guildId: 'guild_id',
      };

      // Act
      const result = await strategy.validate(payload);

      // Assert
      expect(result).toEqual({
        userId: 'user_id',
        username: 'test_user',
        roles: ['role_1', 'role_2'],
        guildId: 'guild_id',
      });
    });
  });
}); 