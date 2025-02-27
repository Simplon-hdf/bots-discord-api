import { Test, TestingModule } from '@nestjs/testing';
import { SignatureController } from './signature.controller';
import { SignatureService } from './signature.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PromotionSignatureDto, PromotionsSignatureResponseDto } from './dto/promotion-signature.dto';
import { NotFoundException } from '@nestjs/common';

describe('SignatureController', () => {
  let controller: SignatureController;
  let service: SignatureService;

  // Création d'un mock pour le service Signature
  const mockSignatureService = {
    getPromotionSignature: vi.fn(),
    generateTestPromotionSignature: vi.fn(),
    getAllPromotions: vi.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignatureController],
      providers: [
        {
          provide: SignatureService,
          useValue: mockSignatureService,
        },
      ],
    }).compile();

    controller = module.get<SignatureController>(SignatureController);
    service = module.get<SignatureService>(SignatureService);
    
    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllPromotions', () => {
    it('should return all promotions', async () => {
      // Données de test
      const mockData = {
        promotions: [
          {
            uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            nom: 'Cda P4 Vals',
            channel: {
              snowflake: '1344640530763485265',
              nom: 'Forum de la Cda P4 Vals'
            },
            chargeDeProjet: {
              snowflake: '987654321098765432',
              nom: 'Jean Dupont',
              roles: [
                {
                  id: '1344616774402052127',
                  nom: 'cdp'
                },
                {
                  id: '1344616774402052128',
                  nom: 'cda-p4-vals'
                }
              ]
            },
            formateurs: [],
            apprenants: []
          },
          {
            uuid: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
            nom: 'Promo PHP P2',
            channel: {
              snowflake: '1344611862003712050',
              nom: 'Forum de la Promo PHP P2'
            },
            chargeDeProjet: {
              snowflake: '876543210987654321',
              nom: 'Marie Dubois',
              roles: []
            },
            formateurs: [],
            apprenants: []
          }
        ]
      };

      // Configurer le mock pour retourner les données de test
      mockSignatureService.getAllPromotions.mockResolvedValue(mockData);

      // Appeler la méthode du contrôleur
      const result = await controller.getAllPromotions();

      // Vérifier que le service a été appelé
      expect(mockSignatureService.getAllPromotions).toHaveBeenCalled();
      
      // Vérifier que le résultat correspond aux données de test
      expect(result).toEqual(mockData);
      expect(result.promotions.length).toBe(2);
      expect(result.promotions[0].uuid).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');
      expect(result.promotions[1].uuid).toBe('c9bf9e57-1685-4c89-bafb-ff5af830be8a');
    });
  });

  describe('getPromotionSignature', () => {
    it('should return promotion signature for valid UUID', async () => {
      // Données de test
      const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const mockData = {
        promotion: {
          uuid,
          nom: 'Cda P4 Vals',
          channel: {
            snowflake: '1344640530763485265',
            nom: 'Forum de la Cda P4 Vals'
          },
          chargeDeProjet: {
            snowflake: '987654321098765432',
            nom: 'Jean Dupont',
            roles: [
              {
                id: '1344616774402052127',
                nom: 'cdp'
              },
              {
                id: '1344616774402052128',
                nom: 'cda-p4-vals'
              }
            ]
          },
          formateurs: [
            {
              snowflake: '111111111111111111',
              nom: 'Alice Martin',
              roles: [
                {
                  id: '1344616774402052129',
                  nom: 'formateur'
                },
                {
                  id: '1344616774402052128',
                  nom: 'cda-p4-vals'
                }
              ]
            }
          ],
          apprenants: [
            {
              snowflake: '843642001592811540',
              nom: 'Abel-Karine',
              roles: [
                {
                  id: '1344616774402052126',
                  nom: 'apprenant'
                },
                {
                  id: '1344616774402052128',
                  nom: 'cda-p4-vals'
                }
              ]
            }
          ]
        }
      };

      // Configurer le mock pour retourner les données de test
      mockSignatureService.getPromotionSignature.mockResolvedValue(mockData);

      // Appeler la méthode du contrôleur
      const result = await controller.getPromotionSignature(uuid);

      // Vérifier que le service a été appelé avec le bon UUID
      expect(mockSignatureService.getPromotionSignature).toHaveBeenCalledWith(uuid);
      
      // Vérifier que le résultat correspond aux données de test
      expect(result).toEqual(mockData);
      expect(result.promotion.uuid).toBe(uuid);
    });

    it('should throw NotFoundException for invalid UUID', async () => {
      const uuid = 'invalid-uuid';
      
      // Configurer le mock pour rejeter avec une erreur
      mockSignatureService.getPromotionSignature.mockRejectedValue(
        new Error('Promotion non trouvée')
      );
      
      // Vérifier que la méthode rejette une erreur
      await expect(controller.getPromotionSignature(uuid)).rejects.toThrow();
      
      // Vérifier que le service a été appelé avec le bon UUID
      expect(mockSignatureService.getPromotionSignature).toHaveBeenCalledWith(uuid);
    });
  });

  describe('createTestPromotionData', () => {
    it('should return test promotions data', async () => {
      // Données de test
      const mockData = {
        promotions: [
          {
            uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            nom: 'Cda P4 Vals',
            channel: {
              snowflake: '1344640530763485265',
              nom: 'Forum de la Cda P4 Vals'
            },
            chargeDeProjet: {
              snowflake: '987654321098765432',
              nom: 'Jean Dupont',
              roles: [
                {
                  id: '1344616774402052127',
                  nom: 'cdp'
                },
                {
                  id: '1344616774402052128',
                  nom: 'cda-p4-vals'
                }
              ]
            },
            formateurs: [
              {
                snowflake: '111111111111111111',
                nom: 'Alice Martin',
                roles: [
                  {
                    id: '1344616774402052129',
                    nom: 'formateur'
                  },
                  {
                    id: '1344616774402052128',
                    nom: 'cda-p4-vals'
                  }
                ]
              }
            ],
            apprenants: [
              {
                snowflake: '843642001592811540',
                nom: 'Abel-Karine',
                roles: [
                  {
                    id: '1344616774402052126',
                    nom: 'apprenant'
                  },
                  {
                    id: '1344616774402052128',
                    nom: 'cda-p4-vals'
                  }
                ]
              }
            ]
          }
        ]
      };

      // Configurer le mock pour retourner les données de test
      mockSignatureService.generateTestPromotionSignature.mockResolvedValue(mockData);

      // Appeler la méthode du contrôleur
      const result = await controller.createTestPromotionData();

      // Vérifier que le service a été appelé
      expect(mockSignatureService.generateTestPromotionSignature).toHaveBeenCalled();
      
      // Vérifier que le résultat correspond aux données de test
      expect(result).toEqual(mockData);
    });
  });
}); 