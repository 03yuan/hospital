import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { departmentRouter } from '../../../src/routes/departments';

describe('Patient Department Routes', () => {
  const app = express();
  app.use('/api/departments', departmentRouter);

  it('GET /api/departments - should return department list', async () => {
    const res = await request(app).get('/api/departments');
    expect(res.status).toBe(200);
  });
});
