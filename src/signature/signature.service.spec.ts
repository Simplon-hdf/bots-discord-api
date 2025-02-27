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
    findChannelByPromotion: vi.fn()
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

  describe('getAllPromotions', () => {
    it('should return all promotion signatures with the correct structure', async () => {
      const result = await service.getAllPromotions();
      
      // Vérifier que la réponse contient une propriété promotions
      expect(result).toHaveProperty('promotions');
      expect(Array.isArray(result.promotions)).toBe(true);
      expect(result.promotions.length).toBeGreaterThanOrEqual(1);
      
      // Vérifier que toutes les promotions ont la structure correcte
      for (const promotion of result.promotions) {
        expect(promotion).toHaveProperty('uuid');
        expect(promotion).toHaveProperty('nom');
        expect(promotion).toHaveProperty('channel');
        expect(promotion).toHaveProperty('chargeDeProjet');
        expect(promotion).toHaveProperty('formateurs');
        expect(promotion).toHaveProperty('apprenants');
        
        // Vérifier la structure du channel
        expect(promotion.channel).toHaveProperty('snowflake');
        expect(promotion.channel).toHaveProperty('nom');
        
        // Vérifier le chargé de projet
        expect(promotion.chargeDeProjet).toHaveProperty('roles');
        expect(Array.isArray(promotion.chargeDeProjet.roles)).toBe(true);
        
        // Vérifier les formateurs et apprenants
        expect(Array.isArray(promotion.formateurs)).toBe(true);
        expect(Array.isArray(promotion.apprenants)).toBe(true);
      }
    });
  });

  describe('generateTestPromotionSignature', () => {
    it('should return promotions test data with the correct structure', async () => {
      const result = await service.generateTestPromotionSignature();
      
      // Vérifier que la réponse contient une propriété promotions
      expect(result).toHaveProperty('promotions');
      expect(Array.isArray(result.promotions)).toBe(true);
      expect(result.promotions.length).toBeGreaterThanOrEqual(1);
      
      // Vérifier la structure de la première promotion
      const promotion = result.promotions[0];
      expect(promotion).toHaveProperty('uuid');
      expect(promotion).toHaveProperty('nom');
      expect(promotion).toHaveProperty('channel');
      expect(promotion).toHaveProperty('chargeDeProjet');
      expect(promotion).toHaveProperty('formateurs');
      expect(promotion).toHaveProperty('apprenants');
      
      // Vérifier le contenu des données de test
      expect(promotion.uuid).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');
      expect(promotion.nom).toBe('Cda P4 Vals');
      
      // Vérifier la structure du channel
      expect(promotion.channel).toHaveProperty('snowflake');
      expect(promotion.channel).toHaveProperty('nom');
      expect(promotion.channel.snowflake).toBe('1344640530763485265');
      
      // Vérifier le chargé de projet
      expect(promotion.chargeDeProjet).toHaveProperty('snowflake');
      expect(promotion.chargeDeProjet).toHaveProperty('nom');
      expect(promotion.chargeDeProjet).toHaveProperty('roles');
      expect(Array.isArray(promotion.chargeDeProjet.roles)).toBe(true);
      expect(promotion.chargeDeProjet.roles[0]).toHaveProperty('id');
      expect(promotion.chargeDeProjet.roles[0]).toHaveProperty('nom');
      expect(promotion.chargeDeProjet.roles[0].nom).toBe('cdp');
      
      // Vérifier les formateurs
      expect(Array.isArray(promotion.formateurs)).toBe(true);
      expect(promotion.formateurs.length).toBeGreaterThanOrEqual(1);
      expect(promotion.formateurs[0]).toHaveProperty('nom');
      expect(promotion.formateurs[0].roles[0]).toHaveProperty('nom');
      
      // Vérifier les apprenants
      expect(Array.isArray(promotion.apprenants)).toBe(true);
      expect(promotion.apprenants.length).toBeGreaterThanOrEqual(1);
      expect(promotion.apprenants[0]).toHaveProperty('roles');
      expect(promotion.apprenants[0].roles[0].nom).toBe('apprenant');
    });
  });

  describe('getPromotionSignature', () => {
    it('should return promotion signature for valid UUID', async () => {
      const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const result = await service.getPromotionSignature(uuid);
      
      expect(result).toHaveProperty('promotion');
      expect(result.promotion).toHaveProperty('uuid');
      expect(result.promotion.uuid).toBe(uuid);
      expect(result.promotion).toHaveProperty('channel');
      expect(result.promotion.channel).toHaveProperty('snowflake');
    });

    it('should throw an error for invalid UUID', async () => {
      const uuid = 'invalid-uuid';
      
      await expect(service.getPromotionSignature(uuid)).rejects.toThrow();
    });
  });
}); 