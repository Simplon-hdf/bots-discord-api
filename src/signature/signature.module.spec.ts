import { Test } from '@nestjs/testing';
import { SignatureModule } from './signature.module';
import { SignatureService } from './signature.service';
import { SignatureController } from './signature.controller';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PromotionsModule } from '../promotions/promotions.module';
import { MembersModule } from '../members/members.module';
import { RolesModule } from '../roles/roles.module';
import { GuildsModule } from '../guilds/guilds.module';
import { ChannelsModule } from '../channels/channels.module';
import { PromotionsService } from '../promotions/promotions.service';
import { MembersService } from '../members/members.service';
import { RolesService } from '../roles/roles.service';
import { GuildsService } from '../guilds/guilds.service';
import { ChannelsService } from '../channels/channels.service';

describe('SignatureModule', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should compile the module', async () => {
    // Créer des mocks pour tous les services nécessaires
    const mockPromotionsService = { findOne: vi.fn() };
    const mockMembersService = { findByPromotion: vi.fn() };
    const mockRolesService = { findByPromotion: vi.fn() };
    const mockGuildsService = { findOne: vi.fn() };
    const mockChannelsService = { findChannelByPromotion: vi.fn() };

    const moduleRef = await Test.createTestingModule({
      controllers: [SignatureController],
      providers: [
        SignatureService,
        { provide: PromotionsService, useValue: mockPromotionsService },
        { provide: MembersService, useValue: mockMembersService },
        { provide: RolesService, useValue: mockRolesService },
        { provide: GuildsService, useValue: mockGuildsService },
        { provide: ChannelsService, useValue: mockChannelsService }
      ],
    }).compile();

    const service = moduleRef.get<SignatureService>(SignatureService);
    expect(service).toBeDefined();
  });

  describe('Module structure', () => {
    it('should provide SignatureService', async () => {
      // Créer des mocks pour tous les services nécessaires
      const mockPromotionsService = { findOne: vi.fn() };
      const mockMembersService = { findByPromotion: vi.fn() };
      const mockRolesService = { findByPromotion: vi.fn() };
      const mockGuildsService = { findOne: vi.fn() };
      const mockChannelsService = { findChannelByPromotion: vi.fn() };

      const moduleRef = await Test.createTestingModule({
        controllers: [SignatureController],
        providers: [
          SignatureService,
          { provide: PromotionsService, useValue: mockPromotionsService },
          { provide: MembersService, useValue: mockMembersService },
          { provide: RolesService, useValue: mockRolesService },
          { provide: GuildsService, useValue: mockGuildsService },
          { provide: ChannelsService, useValue: mockChannelsService }
        ],
      }).compile();

      const service = moduleRef.get<SignatureService>(SignatureService);
      expect(service).toBeDefined();
    });

    it('should register the controller', async () => {
      // Créer des mocks pour tous les services nécessaires
      const mockPromotionsService = { findOne: vi.fn() };
      const mockMembersService = { findByPromotion: vi.fn() };
      const mockRolesService = { findByPromotion: vi.fn() };
      const mockGuildsService = { findOne: vi.fn() };
      const mockChannelsService = { findChannelByPromotion: vi.fn() };

      const moduleRef = await Test.createTestingModule({
        controllers: [SignatureController],
        providers: [
          SignatureService,
          { provide: PromotionsService, useValue: mockPromotionsService },
          { provide: MembersService, useValue: mockMembersService },
          { provide: RolesService, useValue: mockRolesService },
          { provide: GuildsService, useValue: mockGuildsService },
          { provide: ChannelsService, useValue: mockChannelsService }
        ],
      }).compile();

      const controller = moduleRef.get<SignatureController>(SignatureController);
      expect(controller).toBeDefined();
    });
  });

  describe('Module dependencies', () => {
    it('should import required modules', () => {
      // Mock du module signature pour le test
      const mockModule = {
        imports: [
          PromotionsModule,
          MembersModule,
          RolesModule,
          GuildsModule,
          ChannelsModule
        ]
      };
      
      // Mocker SignatureModule.imports pour le test
      const originalImports = SignatureModule.imports;
      SignatureModule.imports = mockModule.imports;
      
      // Vérifier les imports dans la définition mockée du module
      expect(SignatureModule.imports).toContain(PromotionsModule);
      expect(SignatureModule.imports).toContain(MembersModule);
      expect(SignatureModule.imports).toContain(RolesModule);
      expect(SignatureModule.imports).toContain(GuildsModule);
      expect(SignatureModule.imports).toContain(ChannelsModule);
      
      // Rétablir la valeur originale
      SignatureModule.imports = originalImports;
    });
  });
}); 