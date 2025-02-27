import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { AppModule } from '../src/app.module';
import { SignatureService } from '../src/signature/signature.service';

describe('SignatureController (e2e)', () => {
  let app: INestApplication;
  let signatureService: SignatureService;

  // Mock data that will be returned by the service
  const mockPromotionData = {
    promotion: {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      nom: 'Promotion 2023',
      forum: {
        snowflake: '123456789012345678',
        nom: 'Forum de la Promotion 2023'
      },
      chargeDeProjet: {
        snowflake: '987654321098765432',
        nom: 'Jean Dupont',
        roles: ['cdp', 'cda-p4-vals']
      },
      formateurs: [
        {
          snowflake: '111111111111111111',
          nom: 'Alice Martin',
          roles: ['formateur', 'cda-p4-vals']
        }
      ],
      apprenants: [
        {
          snowflake: '333333333333333333',
          nom: 'Élève 1',
          roles: ['apprenant', 'cda-p4-vals']
        }
      ]
    }
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(SignatureService)
    .useValue({
      getPromotionSignature: vi.fn().mockResolvedValue(mockPromotionData),
      generateTestPromotionSignature: vi.fn().mockResolvedValue(mockPromotionData),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    signatureService = moduleFixture.get<SignatureService>(SignatureService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/signature/promotion/:uuid (GET)', () => {
    it('should return promotion data for valid UUID', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      return request(app.getHttpServer())
        .get(`/signature/promotion/${uuid}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('promotion');
          expect(res.body.promotion.uuid).toBe(uuid);
          expect(res.body.promotion.nom).toBe('Promotion 2023');
          
          // Vérifier la structure du forum
          expect(res.body.promotion.forum).toHaveProperty('snowflake');
          expect(res.body.promotion.forum).toHaveProperty('nom');
          
          // Vérifier le chargé de projet
          expect(res.body.promotion.chargeDeProjet).toHaveProperty('roles');
          
          // Vérifier les formateurs et apprenants
          expect(Array.isArray(res.body.promotion.formateurs)).toBeTruthy();
          expect(Array.isArray(res.body.promotion.apprenants)).toBeTruthy();
        });
    });
  });

  describe('/signature/promotion/test (POST)', () => {
    it('should create and return test promotion data', () => {
      return request(app.getHttpServer())
        .post('/signature/promotion/test')
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('promotion');
          expect(res.body.promotion.uuid).toBe('123e4567-e89b-12d3-a456-426614174000');
          expect(res.body.promotion.nom).toBe('Promotion 2023');
          
          // Vérifier la structure du forum
          expect(res.body.promotion.forum).toHaveProperty('snowflake');
          
          // Vérifier le chargé de projet et les membres
          expect(res.body.promotion.chargeDeProjet).toHaveProperty('roles');
          expect(Array.isArray(res.body.promotion.formateurs)).toBeTruthy();
          expect(Array.isArray(res.body.promotion.apprenants)).toBeTruthy();
        });
    });
  });
}); 