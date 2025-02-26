import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { DiscordUser, DiscordGuild, DiscordGuildMember } from './interfaces/discord-user.interface';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockConfigService = {
    get: vi.fn((key: string) => {
      const config = {
        'DISCORD_API_ENDPOINT': 'https://discord.com/api/v10',
        'DISCORD_CLIENT_ID': 'client_id',
        'DISCORD_CLIENT_SECRET': 'client_secret',
        'DISCORD_REDIRECT_URI': 'http://localhost:3000/auth/callback',
        'ALLOWED_GUILD_ID': 'guild_id',
        'DISCORD_BOT_TOKEN': 'bot_token',
      };
      return config[key];
    }),
  };

  const mockHttpService = {
    post: vi.fn(),
    get: vi.fn(),
  };

  const mockJwtService = {
    sign: vi.fn().mockReturnValue('jwt_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exchangeCodeForToken', () => {
    it('should exchange code for token successfully', async () => {
      // Arrange
      const code = 'auth_code';
      const mockResponse = {
        data: {
          access_token: 'access_token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      };
      mockHttpService.post.mockReturnValue(of(mockResponse));

      // Act
      const result = await service.exchangeCodeForToken(code);

      // Assert
      expect(result).toEqual('access_token');
      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://discord.com/api/v10/oauth2/token',
        expect.any(URLSearchParams),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
    });

    it('should throw BadRequestException when exchange fails', async () => {
      // Arrange
      const code = 'invalid_code';
      mockHttpService.post.mockReturnValue(throwError(() => new Error('Failed')));

      // Act & Assert
      await expect(service.exchangeCodeForToken(code)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserInfo', () => {
    it('should get user info successfully', async () => {
      // Arrange
      const accessToken = 'access_token';
      const mockUser: DiscordUser = {
        id: 'user_id',
        username: 'test_user',
        discriminator: '1234',
        avatar: 'avatar_hash',
      };
      mockHttpService.get.mockReturnValue(of({ data: mockUser }));

      // Act
      const result = await service.getUserInfo(accessToken);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://discord.com/api/v10/users/@me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    });

    it('should throw UnauthorizedException when getting user info fails', async () => {
      // Arrange
      const accessToken = 'invalid_token';
      mockHttpService.get.mockReturnValue(throwError(() => new Error('Failed')));

      // Act & Assert
      await expect(service.getUserInfo(accessToken)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getUserGuilds', () => {
    it('should get user guilds successfully', async () => {
      // Arrange
      const accessToken = 'access_token';
      const mockGuilds: DiscordGuild[] = [
        {
          id: 'guild_id',
          name: 'Test Guild',
          icon: 'icon_hash',
          owner: false,
          permissions: 104324161,
          features: [],
        },
      ];
      mockHttpService.get.mockReturnValue(of({ data: mockGuilds }));

      // Act
      const result = await service.getUserGuilds(accessToken);

      // Assert
      expect(result).toEqual(mockGuilds);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://discord.com/api/v10/users/@me/guilds',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    });

    it('should throw UnauthorizedException when getting user guilds fails', async () => {
      // Arrange
      const accessToken = 'invalid_token';
      mockHttpService.get.mockReturnValue(throwError(() => new Error('Failed')));

      // Act & Assert
      await expect(service.getUserGuilds(accessToken)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getGuildMember', () => {
    it('should get guild member successfully', async () => {
      // Arrange
      const userId = 'user_id';
      const guildId = 'guild_id';
      const accessToken = 'access_token';
      const mockMember: DiscordGuildMember = {
        user: {
          id: 'user_id',
          username: 'test_user',
          discriminator: '1234',
          avatar: 'avatar_hash',
        },
        nick: null,
        roles: ['role_id_1', 'role_id_2'],
        joined_at: '2021-01-01T00:00:00.000Z',
        deaf: false,
        mute: false,
      };
      
      // Simuler d'abord l'échec avec OAuth2 puis le succès avec le token de bot
      mockHttpService.get.mockImplementation((url, options) => {
        if (url.includes('users/@me/guilds')) {
          return throwError(() => new Error('OAuth2 failed'));
        }
        return of({ data: mockMember });
      });

      // Act
      const result = await service.getGuildMember(userId, accessToken);

      // Assert
      expect(result).toEqual(mockMember);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `https://discord.com/api/v10/guilds/${guildId}/members/${userId}`,
        {
          headers: {
            Authorization: `Bot bot_token`,
          },
        },
      );
    });

    it('should throw UnauthorizedException when user is not a member of the guild', async () => {
      // Arrange
      const userId = 'user_id';
      const guildId = 'guild_id';
      const accessToken = 'access_token';
      const error = { response: { status: 404 } };
      mockHttpService.get.mockReturnValue(throwError(() => error));

      // Act & Assert
      await expect(service.getGuildMember(userId, accessToken)).rejects.toThrow(
        new UnauthorizedException("L'utilisateur n'est pas membre du serveur spécifié"),
      );
    });

    it('should throw UnauthorizedException when getting guild member fails', async () => {
      // Arrange
      const userId = 'user_id';
      const guildId = 'guild_id';
      const accessToken = 'access_token';
      mockHttpService.get.mockReturnValue(throwError(() => new Error('Failed')));

      // Act & Assert
      await expect(service.getGuildMember(userId, accessToken)).rejects.toThrow(
        new UnauthorizedException('Impossible de récupérer les informations du membre'),
      );
    });
  });

  describe('validateUserGuild', () => {
    it('should validate user guild successfully when user is in guild', async () => {
      // Arrange
      const accessToken = 'access_token';
      const userId = 'user_id';
      const mockGuilds: DiscordGuild[] = [
        {
          id: 'guild_id',
          name: 'Test Guild',
          icon: 'icon_hash',
          owner: false,
          permissions: 104324161,
          features: [],
        },
      ];
      const mockGuildMember: DiscordGuildMember = {
        user: {
          id: 'user_id',
          username: 'test_user',
          discriminator: '1234',
          avatar: 'avatar_hash',
        },
        nick: 'nickname',
        roles: ['role_id_1', 'role_id_2'],
        joined_at: '2021-01-01T00:00:00.000Z',
        deaf: false,
        mute: false,
      };

      vi.spyOn(service, 'getUserGuilds').mockResolvedValue(mockGuilds);
      vi.spyOn(service, 'getGuildMember').mockResolvedValue(mockGuildMember);

      // Act
      const result = await service.validateUserGuild(accessToken, userId);

      // Assert
      expect(result).toEqual({ 
        isValid: true, 
        roles: ['role_id_1', 'role_id_2'],
        guildMember: mockGuildMember
      });
      expect(service.getUserGuilds).toHaveBeenCalledWith(accessToken);
      expect(service.getGuildMember).toHaveBeenCalledWith(userId, accessToken);
    });

    it('should return isValid false when user is not in allowed guild', async () => {
      // Arrange
      const accessToken = 'access_token';
      const userId = 'user_id';
      const mockGuilds: DiscordGuild[] = [
        {
          id: 'other_guild_id',
          name: 'Other Guild',
          icon: 'icon_hash',
          owner: false,
          permissions: 104324161,
          features: [],
        },
      ];

      vi.spyOn(service, 'getUserGuilds').mockResolvedValue(mockGuilds);
      vi.spyOn(service, 'getGuildMember');

      // Act
      const result = await service.validateUserGuild(accessToken, userId);

      // Assert
      expect(result).toEqual({ 
        isValid: false, 
        roles: [],
        guildMember: null
      });
      expect(service.getUserGuilds).toHaveBeenCalledWith(accessToken);
      expect(service.getGuildMember).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when validation fails', async () => {
      // Arrange
      const accessToken = 'access_token';
      const userId = 'user_id';
      
      vi.spyOn(service, 'getUserGuilds').mockRejectedValue(new UnauthorizedException('Failed'));

      // Act & Assert
      await expect(service.validateUserGuild(accessToken, userId)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('generateJwtToken', () => {
    it('should generate JWT token with user info and roles', () => {
      // Arrange
      const user: DiscordUser = {
        id: 'user_id',
        username: 'test_user',
        discriminator: '1234',
        avatar: 'avatar_hash',
      };
      const roles = ['role_1', 'role_2'];

      // Act
      const result = service.generateJwtToken(user, roles);

      // Assert
      expect(result).toEqual('jwt_token');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        username: user.username,
        roles,
        guildId: 'guild_id',
      });
    });
  });
}); 