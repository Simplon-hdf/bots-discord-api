import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AnswerTemplatesModule } from './answer-templates.module';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';

describe('Answer templates Integration Tests', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;

  const testAnswer = {
    content: 'Test answer',
    uuidQuestionTemplate: '123e4567-e89b-12d3-a456-426614174000'
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...typeOrmConfig,
            synchronize: true,
            logging: true,
        }),
        AnswerTemplatesModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
      await app.close();
  });

  describe('/POST answer-templates', () => {
    it('should create a new answer', () => {
      return request(app.getHttpServer())
        .post('/answer-templates')
        .send(testAnswer)
        .expect(201)
        .then((response) => {
      expect(response.body).toHaveProperty('uuid');
      expect(response.body.content).toBe(testAnswer.content);
        });
    });

    it('should validate input data', () => {
      return request(app.getHttpServer())
        .post('/answer-templates')
        .send({
          content: '',
          uuidQuestionTemplate: 'invalid-uuid'
        })
        .expect(400);
    });
  });

  describe('/GET answer-templates', () => {
    it('should return all answers', () => {
      return request(app.getHttpServer())
        .get('/answer-templates')
        .expect(200)
        .then((response) => {
      expect(Array.isArray(response.body)).toBe(true);
        });
    });
  });

  describe('/GET answer-templates/:uuid', () => {
    it('should return a single answer', async () => {
      // Créer d'abord une réponse
      const createResponse = await request(app.getHttpServer())
        .post('/answer-templates')
        .send(testAnswer);

      const uuid = createResponse.body.uuid;

      return request(app.getHttpServer())
        .get(`/answer-templates/${uuid}`)
        .expect(200)
        .then((response) => {
      expect(response.body.uuid).toBe(uuid);
        });
    });
  });
}); 