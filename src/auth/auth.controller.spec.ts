import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { DiscordUser } from './interfaces/discord-user.interface';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    exchangeCodeForToken: vi.fn(),
    getUserInfo: vi.fn(),
    validateUserGuild: vi.fn(),
    generateJwtToken: vi.fn(),
  };

  const mockResponse = {
    redirect: vi.fn(),
    json: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    // Reset environment variables for each test
    process.env.DISCORD_CLIENT_ID = 'client_id';
    process.env.DISCORD_REDIRECT_URI = 'http://localhost:3000/auth/callback';
    process.env.FRONTEND_URL = 'http://localhost:4200';
    
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should redirect to Discord authorization URL', () => {
      // Arrange
      const expectedUrl = 'https://discord.com/api/oauth2/authorize?client_id=client_id&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code&scope=identify%20email%20guilds';

      // Act
      controller.login(mockResponse as any);

      // Assert
      expect(mockResponse.redirect).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('callback', () => {
    it('should process callback successfully and redirect with token', async () => {
      // Arrange
      const code = 'auth_code';
      const accessToken = 'access_token';
      const user: DiscordUser = {
        id: 'user_id',
        username: 'test_user',
        discriminator: '1234',
        avatar: 'avatar_hash',
      };
      const validationResult = { isValid: true, roles: ['role_1', 'role_2'] };
      const jwt = 'jwt_token';

      mockAuthService.exchangeCodeForToken.mockResolvedValue(accessToken);
      mockAuthService.getUserInfo.mockResolvedValue(user);
      mockAuthService.validateUserGuild.mockResolvedValue(validationResult);
      mockAuthService.generateJwtToken.mockReturnValue(jwt);

      // Act
      await controller.callback(code, mockResponse as any);

      // Assert
      expect(mockAuthService.exchangeCodeForToken).toHaveBeenCalledWith(code);
      expect(mockAuthService.getUserInfo).toHaveBeenCalledWith(accessToken);
      expect(mockAuthService.validateUserGuild).toHaveBeenCalledWith(accessToken, user.id);
      expect(mockAuthService.generateJwtToken).toHaveBeenCalledWith(user, validationResult.roles);
      expect(mockResponse.redirect).toHaveBeenCalledWith('http://localhost:4200/auth/success?token=jwt_token');
    });

    it('should throw UnauthorizedException when code is not provided', async () => {
      // Arrange
      const code = undefined;

      // Act & Assert
      await expect(controller.callback(code, mockResponse as any)).rejects.toThrow(UnauthorizedException);
    });

    it('should redirect to error page when user is not in allowed guild', async () => {
      // Arrange
      const code = 'auth_code';
      const accessToken = 'access_token';
      const user: DiscordUser = {
        id: 'user_id',
        username: 'test_user',
        discriminator: '1234',
        avatar: 'avatar_hash',
      };
      const validationResult = { isValid: false, roles: [] };

      mockAuthService.exchangeCodeForToken.mockResolvedValue(accessToken);
      mockAuthService.getUserInfo.mockResolvedValue(user);
      mockAuthService.validateUserGuild.mockResolvedValue(validationResult);

      // Act
      await controller.callback(code, mockResponse as any);

      // Assert
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:4200/auth/error?message=User%20is%20not%20a%20member%20of%20the%20allowed%20guild'
      );
    });

    it('should redirect to error page when an error occurs', async () => {
      // Arrange
      const code = 'auth_code';
      const error = new Error('Test error');

      mockAuthService.exchangeCodeForToken.mockRejectedValue(error);

      // Act
      await controller.callback(code, mockResponse as any);

      // Assert
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:4200/auth/error?message=Test%20error'
      );
    });
  });
}); 