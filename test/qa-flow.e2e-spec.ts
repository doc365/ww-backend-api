/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';

describe('Comprehensive QA Automation Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // Storage for IDs to test relational flows
  let jwtToken: string;
  let projectId: string;
  let categoryId: string;
  let taskId: string;
  let commentId: string;
  let profileId: string;

  const testUser = {
    email: 'full-qa-tester@example.com',
    password: 'SuperSecretPassword123!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    // Clean up test data before running
    await prisma.user.deleteMany({ where: { email: testUser.email } });
  });

  afterAll(async () => {
    // Clean up test data after tests
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await app.close();
  });

  describe('1. Authentication & Security', () => {
    it('/auth/register (POST) - Register user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);
    });

    it('/auth/login (POST) - Login & Extract Token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          jwtToken = res.body.access_token;
        });
    });

    it('/auth/me (GET) - Verify Token works', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });

  describe('2. Profiles Module', () => {
    it('/profile (POST) - Create Profile', () => {
      return request(app.getHttpServer())
        .post('/profile')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          bio: 'QA Automation Engineer',
          avatarUrl: 'https://example.com/avatar.jpg',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.bio).toBe('QA Automation Engineer');
          profileId = res.body.id;
        });
    });

    it('/profile (GET) - Retrieve Profiles', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });

  describe('3. Projects & Categories Module', () => {
    it('/project (POST) - Create Project', () => {
      return request(app.getHttpServer())
        .post('/project')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ name: 'Alpha Release', description: 'Testing phase' })
        .expect(201)
        .expect((res) => {
          projectId = res.body.id;
        });
    });

    it('/category (POST) - Create Category', () => {
      return request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ name: 'Bug', color: '#ff0000' })
        .expect(201)
        .expect((res) => {
          categoryId = res.body.id;
        });
    });
  });

  describe('4. Tasks Module (Relational)', () => {
    it('/task (POST) - Create Task linked to Project & Category', () => {
      return request(app.getHttpServer())
        .post('/task')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          title: 'Fix login page',
          projectId: projectId,
          categoryId: categoryId,
        })
        .expect(201)
        .expect((res) => {
          taskId = res.body.id;
          expect(res.body.projectId).toBe(projectId);
        });
    });

    it('/task/:id (PATCH) - Update Task Status', () => {
      return request(app.getHttpServer())
        .patch(`/task/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ isCompleted: true })
        .expect(200)
        .expect((res) => {
          expect(res.body.isCompleted).toBe(true);
        });
    });
  });

  describe('5. Comments Module', () => {
    it('/comment (POST) - Create Comment on a Task', () => {
      return request(app.getHttpServer())
        .post('/comment')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ content: 'I found a bug here!', taskId: taskId })
        .expect(201)
        .expect((res) => {
          commentId = res.body.id;
        });
    });

    it('/comment (GET) - Retrieve Comments', () => {
      return request(app.getHttpServer())
        .get('/comment')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('6. Deletion (Cleanup Flow)', () => {
    it('/comment/:id (DELETE) - Delete Comment', () => {
      return request(app.getHttpServer())
        .delete(`/comment/${commentId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });

    it('/task/:id (DELETE) - Delete Task', () => {
      return request(app.getHttpServer())
        .delete(`/task/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });

    it('/project/:id (DELETE) - Delete Project', () => {
      return request(app.getHttpServer())
        .delete(`/project/${projectId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });

    it('/category/:id (DELETE) - Delete Category', () => {
      return request(app.getHttpServer())
        .delete(`/category/${categoryId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });

    it('/profile/:id (DELETE) - Delete Profile', () => {
      return request(app.getHttpServer())
        .delete(`/profile/${profileId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });
});
