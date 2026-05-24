import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { authRouter } from '../../../src/routes/auth';

vi.mock('../../../src/utils/jwt', () => ({
  generateToken: vi.fn(() => 'mock-token'),
  verifyToken: vi.fn(() => ({ userId: 1, phone: '13800138000', role: 'PATIENT' })),
}));

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRouter);
  return app;
}

const mockUserRepo = {
  findByPhone: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
};

vi.mock('../../../src/domain/repositories/IUserRepository', () => ({}));

describe('Auth Routes', () => {
  const app = createTestApp();

  it('POST /api/auth/register - should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ phone: '13800138000', password: '123456', name: '张三' });

    expect(res.status).toBe(201);
  });

  it('POST /api/auth/login - should reject invalid phone', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ phone: '13900000000', password: '123456' });

    expect(res.status).toBe(401);
  });

  it('POST /api/auth/register - should reject empty name', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ phone: '13800138000', password: '123456', name: '' });

    expect(res.status).toBe(400);
  });
});
