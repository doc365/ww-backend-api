import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';

describe('QA Automation Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;
  let projectId: string;

  const testUser = {
    email: 'qa-automation-tester@example.com',
    password: 'SuperSecretPassword123!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    
    // QA Best Practice: Always clean up the test environment before running
    await prisma.user.deleteMany({ where: { email: testUser.email } });
  });

  afterAll(async () => {
    // QA Best Practice: Clean up the database after tests so we leave no garbage data
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await app.close();
  });

  describe('1. Authentication Security', () => {
    it('/auth/register (POST) - Should create a new QA user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user.email).toBe(testUser.email);
        });
    });

    it('/auth/login (POST) - Should authenticate and return JWT token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          jwtToken = res.body.access_token; // Save the token for the next tests!
        });
    });

    it('/project (POST) - Should fail without JWT Token (401 Unauthorized)', () => {
      return request(app.getHttpServer())
        .post('/project')
        .send({ name: 'Secret QA Project' })
        .expect(401); // Asserts that our RBAC/Auth Guard is actively working!
    });
  });

  describe('2. Project & Task Flow', () => {
    it('/project (POST) - Should create a project with a valid JWT Token', () => {
      return request(app.getHttpServer())
        .post('/project')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ name: 'Secret QA Project', description: 'Testing End to End Flow' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Secret QA Project');
          projectId = res.body.id;
        });
    });

    it('/task (POST) - Should create a task inside the new project', () => {
      return request(app.getHttpServer())
        .post('/task')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ title: 'Write automation tests', projectId: projectId })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Write automation tests');
          expect(res.body.projectId).toBe(projectId); // Validates database relationship
        });
    });

    it('/task (GET) - Should correctly retrieve tasks for the user', () => {
      return request(app.getHttpServer())
        .get('/task')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(1);
          expect(res.body[0].title).toBe('Write automation tests');
        });
    });
  });
});
