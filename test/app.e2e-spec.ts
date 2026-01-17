import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('User E2E Tests', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/user/register', () => {
    it('should register a new user successfully', () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePassword123!',
        birthday: '2000-01-15',
      };

      return request(app.getHttpServer())
        .post('/api/user/register')
        .send(registerDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.username).toBe(registerDto.username);
          expect(res.body.email).toBe(registerDto.email);
          expect(res.body.birthday).toBe(registerDto.birthday);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should fail with weak password', () => {
      const registerDto = {
        username: 'testuser',
        email: 'weak@example.com',
        password: '123',
        birthday: '2000-01-15',
      };

      return request(app.getHttpServer())
        .post('/api/user/register')
        .send(registerDto)
        .expect(400);
    });

    it('should fail when user already exists', () => {
      const registerDto = {
        username: 'duplicate',
        email: 'duplicate@example.com',
        password: 'SecurePassword123!',
        birthday: '2000-01-15',
      };

      return request(app.getHttpServer())
        .post('/api/user/register')
        .send(registerDto)
        .then(() => {
          return request(app.getHttpServer())
            .post('/api/user/register')
            .send(registerDto)
            .expect(400);
        });
    });

    it('should fail with invalid email', () => {
      const registerDto = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'SecurePassword123!',
        birthday: '2000-01-15',
      };

      return request(app.getHttpServer())
        .post('/api/user/register')
        .send(registerDto)
        .expect(400);
    });

    it('should fail with invalid birthday', () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePassword123!',
        birthday: 'invalid-date',
      };

      return request(app.getHttpServer())
        .post('/api/user/register')
        .send(registerDto)
        .expect(400);
    });

    it('should fail if user is too young', () => {
      const today = new Date();
      const tooYoungBirthday = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate())
        .toISOString()
        .split('T')[0];

      const registerDto = {
        username: 'tooyoung',
        email: 'tooyoung@example.com',
        password: 'SecurePassword123!',
        birthday: tooYoungBirthday,
      };

      return request(app.getHttpServer())
        .post('/api/user/register')
        .send(registerDto)
        .expect(400);
    });

    it('should fail with short username', () => {
      const registerDto = {
        username: 'ab',
        email: 'test@example.com',
        password: 'SecurePassword123!',
        birthday: '2000-01-15',
      };

      return request(app.getHttpServer())
        .post('/api/user/register')
        .send(registerDto)
        .expect(400);
    });
  });

  describe('POST /api/user/login', () => {
    beforeEach(async () => {
      const registerDto = {
        username: 'logintest',
        email: 'login@example.com',
        password: 'SecurePassword123!',
        birthday: '2000-01-15',
      };

      await request(app.getHttpServer())
        .post('/api/user/register')
        .send(registerDto);
    });

    it('should login successfully with correct credentials', () => {
      const loginDto = {
        email: 'login@example.com',
        password: 'SecurePassword123!',
      };

      return request(app.getHttpServer())
        .post('/api/user/login')
        .send(loginDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe(loginDto.email);
          expect(res.body.username).toBe('logintest');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should fail with incorrect password', () => {
      const loginDto = {
        email: 'login@example.com',
        password: 'WrongPassword123!',
      };

      return request(app.getHttpServer())
        .post('/api/user/login')
        .send(loginDto)
        .expect(404);
    });

    it('should fail with non-existent email', () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'SecurePassword123!',
      };

      return request(app.getHttpServer())
        .post('/api/user/login')
        .send(loginDto)
        .expect(404);
    });
  });
});
