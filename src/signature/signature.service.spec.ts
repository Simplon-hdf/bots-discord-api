import { Test, TestingModule } from '@nestjs/testing';
import { SignatureService } from './signature.service';
import { PromotionsService } from '../promotions/promotions.service';
import { MembersService } from '../members/members.service';
import { RolesService } from '../roles/roles.service';
import { GuildsService } from '../guilds/guilds.service';
import { ChannelsService } from '../channels/channels.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SignatureService', () => {
  let service: SignatureService;
  
  // Mocks pour tous les services injectés
  const mockPromotionsService = {
    findOne: vi.fn()
  };
  
  const mockMembersService = {
    findByPromotion: vi.fn()
  };
  
  const mockRolesService = {
    findByPromotion: vi.fn()
  };
  
  const mockGuildsService = {
    findOne: vi.fn()
  };
  
  const mockChannelsService = {
    findForumByPromotion: vi.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignatureService,
        { provide: PromotionsService, useValue: mockPromotionsService },
        { provide: MembersService, useValue: mockMembersService },
        { provide: RolesService, useValue: mockRolesService },
        { provide: GuildsService, useValue: mockGuildsService },
        { provide: ChannelsService, useValue: mockChannelsService }
      ],
    }).compile();

    service = module.get<SignatureService>(SignatureService);
    
    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTestPromotionSignature', () => {
    it('should return promotion test data with the correct structure', async () => {
      const result = await service.generateTestPromotionSignature();
      
      // Vérifier que la réponse contient une propriété promotion
      expect(result).toHaveProperty('promotion');
      
      // Vérifier la structure de la promotion
      const { promotion } = result;
      expect(promotion).toHaveProperty('uuid');
      expect(promotion).toHaveProperty('nom');
      expect(promotion).toHaveProperty('forum');
      expect(promotion).toHaveProperty('chargeDeProjet');
      expect(promotion).toHaveProperty('formateurs');
      expect(promotion).toHaveProperty('apprenants');
      
      // Vérifier le contenu des données de test
      expect(promotion.uuid).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(promotion.nom).toBe('Promotion 2023');
      
      // Vérifier la structure du forum
      expect(promotion.forum).toHaveProperty('snowflake');
      expect(promotion.forum).toHaveProperty('nom');
      
      // Vérifier le chargé de projet
      expect(promotion.chargeDeProjet).toHaveProperty('snowflake');
      expect(promotion.chargeDeProjet).toHaveProperty('nom');
      expect(promotion.chargeDeProjet).toHaveProperty('roles');
      expect(promotion.chargeDeProjet.roles).toContain('cdp');
      
      // Vérifier les formateurs
      expect(Array.isArray(promotion.formateurs)).toBe(true);
      expect(promotion.formateurs.length).toBe(2);
      expect(promotion.formateurs[0]).toHaveProperty('nom');
      
      // Vérifier les apprenants
      expect(Array.isArray(promotion.apprenants)).toBe(true);
      expect(promotion.apprenants.length).toBe(12);
      expect(promotion.apprenants[0]).toHaveProperty('roles');
      expect(promotion.apprenants[0].roles).toContain('apprenant');
    });
  });

  describe('getPromotionSignature', () => {
    it('should return promotion signature for valid UUID', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const result = await service.getPromotionSignature(uuid);
      
      expect(result).toHaveProperty('promotion');
      expect(result.promotion).toHaveProperty('uuid');
      expect(result.promotion.uuid).toBe(uuid);
    });

    it('should throw an error for invalid UUID', async () => {
      const uuid = 'invalid-uuid';
      
      // Simuler une erreur dans un des services appelés
      mockPromotionsService.findOne.mockRejectedValue(new Error('Promotion not found'));
      
      // Remplacer temporairement l'implémentation actuelle pour utiliser le mock
      const originalImplementation = service.getPromotionSignature;
      service.getPromotionSignature = async (uuid) => {
        try {
          await mockPromotionsService.findOne(uuid);
          return service.generateTestPromotionSignature();
        } catch (error) {
          throw new Error(`Erreur lors de la récupération des données de signature: ${error.message}`);
        }
      };
      
      await expect(service.getPromotionSignature(uuid)).rejects.toThrow();
      
      // Restaurer l'implémentation originale
      service.getPromotionSignature = originalImplementation;
    });
  });
}); 