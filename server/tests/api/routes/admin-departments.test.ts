import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { adminDepartmentRouter } from '../../../src/routes/admin/departments';

describe('Admin Department Routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/admin/departments', adminDepartmentRouter);

  it('GET /api/admin/departments - should reject without auth', async () => {
    const res = await request(app).get('/api/admin/departments');
    expect(res.status).toBe(401);
  });

  it('POST /api/admin/departments - should reject without auth', async () => {
    const res = await request(app)
      .post('/api/admin/departments')
      .send({ name: '内科', description: '内科科室' });
    expect(res.status).toBe(401);
  });
});
