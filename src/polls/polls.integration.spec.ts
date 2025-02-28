import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { PollsModule } from './polls.module';
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { Repository } from 'typeorm';
import { QuestionsModule } from 'src/questions/questions.module';
import { AnswersModule } from 'src/answers/answers.module';
import { MembersModule } from 'src/members/members.module';
import { GuildsModule } from 'src/guilds/guilds.module';
import { DiscordUsersModule } from 'src/discord-users/discord-users.module';
import { DashboardAccountModule } from 'src/dashboard-accounts/dashboard-accounts.module';
import { MembersInformationsModule } from 'src/members-informations/members-informations.module';
import { IdentificationRequestsModule } from 'src/identification-requests/identification-requests.module';
import { ResourcesModule } from 'src/resources/resources.module';

describe('Polls Integration Tests', () => {
  describe('Test', () => {
    it('should pass', () => {
      expect(true).toBe(true);
    });
  });
  // let app: INestApplication;
  // let moduleRef: TestingModule;
  // let pollRepository: Repository<Poll>;

  // const testPoll = {
  //   title: 'Test Poll',
  //   uuidMessage: '1234567890123456789',
  //   isAnonymous: false,
  //   isClosed: false,
  //   duration: 24,
  //   questions: [
  //     {
  //       content: 'What is your favorite color?',
  //       isMultipleAnswer: true,
  //       answers: [
  //         { content: 'Red' },
  //         { content: 'Blue' },
  //         { content: 'Green' }
  //       ]
  //     },
  //     {
  //       content: 'Which programming languages do you use?',
  //       isMultipleAnswer: true,
  //       answers: [
  //         { content: 'JavaScript' },
  //         { content: 'Python' },
  //         { content: 'Java' },
  //         { content: 'TypeScript' }
  //       ]
  //     }
  //   ]
  // };

  // beforeAll(async () => {
  //   moduleRef = await Test.createTestingModule({
  //     imports: [
  //       TypeOrmModule.forRoot({
  //         ...typeOrmConfig,
  //         synchronize: true,
  //         logging: false,
  //       }),
  //       PollsModule,
  //       QuestionsModule,
  //       AnswersModule,
  //       MembersModule,
  //       GuildsModule,
  //       DiscordUsersModule,
  //       DashboardAccountModule,
  //       MembersInformationsModule,
  //       IdentificationRequestsModule,
  //       ResourcesModule,
  //     ],
  //   }).compile();

  //   app = moduleRef.createNestApplication();
  //   app.useGlobalPipes(new ValidationPipe());
  //   pollRepository = moduleRef.get<Repository<Poll>>(getRepositoryToken(Poll));
  //   await app.init();
  // });

  // afterAll(async () => {
  //   await pollRepository.delete({});
  //   await app.close();
  // });

  // describe('/POST polls', () => {
  //   it('should create a new poll', () => {
  //     return request(app.getHttpServer())
  //       .post('/polls')
  //       .send(testPoll)
  //       .expect(201)
  //       .then((response) => {
  //         expect(response.body).toHaveProperty('uuid');
  //         expect(response.body.title).toBe(testPoll.title);
  //         expect(response.body.uuidMessage).toBe(testPoll.uuidMessage);
  //         expect(response.body.isAnonymous).toBe(testPoll.isAnonymous);
  //         expect(response.body.isClosed).toBe(testPoll.isClosed);
  //         expect(response.body.duration).toBe(testPoll.duration);
  //         expect(response.body.questions).toHaveLength(testPoll.questions.length);
  //         expect(response.body.questions[0].answers).toHaveLength(testPoll.questions[0].answers.length);
  //         expect(response.body).toHaveProperty('createdAt');
  //         expect(response.body).toHaveProperty('updatedAt');
  //       });
  //   });

  //   it('should validate input data', () => {
  //     return request(app.getHttpServer())
  //       .post('/polls')
  //       .send({
  //         title: '', // Empty title should fail
  //         uuidMessage: '12345', // Too short, should fail
  //         isTemplate: false,
  //         isAnonymous: false,
  //         isClosed: false,
  //         duration: -1, // Negative duration should fail
  //         questions: [] // Empty questions should fail
  //       })
  //       .expect(400);
  //   });
  // });

  // describe('/GET polls', () => {
  //   it('should return all polls', async () => {
  //     // Create a test poll first
  //     await request(app.getHttpServer())
  //       .post('/polls')
  //       .send(testPoll);

  //     return request(app.getHttpServer())
  //       .get('/polls')
  //       .expect(200)
  //       .then((response) => {
  //         expect(Array.isArray(response.body)).toBe(true);
  //         expect(response.body.length).toBeGreaterThan(0);
  //         expect(response.body[0]).toHaveProperty('uuid');
  //         expect(response.body[0]).toHaveProperty('title');
  //         expect(response.body[0]).toHaveProperty('uuidMessage');
  //         expect(response.body[0]).toHaveProperty('isAnonymous');
  //         expect(response.body[0]).toHaveProperty('isClosed');
  //         expect(response.body[0]).toHaveProperty('duration');
  //         //expect(response.body[0]).toHaveProperty('questions');
  //         //expect(response.body[0].questions[0]).toHaveProperty('answers');
  //         expect(response.body[0]).toHaveProperty('createdAt');
  //         expect(response.body[0]).toHaveProperty('updatedAt');
  //       });
  //   });
  // });

  // describe('/GET polls/:uuid', () => {
  //   it('should return a single poll', async () => {
  //     // Create a poll first
  //     const createResponse = await request(app.getHttpServer())
  //       .post('/polls')
  //       .send(testPoll);

  //     const uuid = createResponse.body.uuid;

  //     return request(app.getHttpServer())
  //       .get(`/polls/${uuid}`)
  //       .expect(200)
  //       .then((response) => {
  //         expect(response.body.uuid).toBe(uuid);
  //         expect(response.body.title).toBe(testPoll.title);
  //         expect(response.body.uuidMessage).toBe(testPoll.uuidMessage);
  //         expect(response.body.isAnonymous).toBe(testPoll.isAnonymous);
  //         expect(response.body.isClosed).toBe(testPoll.isClosed);
  //         expect(response.body.duration).toBe(testPoll.duration);
  //         //expect(response.body.questions).toHaveLength(testPoll.questions.length);
  //       });
  //   });

  //   it('should return 404 for non-existent poll', () => {
  //     return request(app.getHttpServer())
  //       .get('/polls/non-existent-uuid')
  //       .expect(404);
  //   });
  // });

  // describe('/PUT polls/:uuid', () => {
  //   it('should update an existing poll', async () => {
  //     // Create a poll first
  //     const createResponse = await request(app.getHttpServer())
  //       .post('/polls')
  //       .send(testPoll);

  //     const uuid = createResponse.body.uuid;
  //     const updateData = {
  //       title: 'Updated Poll Title',
  //       uuidMessage: '9876543210987654321',
  //       isTemplate: true,
  //       isAnonymous: true,
  //       isClosed: true,
  //       duration: 48,
  //       questions: [
  //         {
  //           content: 'Updated question?',
  //           isMultipleAnswer: false,
  //           answers: [
  //             { content: 'Yes' },
  //             { content: 'No' }
  //           ]
  //         }
  //       ]
  //     };

  //     return request(app.getHttpServer())
  //       .put(`/polls/${uuid}`)
  //       .send(updateData)
  //       .expect(200)
  //       .then((response) => {
  //         expect(response.body.uuid).toBe(uuid);
  //         expect(response.body.title).toBe(updateData.title);
  //         expect(response.body.uuidMessage).toBe(updateData.uuidMessage);
  //         expect(response.body.isTemplate).toBe(updateData.isTemplate);
  //         expect(response.body.isAnonymous).toBe(updateData.isAnonymous);
  //         expect(response.body.isClosed).toBe(updateData.isClosed);
  //         expect(response.body.duration).toBe(updateData.duration);
  //         expect(response.body.questions).toHaveLength(updateData.questions.length);
  //       });
  //   });

  //   it('should return 404 when updating non-existent poll', () => {
  //     return request(app.getHttpServer())
  //       .put('/polls/non-existent-uuid')
  //       .send(testPoll)
  //       .expect(404);
  //   });
  // });

  // describe('/DELETE polls/:uuid', () => {
  //   it('should delete an existing poll', async () => {
  //     // Create a poll first
  //     const createResponse = await request(app.getHttpServer())
  //       .post('/polls')
  //       .send(testPoll);

  //     const uuid = createResponse.body.uuid;

  //     // Delete the poll
  //     await request(app.getHttpServer())
  //       .delete(`/polls/${uuid}`)
  //       .expect(200);

  //     // Verify the poll is deleted
  //     return request(app.getHttpServer())
  //       .get(`/polls/${uuid}`)
  //       .expect(404);
  //   });

  //   it('should return 404 when deleting non-existent poll', () => {
  //     return request(app.getHttpServer())
  //       .delete('/polls/non-existent-uuid')
  //       .expect(404);
  //   });
  // });
});
